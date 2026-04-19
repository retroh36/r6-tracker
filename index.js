import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();

// ---------- STEP 1: Extract stats from the screenshot ----------

console.log('Reading screenshot...');
const imageData = fs.readFileSync('test-stats.png').toString('base64');

console.log('Extracting stats with Claude vision...');
const extraction = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: imageData,
          },
        },
        {
          type: 'text',
          text: 'Extract the Rainbow Six Siege player stats from this Tracker Network screenshot. Return ONLY a JSON object with these fields: username, kd, winRate, headshotPercentage, matchesPlayed, topOperators (array of operator names if visible). Use null for any field not visible. No explanation, just the JSON.',
        },
      ],
    },
  ],
});

const rawStatsText = extraction.content[0].text;
const cleanedStats = rawStatsText.replace(/```json|```/g, '').trim();
const stats = JSON.parse(cleanedStats);

console.log('\nExtracted stats:');
console.log(stats);

// ---------- STEP 2: Send those stats back to Claude for coaching ----------

console.log('\nAnalyzing playstyle...');

const coaching = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1500,
  system: `You are an expert Rainbow Six Siege coach. You have deep knowledge of operator meta, map strategy, pro league tactics, and playstyle analysis. When given a player's stats, you identify their likely playstyle, strengths, weaknesses, and give concrete actionable tips. You are direct, honest, and specific. You never give generic advice like "practice more" — every tip must reference something concrete about their stats or R6 gameplay.`,
  messages: [
    {
      role: 'user',
      content: `Analyze this Rainbow Six Siege player and return ONLY a JSON object with these fields:
- playstyleLabel: a short label like "Aggressive Entry Fragger", "Patient Anchor", "Support Roamer", etc.
- playstyleExplanation: 1-2 sentences explaining why you chose that label
- strengths: array of 3 specific strengths based on the stats
- weaknesses: array of 3 specific weaknesses
- tips: array of 3 concrete, actionable tips tailored to this player

Player stats:
${JSON.stringify(stats, null, 2)}

Return only the JSON object. No preamble, no markdown code fences.`,
    },
  ],
});

const rawCoachingText = coaching.content[0].text;
const cleanedCoaching = rawCoachingText.replace(/```json|```/g, '').trim();
const analysis = JSON.parse(cleanedCoaching);

console.log('\n=== COACHING REPORT ===\n');
console.log(`Player: ${stats.username}`);
console.log(`Playstyle: ${analysis.playstyleLabel}`);
console.log(`\n${analysis.playstyleExplanation}`);
console.log('\nStrengths:');
analysis.strengths.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
console.log('\nWeaknesses:');
analysis.weaknesses.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
console.log('\nTips:');
analysis.tips.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
console.log('');