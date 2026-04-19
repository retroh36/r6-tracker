// ================================================================
// R6 SQUAD ANALYZER — shared mock data (from design handoff)
// ================================================================

export const PLAYER = {
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
    { name: 'ASH',    role: 'ATK', pick: 28, kd: 1.58, wr: 61 },
    { name: 'ZOFIA',  role: 'ATK', pick: 22, kd: 1.44, wr: 56 },
    { name: 'JÄGER',  role: 'DEF', pick: 18, kd: 1.31, wr: 59 },
    { name: 'BANDIT', role: 'DEF', pick: 14, kd: 1.22, wr: 54 },
    { name: 'IANA',   role: 'ATK', pick:  9, kd: 1.18, wr: 52 },
  ],
  squadAvg: { kd: 1.21, winRate: 55, headshot: 36, avgDamage: 128 },
};

export const SQUAD = {
  name: 'GHOST-07',
  tag: 'GHT',
  slots: 5,
  members: [
    { id: 1, username: 'vexel.py',    role: 'ENTRY',       kd: 1.42, wr: 58, status: 'ready', avatar: { initials: 'VX', theme: 'h-r' } },
    { id: 2, username: 'kraitzen',    role: 'SUPPORT',     kd: 1.18, wr: 54, status: 'ready', avatar: { initials: 'KR', theme: 'h-b' } },
    { id: 3, username: 'm0rsecode',   role: 'INTEL',       kd: 1.09, wr: 61, status: 'ready', avatar: { initials: 'MS', theme: 'h-g' } },
    { id: 4, username: 'hexboy.exe',  role: 'ROAMER',      kd: 1.31, wr: 51, status: 'ready', avatar: { initials: 'HX', theme: 'h-a' } },
    { id: 5, username: 'quinoa.shot', role: 'HARD BREACH', kd: 1.05, wr: 59, status: 'pending', avatar: { initials: 'QN', theme: 'h-p' } },
  ],
  sessions: 47,
  lastPlayed: '2h ago',
};

export const COACH_REPORT = {
  archetype: 'ENTRY FRAGGER',
  subtype: 'AGGRESSIVE · LANE-HOLDER',
  confidence: 84,
  summary: "You play fast, peek first, and carry early rounds. Your 2.1 entry kills per game is top-quartile. But you bleed value after the plant — over-peeking and low clutch conversion are dragging your W/L.",
  strengths: [
    { t: 'Elite entry timing',       d: 'Avg time-to-first-engage is 14.2s — faster than 78% of Diamonds.' },
    { t: 'High first-blood rate',    d: '2.1 entry kills per game. You set tempo for the squad.' },
    { t: 'Aggressive site pressure', d: 'Secures plant 34% of rounds — well above squad average.' },
  ],
  weaknesses: [
    { t: 'Over-peeks in post-plant', d: 'You die while plant is ticking in 46% of plant rounds. Trade, don\'t hero.' },
    { t: 'Low clutch conversion',    d: '22% win rate in 1vX scenarios. You push instead of isolating.' },
    { t: 'Utility spend on entry',   d: 'You throw nades for damage, not info. Frags rarely kill.' },
  ],
  recommendedOps: [
    { name: 'ZOFIA',     role: 'ATK', reason: 'Keeps your entry speed but adds self-revive for your post-plant habit.',           confidence: 92 },
    { name: 'IANA',      role: 'ATK', reason: 'Forces you to scout before peeking — fixes over-extension.',                       confidence: 87 },
    { name: 'BLACKBEARD', role: 'ATK', reason: 'Rewards your peek-first instinct with a margin for trade-error.',                  confidence: 81 },
  ],
  underutilized: [
    { name: 'BUCK',   why: 'Vertical play matches your speed archetype. 0% pickrate.' },
    { name: 'NOMAD',  why: 'Airjabs punish roamers — counters your top death source.' },
    { name: 'LESION', why: 'Low-effort intel + chip damage. Raises your floor on defense.' },
  ],
  drills: [
    { t: 'Peek-reset drill',        d: '10min TDM, force corner-swap after every kill. Fixes repeat-angle deaths.' },
    { t: 'Plant-trade scenarios',    d: 'Play post-plant on TTS with squad. Mandatory trade-calls before peeking.' },
    { t: '1vX isolation practice',   d: 'Custom games, 1v3 on Coastline B. Force cut-off before engaging.' },
  ],
};

export const MAPS = [
  'COASTLINE', 'CLUBHOUSE', 'OREGON', 'BANK', 'BORDER',
  'CONSULATE', 'CHALET', 'KAFE DOSTOYEVSKY', 'VILLA', 'NIGHTHAVEN LABS',
  'SKYSCRAPER', 'THEME PARK',
];

