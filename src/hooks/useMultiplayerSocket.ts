import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DuelRoom,
  GradeLevel,
  LeaderboardEntry,
  StudySquad,
  SubjectId,
} from '../types/quiz';

interface UseMultiplayerSocketResult {
  connected: boolean;
  onlineCount: number;
  leaderboard: LeaderboardEntry[];
  squads: StudySquad[];
  duels: DuelRoom[];
  lastError: string | null;
  clearError: () => void;
  refreshState: () => Promise<void>;
  createSquad: (name: string, grade: GradeLevel, focusSubject: SubjectId | 'all') => void;
  joinSquad: (codeOrId: string) => void;
  leaveSquad: (squadId: string) => void;
  sendSquadChat: (squadId: string, text: string) => void;
  createDuel: (title: string, grade: GradeLevel, subjectId: SubjectId | 'all') => void;
  joinDuel: (codeOrId: string) => void;
  startDuel: (roomId: string) => void;
  answerDuel: (roomId: string, round: number, selectedIndex: number) => void;
  sendDuelTaunt: (roomId: string, emoji: string, text: string) => void;
  leaveDuel: (roomId: string) => void;
}

interface StatePayload {
  onlineCount?: number;
  leaderboard?: LeaderboardEntry[];
  squads?: StudySquad[];
  duels?: DuelRoom[];
}

const BACKOFF_SCHEDULE_MS = [2000, 4000, 8000, 16000];

