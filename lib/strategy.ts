import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic();
const MODEL = 'claude-opus-4-5';

export interface PlayerSummary {
  player: number;
  username: string;
  rank: string | null;
  playstyle: string | null;
  role: string | null;
  strengths: string[];
  weaknesses: string[];
  topOperators: any[];
  mapPerformance: {
    best: any[];
    worst: any[];
  };
}

export interface StrategyPayload {
  mapOverview: string;
  attackPlan: {
    sitePriority: string;
    operatorPicks: { player: number; operator: string; reason: string }[];
    executeStrategy: string;
  };
  defensePlan: {
    sitePriority: string[];
    operatorPicks: { player: number; operator: string; reason: string }[];
    setupStrategy: string;
  };
  keyCallouts: string[];
  squadWeaknesses: string;
}

function parseStrategyJSON(text: string): StrategyPayload {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

const BASE_SYSTEM = `You are a Rainbow Six Siege coach building team strategy for a 5-stack (or partial stack). You understand pro-league meta, map-specific site priorities, operator synergies, and how to assign roles based on individual playstyles. Be direct and tactical — real callouts, real setups, real operator picks.`;

const BLUEPRINT_ADDENDUM = `\n\nYou have been provided with the official top-down blueprints of the map, one image per floor. Reference specific locations, breakable walls, and line-of-sight opportunities you observe in the blueprints. Be precise — if you can see a wall is breakable in the blueprint (yellow/black hatching), you can recommend breaching it.`;

export async function generateSquadStrategy(
  squadSummary: PlayerSummary[],
  mapName: string,
  blueprintPaths?: string[]
): Promise<StrategyPayload> {
  const hasBlueprints = blueprintPaths && blueprintPaths.length > 0;
  const systemPrompt = hasBlueprints ? BASE_SYSTEM + BLUEPRINT_ADDENDUM : BASE_SYSTEM;

  // Build content blocks: blueprints first (if any), then text prompt
  const content: any[] = [];

  if (hasBlueprints) {
    for (const filePath of blueprintPaths) {
      const data = fs.readFileSync(filePath).toString('base64');
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/jpeg',
          data,
        },
      });
    }
  }

  content.push({
    type: 'text',
    text: `Build a squad strategy for ${mapName}. Use each player's playstyle, role, and operator pool when making assignments.

Squad: ${JSON.stringify(squadSummary, null, 2)}

Return ONLY JSON with:
- mapOverview: 1-2 sentences about how this map plays and what wins on it
- attackPlan: object with { sitePriority: "preferred site to attack with reasoning", operatorPicks: array of { player: 1-${squadSummary.length}, operator: "name", reason: "short reasoning" }, executeStrategy: "2-3 sentences on the actual execute" }
- defensePlan: object with { sitePriority: array of 2 sites in preferred order, operatorPicks: array of { player: 1-${squadSummary.length}, operator, reason }, setupStrategy: "2-3 sentences on the defensive setup" }
- keyCallouts: array of 3-5 specific map callouts or tactical reminders for this squad
- squadWeaknesses: 1-2 sentences on what this squad composition is vulnerable to

No code fences.`,
  });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });

  const text = (response.content[0] as any).text;

  try {
    return parseStrategyJSON(text);
  } catch {
    const retry = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [{
        role: 'user',
        content: `The following text was supposed to be valid JSON but failed to parse. Fix it and return ONLY the corrected valid JSON, nothing else:\n\n${text}`,
      }],
    });
    return parseStrategyJSON((retry.content[0] as any).text);
  }
}