export const STRATEGY_DATA = {
  ops: {
    ATK: [
      { username: 'vexel.py',    initials: 'VX', theme: 'h-r', op: 'ZOFIA',    role: 'ENTRY',       note: 'Concuss + entry Sunrise' },
      { username: 'kraitzen',    initials: 'KR', theme: 'h-b', op: 'THATCHER', role: 'SUPPORT',     note: 'EMPs for Hibana breach' },
      { username: 'm0rsecode',   initials: 'MS', theme: 'h-g', op: 'IANA',     role: 'INTEL',       note: 'Scout replica, hold flank' },
      { username: 'hexboy.exe',  initials: 'HX', theme: 'h-a', op: 'ASH',      role: 'LURK',        note: 'Flank through Kitchen' },
      { username: 'quinoa.shot', initials: 'QN', theme: 'h-p', op: 'HIBANA',   role: 'HARD BREACH', note: 'Vertical Hookah ceiling' },
    ],
    DEF: [
      { username: 'vexel.py',    initials: 'VX', theme: 'h-r', op: 'JÄGER',    role: 'ANCHOR',    note: 'ADS pit, hold angle' },
      { username: 'kraitzen',    initials: 'KR', theme: 'h-b', op: 'MIRA',     role: 'ANCHOR',    note: 'Mirror wall Sunrise' },
      { username: 'm0rsecode',   initials: 'MS', theme: 'h-g', op: 'VALKYRIE', role: 'INTEL',     note: 'Cam: Penthouse, Hookah, Ext' },
      { username: 'hexboy.exe',  initials: 'HX', theme: 'h-a', op: 'CAVEIRA',  role: 'ROAMER',    note: 'Roam Kitchen → Billiards' },
      { username: 'quinoa.shot', initials: 'QN', theme: 'h-p', op: 'BANDIT',   role: 'ELECTRICS', note: 'Trick reinforced walls' },
    ],
  },
  execs: {
    'ATK-A': [
      { n: '01', t: 'Iana scouts VIP from Service — confirm anchor + utility', at: 'T-0:42' },
      { n: '02', t: 'Thatcher EMPs Billiards wall + Blue stairs hatch',       at: 'T-0:30' },
      { n: '03', t: 'Hibana opens Blue wall, Zofia concusses through',        at: 'T-0:18' },
      { n: '04', t: 'Ash entries Billiards, Zofia trades, Iana holds flank',  at: 'T-0:08' },
    ],
    'ATK-B': [
      { n: '01', t: 'Iana clears Hookah from Pool — ID anchor positions',     at: 'T-0:42' },
      { n: '02', t: 'Thatcher EMPs Hookah ceiling + Sunrise wall',            at: 'T-0:28' },
      { n: '03', t: 'Hibana opens vertical — Zofia concusses through ceiling', at: 'T-0:16' },
      { n: '04', t: 'Ash entries Sunrise, Zofia trades, Iana holds Kitchen',  at: 'T-0:06' },
      { n: '05', t: 'Plant deep Hookah, vexel holds flank callout only',      at: 'T+0:00' },
    ],
    'DEF-A': [
      { n: '01', t: 'Reinforce Blue/Yellow walls + Billiards hatch',          at: 'PREP' },
      { n: '02', t: 'Mira Sunrise wall + trick Blue behind Mira',             at: 'PREP' },
      { n: '03', t: 'Cav roams Kitchen → Billiards; call flank only',         at: 'ACTIVE' },
      { n: '04', t: 'Jäger anchors pit with ADS on VIP door',                 at: 'ACTIVE' },
    ],
    'DEF-B': [
      { n: '01', t: 'Reinforce Hookah Sunrise wall + Pool hatch',             at: 'PREP' },
      { n: '02', t: 'Mira wall Sunrise, trick with Mute + cam drone',         at: 'PREP' },
      { n: '03', t: 'Valk cams: Penthouse door, Hookah ceiling, Ext balcony', at: 'PREP' },
      { n: '04', t: 'Cav lurks Kitchen, pulls flank from Billiards side',     at: 'ACTIVE' },
      { n: '05', t: 'Bandit batteries Sunrise wall — trick every 20s',        at: 'ACTIVE' },
    ],
  },
  callouts: {
    'ATK-B': [
      ['HOOKAH',      'Primary plant — deep left corner, defuser blocks peek from Pool'],
      ['SUNRISE',     'Main breach window — Thatcher EMP from White Stairs'],
      ['KITCHEN',     'Flank watch for Iana — pre-aim Billiards door on rotate'],
      ['PENTHOUSE',   'Valk cam blind spot — safe drone path up stairs'],
      ['EXT BALCONY', 'Secondary plant option if Sunrise fails — less cover'],
      ['POOL',        'Soft-breach vertical option — Hibana backup if Sunrise denied'],
    ],
    'ATK-A': [
      ['BILLIARDS', 'Main site — plant deep corner under window'],
      ['VIP',       'Backup plant — behind bed, harder to defuse'],
      ['BLUE',      'Primary breach wall — Thatcher EMP from Office'],
      ['SERVICE',   'Iana scout window — pre-exec intel'],
      ['BAR',       'Rotate cut-off — pre-fire common peek angle'],
    ],
    'DEF-B': [
      ['HOOKAH',         'Mira wall — ADS from pit, trade through wall'],
      ['SUNRISE',        'Bandit trick wall — batteries every 20s'],
      ['POOL HATCH',     'Reinforced + Kaid later — do not run-out'],
      ['PENTHOUSE DOOR', 'Valk cam #1 — primary flank watch'],
      ['KITCHEN',        'Cav hunt lane — pull after first breach'],
    ],
    'DEF-A': [
      ['BILLIARDS', 'Main anchor — Jäger in pit with ADS'],
      ['VIP',       'Secondary anchor — Mira wall plays'],
      ['BLUE',      'Reinforced + Bandit tricks'],
      ['KITCHEN',   'Cav roam lane — flank watch'],
    ],
  },
};
