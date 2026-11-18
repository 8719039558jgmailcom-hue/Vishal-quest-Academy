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

  const refreshState = useCallback(async () => {
    try {
      const res = await fetch('/api/multiplayer/state');
      if (!res.ok) return;
      const data = (await res.json()) as {
        onlineCount?: number;
        leaderboard?: LeaderboardEntry[];
        squads?: StudySquad[];
        duels?: DuelRoom[];
      };
      if (typeof data.onlineCount === 'number') setOnlineCount(data.onlineCount);
      if (Array.isArray(data.leaderboard)) setLeaderboard(data.leaderboard);
      if (Array.isArray(data.squads)) setSquads(data.squads);
      if (Array.isArray(data.duels)) setDuels(data.duels);
    } catch {
      // Ignore network errors while reconnecting
    }
  }, []);

  useEffect(() => {
    if (!enabled || !heroId) return;
    let isDisposed = false;

    const connect = () => {
      if (isDisposed) return;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        ws.send(JSON.stringify({ type: 'auth:bind', heroId }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as {
            type: string;
            onlineCount?: number;
            leaderboard?: LeaderboardEntry[];
            squads?: StudySquad[];
            duels?: DuelRoom[];
            room?: DuelRoom;
            roomId?: string;
            secondsRemaining?: number;
            message?: string;
          };

          if (msg.type === 'state:sync') {
            if (typeof msg.onlineCount === 'number') setOnlineCount(msg.onlineCount);
            if (Array.isArray(msg.leaderboard)) setLeaderboard(msg.leaderboard);
            if (Array.isArray(msg.squads)) setSquads(msg.squads);
            if (Array.isArray(msg.duels)) setDuels(msg.duels);
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
          } else if (msg.type === 'duel:tick' && msg.roomId && typeof msg.secondsRemaining === 'number') {
            setDuels((prev) =>
              prev.map((d) =>
                d.id === msg.roomId ? { ...d, roundSecondsRemaining: msg.secondsRemaining! } : d
              )
            );
          } else if (msg.type === 'error' && msg.message) {
            setLastError(msg.message);
          }
        } catch {
          // Ignore malformed WS payloads
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (!isDisposed) {
          reconnectTimerRef.current = window.setTimeout(connect, 2200);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    refreshState();
    connect();

    return () => {
      isDisposed = true;
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enabled, heroId, refreshState]);

  const sendMessage = useCallback(
    (payload: Record<string, unknown>) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ ...payload, heroId }));
      } else {
        setLastError('Connecting to live academy arena... please try again in a moment.');
      }
    },
    [heroId]
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
    createSquad: (name, grade, focusSubject) =>
      sendMessage({ type: 'squad:create', name, grade, focusSubject }),
    joinSquad: (codeOrId) => sendMessage({ type: 'squad:join', codeOrId }),
    leaveSquad: (squadId) => sendMessage({ type: 'squad:leave', squadId }),
    sendSquadChat: (squadId, text) => sendMessage({ type: 'squad:chat', squadId, text }),
    createDuel: (title, grade, subjectId) =>
      sendMessage({ type: 'duel:create', title, grade, subjectId }),
    joinDuel: (codeOrId) => sendMessage({ type: 'duel:join', codeOrId }),
    startDuel: (roomId) => sendMessage({ type: 'duel:start', roomId }),
    answerDuel: (roomId, round, selectedIndex) =>
      sendMessage({ type: 'duel:answer', roomId, round, selectedIndex }),
    sendDuelTaunt: (roomId, emoji, text) =>
      sendMessage({ type: 'duel:taunt', roomId, emoji, text }),
    leaveDuel: (roomId) => sendMessage({ type: 'duel:leave', roomId }),
  };
}
