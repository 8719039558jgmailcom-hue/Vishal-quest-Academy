import crypto from 'crypto';
import fs from 'fs';
import http from 'http';
import path from 'path';
import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer as createViteServer } from 'vite';
import { MP_BOARD_10_QUESTIONS } from './src/data/mpboard10';
import { MP_BOARD_12_QUESTIONS } from './src/data/mpboard12';
import { EXTRA_MP_QUESTIONS } from './src/data/mpboardExtraQuestions';
import {
  AvatarId,
  DuelParticipant,
  DuelRoom,
  DuelTaunt,
  GradeLevel,
  LeaderboardEntry,
  MPQuestion,
  Medium,
  SquadChatMessage,
  SquadMember,
  StudySquad,
  SubjectId,
} from './src/types/quiz';

interface StoredHeroProfile {
  heroId: string;
  heroName: string;
  passcode: string;
  bioTitle: string;
  mobileNumber?: string;
  mobileVerified?: boolean;
  grade: GradeLevel;
  medium: Medium;
  avatarId: AvatarId;
  customAvatarUrl: string | null;
  totalXP: number;
  dailyStreak: number;
  bestCombo: number;
  duelWins: number;
  clearedStages: Record<string, number>;
  bossesDefeated: string[];
  updatedAt: string;
}

interface StoredSquad {
  id: string;
  code: string;
  name: string;
  grade: GradeLevel;
  focusSubject: SubjectId | 'all';
  leaderHeroId: string;
  squadXP: number;
  memberHeroIds: string[];
  messages: SquadChatMessage[];
  createdAt: string;
}

interface AcademyDatabase {
  profiles: Record<string, StoredHeroProfile>;
  squads: Record<string, StoredSquad>;
}

interface InternalDuelState {
  room: DuelRoom;
  questions: MPQuestion[];
  roundStartedAt: number;
}

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'academy-store.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): AcademyDatabase {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    return { profiles: {}, squads: {} };
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AcademyDatabase>;
    return {
      profiles: parsed.profiles ?? {},
      squads: parsed.squads ?? {},
    };
  } catch {
    return { profiles: {}, squads: {} };
  }
}

let db: AcademyDatabase = loadDatabase();
let persistTimer: NodeJS.Timeout | null = null;

function schedulePersist(): void {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    try {
      ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist academy database:', err);
    }
  }, 200);
}

const socketHeroMap = new Map<WebSocket, string>();
const onlineHeroCounts = new Map<string, number>();
const duelRooms = new Map<string, InternalDuelState>();

function isHeroOnline(heroId: string): boolean {
  return (onlineHeroCounts.get(heroId) ?? 0) > 0;
}

