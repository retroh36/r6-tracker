// ================================================================
// R6 SQUAD ANALYZER — shared data
// ================================================================

const PLAYER = {
  username: 'vexel.py',
  handle: 'VEXEL-01',
  email: 'vex@ghost07.gg',
  platform: 'PC',
  rank: 'DIAMOND III',
  rankPoints: 4280,
  archetype: 'ENTRY',
  archetypeConfidence: 84,
  avatar: { initials: 'VX', theme: 'h-r' },
  stats: {
    kd: 1.42,
    winRate: 58,
    headshot: 41,
    hoursTotal: 1284,
    hoursSeason: 112,
    matches: 318,
    avgDamage: 142,
    entryKills: 2.1,
    plantRate: 34,
    clutchRate: 22,
  },
  topOps: [
    { name: 'ASH',      role: 'ATK', pick: 28, kd: 1.58, wr: 61 },
    { name: 'ZOFIA',    role: 'ATK', pick: 22, kd: 1.44, wr: 56 },
    { name: 'JÄGER',    role: 'DEF', pick: 18, kd: 1.31, wr: 59 },
    { name: 'BANDIT',   role: 'DEF', pick: 14, kd: 1.22, wr: 54 },
    { name: 'IANA',     role: 'ATK', pick:  9, kd: 1.18, wr: 52 },
  ],
  squadAvg: { kd: 1.21, winRate: 55, headshot: 36, avgDamage: 128 },
};

const SQUAD = {
  name: 'GHOST-07',
  tag: 'GHT',
  slots: 5,
  members: [
    { id: 1, username: 'vexel.py',    role: 'ENTRY',       kd: 1.42, wr: 58, status: 'ready', avatar: { initials:'VX', theme:'h-r' } },
    { id: 2, username: 'kraitzen',    role: 'SUPPORT',     kd: 1.18, wr: 54, status: 'ready', avatar: { initials:'KR', theme:'h-b' } },
    { id: 3, username: 'm0rsecode',   role: 'INTEL',       kd: 1.09, wr: 61, status: 'ready', avatar: { initials:'MS', theme:'h-g' } },
    { id: 4, username: 'hexboy.exe',  role: 'ROAMER',      kd: 1.31, wr: 51, status: 'ready', avatar: { initials:'HX', theme:'h-a' } },
    { id: 5, username: 'quinoa.shot', role: 'HARD BREACH', kd: 1.05, wr: 59, status: 'pending', avatar: { initials:'QN', theme:'h-p' } },
  ],
  sessions: 47,
  lastPlayed: '2h ago',
};

// OCR extraction fields — used to fake progressive detection
const OCR_FIELDS = [
  { key: 'username',    label: 'USERNAME',         value: 'vexel.py',   progress: 0 },
  { key: 'platform',    label: 'PLATFORM',         value: 'PC',         progress: 0 },
  { key: 'rank',        label: 'CURRENT RANK',     value: 'DIAMOND III',progress: 0 },
  { key: 'kd',          label: 'K/D RATIO',        value: '1.42',       progress: 0 },
  { key: 'winRate',     label: 'WIN RATE',         value: '58%',        progress: 0 },
  { key: 'headshot',    label: 'HEADSHOT %',       value: '41%',        progress: 0 },
  { key: 'hours',       label: 'HOURS PLAYED',     value: '1,284',      progress: 0 },
  { key: 'matches',     label: 'MATCHES',          value: '318',        progress: 0 },
  { key: 'topOps',      label: 'TOP OPERATORS',    value: '5 detected', progress: 0 },
];

// AI Coach report content
const COACH_REPORT = {
  archetype: 'ENTRY FRAGGER',
  subtype: 'AGGRESSIVE · LANE-HOLDER',
  confidence: 84,
  summary: "You play fast, peek first, and carry early rounds. Your 2.1 entry kills per game is top-quartile. But you bleed value after the plant — over-peeking and low clutch conversion are dragging your W/L.",
  strengths: [
    { t: 'Elite entry timing',     d: 'Avg time-to-first-engage is 14.2s — faster than 78% of Diamonds.' },
    { t: 'High first-blood rate',  d: '2.1 entry kills per game. You set tempo for the squad.' },
    { t: 'Aggressive site pressure', d: 'Secures plant 34% of rounds — well above squad average.' },
  ],
  weaknesses: [
    { t: 'Over-peeks in post-plant', d: 'You die while plant is ticking in 46% of plant rounds. Trade, don\'t hero.' },
    { t: 'Low clutch conversion',    d: '22% win rate in 1vX scenarios. You push instead of isolating.' },
    { t: 'Utility spend on entry',   d: 'You throw nades for damage, not info. Frags rarely kill.' },
  ],
  recommendedOps: [
    { name: 'ZOFIA',    role: 'ATK', reason: 'Keeps your entry speed but adds self-revive for your post-plant habit.', confidence: 92 },
    { name: 'IANA',     role: 'ATK', reason: 'Forces you to scout before peeking — fixes over-extension.',           confidence: 87 },
    { name: 'BLACKBEARD',role: 'ATK',reason: 'Rewards your peek-first instinct with a margin for trade-error.',      confidence: 81 },
  ],
  underutilized: [
    { name: 'BUCK',     why: 'Vertical play matches your speed archetype. 0% pickrate.' },
    { name: 'NOMAD',    why: 'Airjabs punish roamers — counters your top death source.' },
    { name: 'LESION',   why: 'Low-effort intel + chip damage. Raises your floor on defense.' },
  ],
  drills: [
    { t: 'Peek-reset drill',     d: '10min TDM, force corner-swap after every kill. Fixes repeat-angle deaths.' },
    { t: 'Plant-trade scenarios', d: 'Play post-plant on TTS with squad. Mandatory trade-calls before peeking.' },
    { t: '1vX isolation practice', d: 'Custom games, 1v3 on Coastline B. Force cut-off before engaging.' },
  ],
};

// Maps list
const MAPS = [
  'COASTLINE', 'CLUBHOUSE', 'OREGON', 'BANK', 'BORDER',
  'CONSULATE', 'CHALET', 'KAFE DOSTOYEVSKY', 'VILLA', 'NIGHTHAVEN LABS',
  'SKYSCRAPER', 'THEME PARK',
];

window.DATA = { PLAYER, SQUAD, OCR_FIELDS, COACH_REPORT, MAPS };