export function useMultiplayerSocket(
  heroId: string | undefined,
  enabled: boolean
): UseMultiplayerSocketResult {
  const [connected, setConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [squads, setSquads] = useState<StudySquad[]>([]);
  const [duels, setDuels] = useState<DuelRoom[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const keepaliveTimerRef = useRef<number | null>(null);
  const failCountRef = useRef(0);

  const applySnapshot = useCallback((data: StatePayload) => {
    if (typeof data.onlineCount === 'number') setOnlineCount(data.onlineCount);
    if (Array.isArray(data.leaderboard)) setLeaderboard(data.leaderboard);
    if (Array.isArray(data.squads)) setSquads(data.squads);
    if (Array.isArray(data.duels)) setDuels(data.duels);
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const res = await fetch('/api/multiplayer/state');
      if (!res.ok) return;
      const data = (await res.json()) as StatePayload;
      applySnapshot(data);
    } catch {
      // Ignore transient offline errors
    }
  }, [applySnapshot]);

  useEffect(() => {
    if (!enabled || !heroId) {
      setConnected(false);
      return;
    }

    let isDisposed = false;
    failCountRef.current = 0;

    const clearTimers = () => {
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      if (keepaliveTimerRef.current !== null) {
        window.clearInterval(keepaliveTimerRef.current);
        keepaliveTimerRef.current = null;
      }
    };

    const startFallbackPolling = () => {
      if (pollTimerRef.current !== null || isDisposed) return;
      pollTimerRef.current = window.setInterval(() => {
        if (!isDisposed && !document.hidden) {
          refreshState();
        }
      }, 9000);
    };

    const stopFallbackPolling = () => {
      if (pollTimerRef.current !== null) {
        window.clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };

    const closeSocketCleanly = (sock: WebSocket | null) => {
      if (!sock) return;
      sock.onopen = null;
      sock.onmessage = null;
      sock.onerror = null;
      sock.onclose = null;
      if (sock.readyState === WebSocket.OPEN || sock.readyState === WebSocket.CONNECTING) {
        try {
          sock.close(1000, 'cleanup');
        } catch {
          // Ignore closing errors
        }
      }
    };

    const connect = () => {
      if (isDisposed) return;
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        startFallbackPolling();
        return;
      }

      if (wsRef.current) {
        if (
          wsRef.current.readyState === WebSocket.OPEN ||
          wsRef.current.readyState === WebSocket.CONNECTING
        ) {
          return;
        }
        closeSocketCleanly(wsRef.current);
        wsRef.current = null;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${protocol}//${window.location.host}/ws`;

      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch {
        startFallbackPolling();
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        if (isDisposed) {
          closeSocketCleanly(ws);
          return;
        }
        failCountRef.current = 0;
        stopFallbackPolling();
        setConnected(true);
        try {
          ws.send(JSON.stringify({ type: 'auth:bind', heroId }));
        } catch {
          // Ignore send race
        }

        if (keepaliveTimerRef.current !== null) {
          window.clearInterval(keepaliveTimerRef.current);
        }
        keepaliveTimerRef.current = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ type: 'ping' }));
            } catch {
              // Ignore keepalive error
            }
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as StatePayload & {
            type: string;
            room?: DuelRoom;
            roomId?: string;
            secondsRemaining?: number;
            message?: string;
          };

          if (msg.type === 'pong') return;

          if (msg.type === 'state:sync') {
            applySnapshot(msg);
          } else if (msg.type === 'leaderboard:updated' && Array.isArray(msg.leaderboard)) {
            setLeaderboard(msg.leaderboard);
          } else if (msg.type === 'squads:updated' && Array.isArray(msg.squads)) {
            setSquads(msg.squads);
          } else if (msg.type === 'duels:updated' && Array.isArray(msg.duels)) {
            setDuels(msg.duels);
          } else if (msg.type === 'duel:updated' && msg.room) {
            const updatedRoom = msg.room;
            setDuels((prev) => {
              const exists = prev.some((d) => d.id === updatedRoom.id);
              if (!exists) return [updatedRoom, ...prev];
              return prev.map((d) => (d.id === updatedRoom.id ? updatedRoom : d));
            });
          } else if (
            msg.type === 'duel:tick' &&
            msg.roomId &&
            typeof msg.secondsRemaining === 'number'
          ) {
            setDuels((prev) =>
              prev.map((d) =>
                d.id === msg.roomId
                  ? { ...d, roundSecondsRemaining: msg.secondsRemaining! }
                  : d
              )
            );
          } else if (msg.type === 'error' && msg.message) {
            setLastError(msg.message);
          }
        } catch {
          // Ignore malformed WS payloads
        }
      };

      ws.onerror = () => {
        // Browser transitions automatically to onclose after an error; avoid calling ws.close() here
      };

      ws.onclose = () => {
        setConnected(false);
        if (keepaliveTimerRef.current !== null) {
          window.clearInterval(keepaliveTimerRef.current);
          keepaliveTimerRef.current = null;
        }
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
        if (isDisposed) return;

        startFallbackPolling();

        if (failCountRef.current < BACKOFF_SCHEDULE_MS.length) {
          const delay = BACKOFF_SCHEDULE_MS[failCountRef.current];
          failCountRef.current += 1;
          reconnectTimerRef.current = window.setTimeout(connect, delay);
        }
      };
    };

    const handleOnlineOrVisible = () => {
      if (isDisposed || document.hidden) return;
      refreshState();
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        failCountRef.current = 0;
        connect();
      }
    };

    window.addEventListener('online', handleOnlineOrVisible);
    document.addEventListener('visibilitychange', handleOnlineOrVisible);

    refreshState();
    connect();

    return () => {
      isDisposed = true;
      window.removeEventListener('online', handleOnlineOrVisible);
      document.removeEventListener('visibilitychange', handleOnlineOrVisible);
      clearTimers();
      closeSocketCleanly(wsRef.current);
      wsRef.current = null;
      setConnected(false);
    };
  }, [applySnapshot, enabled, heroId, refreshState]);

  const sendMessage = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!heroId) return;

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ ...payload, heroId }));
        return;
      }

      // Automatic HTTP REST fallback when WebSocket is disconnected on weak networks
      try {
        const res = await fetch('/api/multiplayer/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, heroId }),
        });
        const data = (await res.json()) as StatePayload & { error?: string };
        if (!res.ok) {
          setLastError(data.error || 'Action failed. Please check your connection and retry.');
          return;
        }
        applySnapshot(data);
      } catch {
        setLastError('Network unstable. Action could not reach server.');
      }
    },
    [applySnapshot, heroId]
  );

  return {
    connected,
    onlineCount,
    leaderboard,
    squads,
    duels,
    lastError,
    clearError: () => setLastError(null),
    refreshState,
    createSquad: (name, grade, focusSubject) => {
      void sendMessage({ type: 'squad:create', name, grade, focusSubject });
    },
    joinSquad: (codeOrId) => {
      void sendMessage({ type: 'squad:join', codeOrId });
    },
    leaveSquad: (squadId) => {
      void sendMessage({ type: 'squad:leave', squadId });
    },
    sendSquadChat: (squadId, text) => {
      void sendMessage({ type: 'squad:chat', squadId, text });
    },
    createDuel: (title, grade, subjectId) => {
      void sendMessage({ type: 'duel:create', title, grade, subjectId });
    },
    joinDuel: (codeOrId) => {
      void sendMessage({ type: 'duel:join', codeOrId });
    },
    startDuel: (roomId) => {
      void sendMessage({ type: 'duel:start', roomId });
    },
    answerDuel: (roomId, round, selectedIndex) => {
      void sendMessage({ type: 'duel:answer', roomId, round, selectedIndex });
    },
    sendDuelTaunt: (roomId, emoji, text) => {
      void sendMessage({ type: 'duel:taunt', roomId, emoji, text });
    },
    leaveDuel: (roomId) => {
      void sendMessage({ type: 'duel:leave', roomId });
    },
  };
}
