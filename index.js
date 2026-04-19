import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const client = new Anthropic();
const MODEL = 'claude-opus-4-5';

// ---------- Helper: Load all screenshots from a folder as image blocks ----------

function loadScreenshots(folderPath) {
  const files = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
  
  return files.map(file => {
    const data = fs.readFileSync(path.join(folderPath, file)).toString('base64');
    const ext = path.extname(file).toLowerCase();
    return {
      type: 'image',
      source: {
        type: 'base64',
        media_type: ext === '.png' ? 'image/png' : 'image/jpeg',
        data: data,
      },
    };
  });
}

// ---------- Helper: Extract stats JSON from screenshots ----------

async function extractStats(imageBlocks) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: [
        ...imageBlocks,
        {
          type: 'text',
          text: `Extract Rainbow Six Siege stats from these Tracker Network screenshots into ONE JSON object:
- username, kd, winRate, headshotPercentage, matchesPlayed, rank
- topOperators: array of { name, winRate, kd, role }
- bestMaps: array of { name, winRate }
- worstMaps: array of { name, winRate }
Use null for missing data. Return ONLY the JSON, no code fences.`,
        },
      ],
    }],
  });
  
  const text = response.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

// ---------- Helper: Generate individual player coaching ----------

async function coachPlayer(stats) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: `You are an expert Rainbow Six Siege coach with deep knowledge of operator meta, map strategy, and pro-league tactics. Every tip must reference specific stats or R6 mechanics — never generic advice.`,
    messages: [{
      role: 'user',
      content: `Classify this player for a squad-strategy context. Return ONLY JSON:
- playstyleLabel: short label
- role: one of ["Entry Fragger", "Support", "Anchor", "Roamer", "Hard Breach", "Intel", "Flex"]
- strengths: array of 2 short strings
- weaknesses: array of 2 short strings

Player: ${JSON.stringify(stats, null, 2)}
Return ONLY the JSON, no code fences.`,
    }],
  });
  
  const text = response.content[0].text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

// ---------- Helper: Analyze one player end-to-end ----------

async function analyzePlayer(folderPath) {
  console.log(`  Analyzing ${folderPath}...`);
  const images = loadScreenshots(folderPath);
  if (images.length === 0) {
    console.log(`    No screenshots in ${folderPath}, skipping.`);
    return null;
  }
  const stats = await extractStats(images);
  const coaching = await coachPlayer(stats);
  return { stats, coaching };
}

// ---------- Main: Run squad analysis ----------

const mapName = process.argv[2] || 'Clubhouse';
console.log(`\nSquad analysis for map: ${mapName}\n`);

const squadDir = 'squads';
const playerFolders = fs.readdirSync(squadDir)
  .filter(f => fs.statSync(path.join(squadDir, f)).isDirectory())
  .sort();

console.log(`Found ${playerFolders.length} player folder(s): ${playerFolders.join(', ')}\n`);

const players = [];
for (const folder of playerFolders) {
  const result = await analyzePlayer(path.join(squadDir, folder));
  if (result) players.push(result);
}

if (players.length === 0) {
  console.error('No players analyzed — add screenshots to squads/player1, squads/player2, etc.');
  process.exit(1);
}

// ---------- Squad strategy call ----------

console.log('\nGenerating squad strategy...');

const squadSummary = players.map((p, i) => ({
  player: i + 1,
  username: p.stats.username,
  rank: p.stats.rank,
  playstyle: p.coaching.playstyleLabel,
  role: p.coaching.role,
  strengths: p.coaching.strengths,
  weaknesses: p.coaching.weaknesses,
  topOperators: p.stats.topOperators,
  mapPerformance: {
    best: p.stats.bestMaps,
    worst: p.stats.worstMaps,
  },
}));

const strategy = await client.messages.create({
  model: MODEL,
  max_tokens: 3000,
  system: `You are a Rainbow Six Siege coach building team strategy for a 5-stack (or partial stack). You understand pro-league meta, map-specific site priorities, operator synergies, and how to assign roles based on individual playstyles. Be direct and tactical — real callouts, real setups, real operator picks.`,
  messages: [{
    role: 'user',
    content: `Build a squad strategy for ${mapName}. Use each player's playstyle, role, and operator pool when making assignments.

Squad: ${JSON.stringify(squadSummary, null, 2)}

Return ONLY JSON with:
- mapOverview: 1-2 sentences about how this map plays and what wins on it
- attackPlan: object with { sitePriority: "preferred site to attack with reasoning", operatorPicks: array of { player: 1-5, operator: "name", reason: "short reasoning" }, executeStrategy: "2-3 sentences on the actual execute" }
- defensePlan: object with { sitePriority: array of 2 sites in preferred order, operatorPicks: array of { player: 1-5, operator, reason }, setupStrategy: "2-3 sentences on the defensive setup" }
- keyCallouts: array of 3-5 specific map callouts or tactical reminders for this squad
- squadWeaknesses: 1-2 sentences on what this squad composition is vulnerable to

No code fences.`,
  }],
});

const strategyText = strategy.content[0].text.replace(/```json|```/g, '').trim();
const plan = JSON.parse(strategyText);

// ---------- Pretty print ----------

console.log('\n========================================');
console.log(`  SQUAD STRATEGY — ${mapName.toUpperCase()}`);
console.log('========================================\n');

console.log('ROSTER:');
players.forEach((p, i) => {
  console.log(`  Player ${i + 1}: ${p.stats.username} (${p.stats.rank || 'Unranked'}) — ${p.coaching.role}`);
});

console.log(`\nMAP OVERVIEW:\n  ${plan.mapOverview}`);

console.log('\n--- ATTACK ---');
console.log(`Site priority: ${plan.attackPlan.sitePriority}`);
console.log('Operator picks:');
plan.attackPlan.operatorPicks.forEach(p => {
  console.log(`  Player ${p.player} → ${p.operator}: ${p.reason}`);
});
console.log(`Execute:\n  ${plan.attackPlan.executeStrategy}`);

console.log('\n--- DEFENSE ---');
console.log(`Site priority: ${plan.defensePlan.sitePriority.join(' > ')}`);
console.log('Operator picks:');
plan.defensePlan.operatorPicks.forEach(p => {
  console.log(`  Player ${p.player} → ${p.operator}: ${p.reason}`);
});
console.log(`Setup:\n  ${plan.defensePlan.setupStrategy}`);

console.log('\nKEY CALLOUTS:');
plan.keyCallouts.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));

console.log(`\nSQUAD WEAKNESSES:\n  ${plan.squadWeaknesses}\n`);