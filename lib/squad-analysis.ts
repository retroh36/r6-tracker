import Anthropic from '@anthropic-ai/sdk';
import type { PlayerSummary } from './strategy';

const client = new Anthropic();
const MODEL = 'claude-opus-4-5';

export interface SquadAnalysis {
  teamIdentity: {
    label: string;
    summary: string;
  };
  compositionGaps: {
    gap: string;
    impact: string;
    fix: string;
  }[];
  pairings: {
    playerA: string;
    playerB: string;
    synergy: string;
  }[];
  bestMaps: {
    map: string;
    reason: string;
  }[];
  worstMaps: {
    map: string;
    reason: string;
  }[];
  recommendations: string[];
}

function parseAnalysisJSON(text: string): SquadAnalysis {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function generateSquadAnalysis(
  players: PlayerSummary[]
): Promise<SquadAnalysis> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: `You are a Rainbow Six Siege squad analyst. You evaluate team composition, role coverage, operator synergies, and map pool strength for ranked 5-stacks (or partial stacks of 3-4). Reference specific players by name in every section. Be concrete and tactical — never generic. Keep total output concise.`,
    messages: [{
      role: 'user',
      content: `Analyze this squad's composition and produce a team-level report.

Squad: ${JSON.stringify(players, null, 2)}

Return ONLY JSON with:
- teamIdentity: { label: "short squad archetype label", summary: "2-3 sentences describing the squad's overall playstyle as a team" }
- compositionGaps: array of 2-3 objects { gap: "what's missing", impact: "why it matters", fix: "concrete fix" }
- pairings: array of 2-3 objects { playerA: "username", playerB: "username", synergy: "1 sentence describing their synergy" }
- bestMaps: array of 2-3 objects { map: "map name", reason: "why this squad is strong here, reference specific players" }
- worstMaps: array of 2-3 objects { map: "map name", reason: "why this squad struggles here, reference specific players" }
- recommendations: array of 3-5 strings, each a single concrete actionable sentence referencing specific players

No code fences.`,
    }],
  });

  const text = (response.content[0] as any).text;

  try {
    return parseAnalysisJSON(text);
  } catch {
    const retry = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `The following text was supposed to be valid JSON but failed to parse. Fix it and return ONLY the corrected valid JSON, nothing else:\n\n${text}`,
      }],
    });
    return parseAnalysisJSON((retry.content[0] as any).text);
  }
}
