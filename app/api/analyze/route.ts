import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const MODEL = 'claude-opus-4-5';

async function extractStats(imageBlocks: any[]) {
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
- username, platform (PC/XBOX/PS), rank
- kd (K/D ratio as number), winRate (percentage as number), headshotPct (percentage as number)
- matchesPlayed (number), hoursPlayed (number or null)
- avgDamage (per round if visible, number or null)
- topOperators: array of { name (uppercase), role (ATK or DEF), kd (number), winRate (number), pickRate (number, percentage) }
- bestMaps: array of { name, winRate }
- worstMaps: array of { name, winRate }
Use null for any data not visible in the screenshots. Return ONLY valid JSON, no code fences.`,
        },
      ],
    }],
  });

  const text = (response.content[0] as any).text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

async function coachPlayer(stats: any) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2500,
    system: `You are an expert Rainbow Six Siege coach with deep knowledge of operator meta, map strategy, and pro-league tactics. Every tip must reference specific stats or R6 mechanics — never generic advice.`,
    messages: [{
      role: 'user',
      content: `Analyze this player and produce a comprehensive coaching report.

Return ONLY JSON with this exact structure:
{
  "archetype": "one of: ENTRY FRAGGER, ANCHOR, ROAMER, INTEL, SUPPORT, HARD BREACH, FLEX",
  "subtype": "2-3 word descriptor like AGGRESSIVE · LANE-HOLDER",
  "confidence": <number 0-100>,
  "summary": "2-3 sentence coaching summary referencing specific stats from the player data",
  "strengths": [
    { "t": "short title", "d": "1 sentence with specific stat references" },
    { "t": "short title", "d": "1 sentence with specific stat references" },
    { "t": "short title", "d": "1 sentence with specific stat references" }
  ],
  "weaknesses": [
    { "t": "short title", "d": "1 sentence with specific stat references" },
    { "t": "short title", "d": "1 sentence with specific stat references" },
    { "t": "short title", "d": "1 sentence with specific stat references" }
  ],
  "recommendedOps": [
    { "name": "OPERATOR_NAME", "role": "ATK or DEF", "reason": "1 sentence", "confidence": <number 0-100> },
    { "name": "OPERATOR_NAME", "role": "ATK or DEF", "reason": "1 sentence", "confidence": <number 0-100> },
    { "name": "OPERATOR_NAME", "role": "ATK or DEF", "reason": "1 sentence", "confidence": <number 0-100> }
  ],
  "underutilized": [
    { "name": "OPERATOR_NAME", "why": "1 sentence" },
    { "name": "OPERATOR_NAME", "why": "1 sentence" },
    { "name": "OPERATOR_NAME", "why": "1 sentence" }
  ],
  "drills": [
    { "t": "drill name", "d": "1 sentence description" },
    { "t": "drill name", "d": "1 sentence description" },
    { "t": "drill name", "d": "1 sentence description" }
  ]
}

Player stats: ${JSON.stringify(stats, null, 2)}
Return ONLY the JSON, no code fences.`,
    }],
  });

  const text = (response.content[0] as any).text.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('screenshots');

    if (files.length === 0) {
      return NextResponse.json({ error: 'No screenshots provided' }, { status: 400 });
    }

    const imageBlocks = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error('Invalid file');
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const name = file.name.toLowerCase();
        let mediaType: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png';
        if (name.endsWith('.jpg') || name.endsWith('.jpeg')) mediaType = 'image/jpeg';
        else if (name.endsWith('.webp')) mediaType = 'image/webp';

        return {
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: mediaType,
            data: base64,
          },
        };
      })
    );

    const stats = await extractStats(imageBlocks);
    const coaching = await coachPlayer(stats);

    return NextResponse.json({ stats, coaching });
  } catch (err: any) {
    console.error('Analysis error:', err);
    return NextResponse.json(
      { error: err.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