function makeRoomCode(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 4; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${out}`;
}

function sanitizeImageDataUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('data:image/')) return null;
  if (value.length > 380_000) return null;
  return value;
}

function buildLeaderboard(): LeaderboardEntry[] {
  return Object.values(db.profiles)
    .map((p) => ({
      heroId: p.heroId,
      heroName: p.heroName,
      bioTitle: p.bioTitle,
      grade: p.grade,
      avatarId: p.avatarId,
      customAvatarUrl: p.customAvatarUrl,
      totalXP: p.totalXP,
      dailyStreak: p.dailyStreak,
      bossesDefeatedCount: p.bossesDefeated.length,
      duelWins: p.duelWins,
      isOnline: isHeroOnline(p.heroId),
      updatedAt: p.updatedAt,
    }))
    .sort((a, b) => {
      if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
      if (b.duelWins !== a.duelWins) return b.duelWins - a.duelWins;
      return b.bossesDefeatedCount - a.bossesDefeatedCount;
    })
    .slice(0, 50);
}

function serializeSquad(sq: StoredSquad): StudySquad {
  const members: SquadMember[] = sq.memberHeroIds
    .map((hid) => db.profiles[hid])
    .filter((p): p is StoredHeroProfile => Boolean(p))
    .map((p) => ({
      heroId: p.heroId,
      heroName: p.heroName,
      grade: p.grade,
      avatarId: p.avatarId,
      customAvatarUrl: p.customAvatarUrl,
      totalXP: p.totalXP,
      isOnline: isHeroOnline(p.heroId),
    }));

  const calculatedSquadXP =
    sq.squadXP + members.reduce((sum, m) => sum + Math.round(m.totalXP * 0.25), 0);

  return {
    id: sq.id,
    code: sq.code,
    name: sq.name,
    grade: sq.grade,
    focusSubject: sq.focusSubject,
    leaderHeroId: sq.leaderHeroId,
    squadXP: calculatedSquadXP,
    members,
    messages: sq.messages.slice(-40),
    createdAt: sq.createdAt,
  };
}

function listSerializedSquads(): StudySquad[] {
  return Object.values(db.squads)
    .map(serializeSquad)
    .sort((a, b) => b.members.length - a.members.length || b.squadXP - a.squadXP);
}

function listDuelRooms(): DuelRoom[] {
  return Array.from(duelRooms.values())
    .map((d) => d.room)
    .sort((a, b) => {
      const order = { active: 0, waiting: 1, finished: 2 };
      return order[a.status] - order[b.status];
    });
}

function drawDuelQuestions(grade: GradeLevel, subjectId: SubjectId | 'all'): MPQuestion[] {
  const basePool = grade === '10' ? MP_BOARD_10_QUESTIONS : MP_BOARD_12_QUESTIONS;
  const pool = [...basePool, ...EXTRA_MP_QUESTIONS.filter((q) => q.grade === grade)];
  const filtered =
    subjectId === 'all' ? pool : pool.filter((q) => q.subjectId === subjectId);

  // Shuffle while placing at least 1 tricky question inside the 5-round duel
  const tricky = filtered.filter((q) => q.isTricky || q.sourceTag === 'TRICKY 2027');
  const standard = filtered.filter((q) => !q.isTricky && q.sourceTag !== 'TRICKY 2027');

  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const picked: MPQuestion[] = [];
  const shuffledStandard = shuffle(standard);
  const shuffledTricky = shuffle(tricky);

  if (shuffledTricky.length > 0) {
    picked.push(shuffledTricky[0]);
  }
  for (const q of shuffledStandard) {
    if (picked.length >= 5) break;
    picked.push(q);
  }
  for (const q of shuffledTricky.slice(1)) {
    if (picked.length >= 5) break;
    picked.push(q);
  }

  return shuffle(picked);
}

let wssRef: WebSocketServer | null = null;

function broadcast(payload: unknown): void {
  if (!wssRef) return;
  const encoded = JSON.stringify(payload);
  for (const client of wssRef.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(encoded);
    }
  }
}

function broadcastSnapshot(): void {
  broadcast({
    type: 'state:sync',
    onlineCount: onlineHeroCounts.size,
    leaderboard: buildLeaderboard(),
    squads: listSerializedSquads(),
    duels: listDuelRooms(),
  });
}

function finalizeDuel(internal: InternalDuelState): void {
  const { room } = internal;
  if (room.status === 'finished') return;

  room.status = 'finished';
  room.roundSecondsRemaining = 0;

  const ranked = [...room.participants].sort(
    (a, b) => b.score - a.score || b.hp - a.hp || b.correctCount - a.correctCount
  );
  const winner = ranked[0];
  const isTie = ranked.length > 1 && ranked[0].score === ranked[1].score && ranked[0].hp === ranked[1].hp;
  room.winnerHeroId = winner && !isTie ? winner.heroId : null;

  // Award persistent leaderboard XP & Duel Wins
  for (const p of room.participants) {
    const profile = db.profiles[p.heroId];
    if (!profile) continue;
    const isWinner = room.winnerHeroId === p.heroId;
    const xpAward = isWinner ? 250 + Math.round(p.score * 0.25) : 100 + Math.round(p.score * 0.2);
    profile.totalXP += xpAward;
    if (isWinner) {
      profile.duelWins += 1;
    }
    profile.updatedAt = new Date().toISOString();
  }
  schedulePersist();
  broadcast({ type: 'duel:updated', room });
  broadcast({ type: 'leaderboard:updated', leaderboard: buildLeaderboard() });
}

function advanceDuelRound(internal: InternalDuelState): void {
  const { room, questions } = internal;
  if (room.status !== 'active') return;

  const nextIndex = room.currentRound + 1;
  const aliveCount = room.participants.filter((p) => p.hp > 0).length;

  if (nextIndex >= room.totalRounds || (room.participants.length > 1 && aliveCount <= 1)) {
    finalizeDuel(internal);
    return;
  }

  room.currentRound = nextIndex;
  room.roundSecondsRemaining = 25;
  room.currentQuestion = questions[nextIndex] ?? null;
  room.participants.forEach((p) => {
    p.answeredCurrent = false;
    p.lastAnswerCorrect = undefined;
  });
  internal.roundStartedAt = Date.now();
  broadcast({ type: 'duel:updated', room });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, onlineHeroes: onlineHeroCounts.size });
  });

  interface OtpChallengeRecord {
    salt: string;
    codeHash: string;
    expiresAt: number;
    resendAvailableAt: number;
    attemptsRemaining: number;
  }

  interface VerifiedTokenRecord {
    mobile: string;
    expiresAt: number;
  }

  const otpChallenges = new Map<string, OtpChallengeRecord>();
  const verifiedTokens = new Map<string, VerifiedTokenRecord>();

  const normalizeIndianMobile = (raw: unknown): string | null => {
    if (typeof raw !== 'string') return null;
    let digits = raw.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      digits = digits.slice(2);
    } else if (digits.length === 11 && digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    if (!/^[6-9]\d{9}$/.test(digits)) return null;
    return `+91${digits}`;
  };

  const hashOtp = (otp: string, salt: string): string =>
    crypto.createHash('sha256').update(`${otp}:${salt}`).digest('hex');

  app.post('/api/auth/otp/request', (req, res) => {
    const body = req.body as { mobileNumber?: string };
    const normalized = normalizeIndianMobile(body.mobileNumber);
    if (!normalized) {
      res.status(400).json({
        error: 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      });
      return;
    }

    const now = Date.now();
    const existing = otpChallenges.get(normalized);
    if (existing && now < existing.resendAvailableAt) {
      const waitSeconds = Math.ceil((existing.resendAvailableAt - now) / 1000);
      res.status(429).json({
        error: `Please wait ${waitSeconds}s before requesting another OTP.`,
        retryAfterSeconds: waitSeconds,
      });
      return;
    }

    // Cryptographically secure 6-digit OTP generation
    const otpCode = String(crypto.randomInt(100000, 1000000));
    const salt = crypto.randomBytes(16).toString('hex');
    const codeHash = hashOtp(otpCode, salt);
    const expiresInSeconds = 300;
    const resendCooldownSeconds = 30;

    otpChallenges.set(normalized, {
      salt,
      codeHash,
      expiresAt: now + expiresInSeconds * 1000,
      resendAvailableAt: now + resendCooldownSeconds * 1000,
      attemptsRemaining: 5,
    });

    const masked = `${normalized.slice(0, 3)} ••••••${normalized.slice(-4)}`;
    res.json({
      ok: true,
      normalizedMobile: normalized,
      maskedMobile: masked,
      expiresInSeconds,
      resendCooldownSeconds,
      // Sandbox SMS dispatch preview so local & preview users can read the server-generated CSPRNG OTP
      smsPreviewOtp: otpCode,
    });
  });

  app.post('/api/auth/otp/verify', (req, res) => {
    const body = req.body as { mobileNumber?: string; otp?: string };
    const normalized = normalizeIndianMobile(body.mobileNumber);
    if (!normalized) {
      res.status(400).json({ error: 'Invalid mobile number format.' });
      return;
    }

    const cleanedOtp = String(body.otp || '').replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanedOtp)) {
      res.status(400).json({ error: 'Enter the full 6-digit verification code.' });
      return;
    }

    const record = otpChallenges.get(normalized);
    if (!record) {
      res.status(404).json({ error: 'No active OTP found. Please request a new OTP.' });
      return;
    }

    const now = Date.now();
    if (now > record.expiresAt) {
      otpChallenges.delete(normalized);
      res.status(410).json({ error: 'This OTP has expired. Please request a fresh code.' });
      return;
    }

    if (record.attemptsRemaining <= 0) {
      otpChallenges.delete(normalized);
      res.status(429).json({ error: 'Too many invalid attempts. Request a new OTP.' });
      return;
    }

    const candidateHash = hashOtp(cleanedOtp, record.salt);
    const matches = crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(record.codeHash, 'hex')
    );

    if (!matches) {
      record.attemptsRemaining -= 1;
      res.status(401).json({
        error: `Incorrect OTP. ${record.attemptsRemaining} attempt(s) remaining.`,
        attemptsRemaining: record.attemptsRemaining,
      });
      return;
    }

    otpChallenges.delete(normalized);
    const verificationToken = crypto.randomBytes(24).toString('hex');
    verifiedTokens.set(verificationToken, {
      mobile: normalized,
      expiresAt: now + 30 * 60 * 1000,
    });

    res.json({
      verified: true,
      normalizedMobile: normalized,
      verificationToken,
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const body = req.body as {
      heroId?: string;
      heroName?: string;
      passcode?: string;
      bioTitle?: string;
      mobileNumber?: string;
      verificationToken?: string;
      grade?: GradeLevel;
      medium?: Medium;
      avatarId?: AvatarId;
      customAvatarUrl?: string | null;
    };

    const normalizedMobile = normalizeIndianMobile(body.mobileNumber);
    const tokenStr = typeof body.verificationToken === 'string' ? body.verificationToken.trim() : '';
    const tokenRecord = tokenStr ? verifiedTokens.get(tokenStr) : undefined;

    if (
      !normalizedMobile ||
      !tokenRecord ||
      tokenRecord.mobile !== normalizedMobile ||
      Date.now() > tokenRecord.expiresAt
    ) {
      res.status(403).json({
        error: 'Mandatory mobile OTP verification is required before entering the 3D world.',
      });
      return;
    }

    const cleanName = (body.heroName || '').trim().slice(0, 24);
    if (!cleanName) {
      res.status(400).json({ error: 'Hero name is required.' });
      return;
    }

    // Consume the verification token once login proceeds
    verifiedTokens.delete(tokenStr);

    const passcode = (body.passcode || '').trim().slice(0, 24) || 'MP2027';
    const grade: GradeLevel = body.grade === '10' ? '10' : '12';
    const medium: Medium = body.medium === 'hi' ? 'hi' : 'en';
    const avatarId: AvatarId =
      body.avatarId === 'diya-alchemist' || body.avatarId === 'kabir-sage'
        ? body.avatarId
        : 'arya-knight';

    // Match existing profile by verified mobileNumber first, then heroId OR heroName + passcode
    let existing: StoredHeroProfile | undefined = Object.values(db.profiles).find(
      (p) => p.mobileNumber === normalizedMobile
    );
    if (!existing && body.heroId && db.profiles[body.heroId]) {
      existing = db.profiles[body.heroId];
    } else if (!existing) {
      existing = Object.values(db.profiles).find(
        (p) =>
          p.heroName.toLowerCase() === cleanName.toLowerCase() &&
          p.passcode === passcode
      );
    }

    const now = new Date().toISOString();
    const customAvatarUrl =
      body.customAvatarUrl === null
        ? null
        : sanitizeImageDataUrl(body.customAvatarUrl) ?? existing?.customAvatarUrl ?? null;

    if (existing) {
      existing.heroName = cleanName;
      existing.passcode = passcode;
      existing.mobileNumber = normalizedMobile;
      existing.mobileVerified = true;
      existing.bioTitle =
        typeof body.bioTitle === 'string' && body.bioTitle.trim()
          ? body.bioTitle.trim().slice(0, 48)
          : existing.bioTitle;
      existing.grade = grade;
      existing.medium = medium;
      existing.avatarId = avatarId;
      if (body.customAvatarUrl !== undefined) {
        existing.customAvatarUrl = customAvatarUrl;
      }
      existing.updatedAt = now;
      schedulePersist();
      broadcast({ type: 'leaderboard:updated', leaderboard: buildLeaderboard() });
      res.json({ profile: existing, leaderboard: buildLeaderboard() });
      return;
    }

    const heroId =
      body.heroId && body.heroId.trim()
        ? body.heroId.trim()
        : `hero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const created: StoredHeroProfile = {
      heroId,
      heroName: cleanName,
      passcode,
      bioTitle:
        typeof body.bioTitle === 'string' && body.bioTitle.trim()
          ? body.bioTitle.trim().slice(0, 48)
          : `Class ${grade}th Board Challenger`,
      mobileNumber: normalizedMobile,
      mobileVerified: true,
      grade,
      medium,
      avatarId,
      customAvatarUrl,
      totalXP: 0,
      dailyStreak: 1,
      bestCombo: 0,
      duelWins: 0,
      clearedStages: {},
      bossesDefeated: [],
      updatedAt: now,
    };

    db.profiles[heroId] = created;
    schedulePersist();
    broadcast({ type: 'leaderboard:updated', leaderboard: buildLeaderboard() });
    res.json({ profile: created, leaderboard: buildLeaderboard() });
  });

  app.post('/api/profile/sync', (req, res) => {
    const body = req.body as Partial<StoredHeroProfile> & { heroId?: string };
    if (!body.heroId) {
      res.status(400).json({ error: 'heroId is required.' });
      return;
    }

    const existing = db.profiles[body.heroId];
    const now = new Date().toISOString();

    if (!existing) {
      const created: StoredHeroProfile = {
        heroId: body.heroId,
        heroName: (body.heroName || 'Hero').trim().slice(0, 24) || 'Hero',
        passcode: (body.passcode || 'MP2027').slice(0, 24),
        bioTitle: (body.bioTitle || 'MP Board Challenger').slice(0, 48),
        grade: body.grade === '10' ? '10' : '12',
        medium: body.medium === 'hi' ? 'hi' : 'en',
        avatarId:
          body.avatarId === 'diya-alchemist' || body.avatarId === 'kabir-sage'
            ? body.avatarId
            : 'arya-knight',
        customAvatarUrl: sanitizeImageDataUrl(body.customAvatarUrl),
        totalXP: Math.max(0, Number(body.totalXP) || 0),
        dailyStreak: Math.max(1, Number(body.dailyStreak) || 1),
        bestCombo: Math.max(0, Number(body.bestCombo) || 0),
        duelWins: Math.max(0, Number(body.duelWins) || 0),
        clearedStages: body.clearedStages ?? {},
        bossesDefeated: Array.isArray(body.bossesDefeated) ? body.bossesDefeated : [],
        updatedAt: now,
      };
      db.profiles[body.heroId] = created;
    } else {
      if (typeof body.heroName === 'string' && body.heroName.trim()) {
        existing.heroName = body.heroName.trim().slice(0, 24);
      }
      if (typeof body.bioTitle === 'string') {
        existing.bioTitle = body.bioTitle.trim().slice(0, 48) || existing.bioTitle;
      }
      if (body.grade === '10' || body.grade === '12') existing.grade = body.grade;
      if (body.medium === 'en' || body.medium === 'hi') existing.medium = body.medium;
      if (
        body.avatarId === 'arya-knight' ||
        body.avatarId === 'diya-alchemist' ||
        body.avatarId === 'kabir-sage'
      ) {
        existing.avatarId = body.avatarId;
      }
      if (body.customAvatarUrl === null) {
        existing.customAvatarUrl = null;
      } else {
        const sanitized = sanitizeImageDataUrl(body.customAvatarUrl);
        if (sanitized) existing.customAvatarUrl = sanitized;
      }
      if (typeof body.totalXP === 'number') {
        existing.totalXP = Math.max(existing.totalXP, body.totalXP);
      }
      if (typeof body.dailyStreak === 'number') {
        existing.dailyStreak = Math.max(existing.dailyStreak, body.dailyStreak);
      }
      if (typeof body.bestCombo === 'number') {
        existing.bestCombo = Math.max(existing.bestCombo, body.bestCombo);
      }
      if (typeof body.duelWins === 'number') {
        existing.duelWins = Math.max(existing.duelWins, body.duelWins);
      }
      if (body.clearedStages && typeof body.clearedStages === 'object') {
        for (const [k, v] of Object.entries(body.clearedStages)) {
          existing.clearedStages[k] = Math.max(existing.clearedStages[k] ?? 0, Number(v) || 0);
        }
      }
      if (Array.isArray(body.bossesDefeated)) {
        const merged = new Set([...existing.bossesDefeated, ...body.bossesDefeated]);
        existing.bossesDefeated = Array.from(merged);
      }
      existing.updatedAt = now;
    }

    schedulePersist();
    const leaderboard = buildLeaderboard();
    broadcast({ type: 'leaderboard:updated', leaderboard });
    res.json({ profile: db.profiles[body.heroId], leaderboard });
  });

  app.get('/api/leaderboard', (_req, res) => {
    res.json({ leaderboard: buildLeaderboard(), onlineCount: onlineHeroCounts.size });
  });

  app.get('/api/multiplayer/state', (_req, res) => {
    res.json({
      onlineCount: onlineHeroCounts.size,
      leaderboard: buildLeaderboard(),
      squads: listSerializedSquads(),
      duels: listDuelRooms(),
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });
  wssRef = wss;

  // Authoritative duel round countdown loop (1s tick)
  setInterval(() => {
    for (const internal of duelRooms.values()) {
      if (internal.room.status !== 'active') continue;
      if (internal.room.roundSecondsRemaining > 0) {
        internal.room.roundSecondsRemaining -= 1;
        broadcast({ type: 'duel:tick', roomId: internal.room.id, secondsRemaining: internal.room.roundSecondsRemaining });
      }
      if (internal.room.roundSecondsRemaining <= 0) {
        // Apply timeout damage to unanswered participants
        for (const p of internal.room.participants) {
          if (!p.answeredCurrent) {
            p.answeredCurrent = true;
            p.lastAnswerCorrect = false;
            p.streak = 0;
            p.hp = Math.max(0, p.hp - 20);
          }
        }
        advanceDuelRound(internal);
      }
    }
  }, 1000);

  wss.on('connection', (ws) => {
    ws.send(
      JSON.stringify({
        type: 'state:sync',
        onlineCount: onlineHeroCounts.size,
        leaderboard: buildLeaderboard(),
        squads: listSerializedSquads(),
        duels: listDuelRooms(),
      })
    );

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as {
          type: string;
          [key: string]: unknown;
        };

        if (msg.type === 'auth:bind') {
          const heroId = String(msg.heroId || '').trim();
          if (!heroId) return;
          const prevHero = socketHeroMap.get(ws);
          if (prevHero && prevHero !== heroId) {
            onlineHeroCounts.set(prevHero, Math.max(0, (onlineHeroCounts.get(prevHero) ?? 1) - 1));
          }
          if (prevHero !== heroId) {
            socketHeroMap.set(ws, heroId);
            onlineHeroCounts.set(heroId, (onlineHeroCounts.get(heroId) ?? 0) + 1);
          }
          broadcastSnapshot();
          return;
        }

        const heroId = socketHeroMap.get(ws) || String(msg.heroId || '').trim();
        const profile = heroId ? db.profiles[heroId] : undefined;

        if (msg.type === 'squad:create' && profile) {
          const name = String(msg.name || '').trim().slice(0, 32) || `${profile.heroName}'s Squad`;
          const grade: GradeLevel = msg.grade === '10' ? '10' : '12';
          const focusSubject = (msg.focusSubject as SubjectId | 'all') || 'all';
          const squadId = `sq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          const squad: StoredSquad = {
            id: squadId,
            code: makeRoomCode('SQ'),
            name,
            grade,
            focusSubject,
            leaderHeroId: profile.heroId,
            squadXP: 50,
            memberHeroIds: [profile.heroId],
            messages: [
              {
                id: `msg-${Date.now()}`,
                heroId: profile.heroId,
                heroName: profile.heroName,
                text: `Created Study Squad "${name}"! Ready for MP Board conquest.`,
                sentAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
          };
          db.squads[squadId] = squad;
          schedulePersist();
          broadcast({ type: 'squads:updated', squads: listSerializedSquads() });
          return;
        }

        if (msg.type === 'squad:join' && profile) {
          const codeOrId = String(msg.codeOrId || '').trim().toUpperCase();
          const squad = Object.values(db.squads).find(
            (s) => s.id.toUpperCase() === codeOrId || s.code.toUpperCase() === codeOrId
          );
          if (!squad) {
            ws.send(JSON.stringify({ type: 'error', message: 'Study Squad code not found.' }));
            return;
          }
          if (!squad.memberHeroIds.includes(profile.heroId)) {
            squad.memberHeroIds.push(profile.heroId);
            squad.messages.push({
              id: `msg-${Date.now()}`,
              heroId: profile.heroId,
              heroName: profile.heroName,
              text: `${profile.heroName} joined the squad!`,
              sentAt: new Date().toISOString(),
            });
            schedulePersist();
          }
          broadcast({ type: 'squads:updated', squads: listSerializedSquads() });
          return;
        }

        if (msg.type === 'squad:leave' && profile) {
          const squadId = String(msg.squadId || '');
          const squad = db.squads[squadId];
          if (!squad) return;
          squad.memberHeroIds = squad.memberHeroIds.filter((id) => id !== profile.heroId);
          if (squad.memberHeroIds.length === 0) {
            delete db.squads[squadId];
          }
          schedulePersist();
          broadcast({ type: 'squads:updated', squads: listSerializedSquads() });
          return;
        }

        if (msg.type === 'squad:chat' && profile) {
          const squadId = String(msg.squadId || '');
          const text = String(msg.text || '').trim().slice(0, 260);
          const squad = db.squads[squadId];
          if (!squad || !text) return;
          if (!squad.memberHeroIds.includes(profile.heroId)) {
            squad.memberHeroIds.push(profile.heroId);
          }
          squad.messages.push({
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            heroId: profile.heroId,
            heroName: profile.heroName,
            text,
            sentAt: new Date().toISOString(),
          });
          if (squad.messages.length > 60) {
            squad.messages = squad.messages.slice(-60);
          }
          schedulePersist();
          broadcast({ type: 'squads:updated', squads: listSerializedSquads() });
          return;
        }

        if (msg.type === 'duel:create' && profile) {
          const grade: GradeLevel = msg.grade === '10' ? '10' : '12';
          const subjectId = (msg.subjectId as SubjectId | 'all') || 'all';
          const title =
            String(msg.title || '').trim().slice(0, 40) ||
            `${profile.heroName}'s Class ${grade}th Duel`;
          const roomId = `duel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          const questions = drawDuelQuestions(grade, subjectId);

          const participant: DuelParticipant = {
            heroId: profile.heroId,
            heroName: profile.heroName,
            avatarId: profile.avatarId,
            customAvatarUrl: profile.customAvatarUrl,
            hp: 100,
            score: 0,
            correctCount: 0,
            streak: 0,
            answeredCurrent: false,
          };

          const room: DuelRoom = {
            id: roomId,
            code: makeRoomCode('DUEL'),
            title,
            grade,
            subjectId,
            hostHeroId: profile.heroId,
            status: 'waiting',
            currentRound: 0,
            totalRounds: questions.length,
            roundSecondsRemaining: 25,
            currentQuestion: null,
            participants: [participant],
            winnerHeroId: null,
            taunts: [],
          };

          duelRooms.set(roomId, { room, questions, roundStartedAt: Date.now() });
          broadcast({ type: 'duels:updated', duels: listDuelRooms() });
          return;
        }

        if (msg.type === 'duel:join' && profile) {
          const codeOrId = String(msg.codeOrId || '').trim().toUpperCase();
          const entry = Array.from(duelRooms.values()).find(
            (d) => d.room.id.toUpperCase() === codeOrId || d.room.code.toUpperCase() === codeOrId
          );
          if (!entry) {
            ws.send(JSON.stringify({ type: 'error', message: 'Duel room not found.' }));
            return;
          }
          if (entry.room.status === 'finished') {
            ws.send(JSON.stringify({ type: 'error', message: 'That duel has already finished.' }));
            return;
          }
          if (!entry.room.participants.some((p) => p.heroId === profile.heroId)) {
            if (entry.room.participants.length >= 6) {
              ws.send(JSON.stringify({ type: 'error', message: 'Duel room is full.' }));
              return;
            }
            entry.room.participants.push({
              heroId: profile.heroId,
              heroName: profile.heroName,
              avatarId: profile.avatarId,
              customAvatarUrl: profile.customAvatarUrl,
              hp: 100,
              score: 0,
              correctCount: 0,
              streak: 0,
              answeredCurrent: false,
            });
          }
          broadcast({ type: 'duel:updated', room: entry.room });
          broadcast({ type: 'duels:updated', duels: listDuelRooms() });
          return;
        }

        if (msg.type === 'duel:start' && profile) {
          const roomId = String(msg.roomId || '');
          const internal = duelRooms.get(roomId);
          if (!internal || internal.room.status !== 'waiting') return;
          if (internal.room.hostHeroId !== profile.heroId) return;

          internal.room.status = 'active';
          internal.room.currentRound = 0;
          internal.room.roundSecondsRemaining = 25;
          internal.room.currentQuestion = internal.questions[0] ?? null;
          internal.roundStartedAt = Date.now();
          broadcast({ type: 'duel:updated', room: internal.room });
          broadcast({ type: 'duels:updated', duels: listDuelRooms() });
          return;
        }

        if (msg.type === 'duel:answer' && profile) {
          const roomId = String(msg.roomId || '');
          const selectedIndex = Number(msg.selectedIndex);
          const round = Number(msg.round);
          const internal = duelRooms.get(roomId);
          if (!internal || internal.room.status !== 'active') return;
          if (internal.room.currentRound !== round) return;

          const participant = internal.room.participants.find((p) => p.heroId === profile.heroId);
          const currentQ = internal.room.currentQuestion;
          if (!participant || !currentQ || participant.answeredCurrent) return;

          const isCorrect = selectedIndex === currentQ.correctIndex;
          participant.answeredCurrent = true;
          participant.lastAnswerCorrect = isCorrect;

          if (isCorrect) {
            participant.correctCount += 1;
            participant.streak += 1;
            const speedBonus = Math.max(0, internal.room.roundSecondsRemaining * 4);
            const comboBonus = Math.min(80, (participant.streak - 1) * 20);
            participant.score += 120 + speedBonus + comboBonus;
          } else {
            participant.streak = 0;
            participant.hp = Math.max(0, participant.hp - 20);
          }

          broadcast({ type: 'duel:updated', room: internal.room });

          const allAnswered = internal.room.participants.every((p) => p.answeredCurrent);
          if (allAnswered) {
            setTimeout(() => {
              advanceDuelRound(internal);
            }, 900);
          }
          return;
        }

        if (msg.type === 'duel:taunt' && profile) {
          const roomId = String(msg.roomId || '');
          const internal = duelRooms.get(roomId);
          if (!internal) return;
          const emoji = String(msg.emoji || '😤').slice(0, 8);
          const text = String(msg.text || 'Prepare for defeat!').slice(0, 64);
          const taunt: DuelTaunt = {
            id: `taunt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            fromHeroId: profile.heroId,
            fromHeroName: profile.heroName,
            emoji,
            text,
            sentAt: new Date().toISOString(),
          };
          internal.room.taunts = [...internal.room.taunts.slice(-8), taunt];
          broadcast({ type: 'duel:updated', room: internal.room });
          return;
        }

        if (msg.type === 'duel:leave' && profile) {
          const roomId = String(msg.roomId || '');
          const internal = duelRooms.get(roomId);
          if (!internal) return;
          internal.room.participants = internal.room.participants.filter(
            (p) => p.heroId !== profile.heroId
          );
          if (internal.room.participants.length === 0) {
            duelRooms.delete(roomId);
          } else if (internal.room.hostHeroId === profile.heroId) {
            internal.room.hostHeroId = internal.room.participants[0].heroId;
          }
          broadcast({ type: 'duels:updated', duels: listDuelRooms() });
        }
      } catch (err) {
        console.error('WS message parse error:', err);
      }
    });

    ws.on('close', () => {
      const heroId = socketHeroMap.get(ws);
      socketHeroMap.delete(ws);
      if (heroId) {
        const nextCount = Math.max(0, (onlineHeroCounts.get(heroId) ?? 1) - 1);
        if (nextCount === 0) {
          onlineHeroCounts.delete(heroId);
        } else {
          onlineHeroCounts.set(heroId, nextCount);
        }
        broadcastSnapshot();
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Vishal's Quest Academy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
