import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSquadAnalysis } from '@/lib/squad-analysis';
import type { PlayerSummary } from '@/lib/strategy';

export const maxDuration = 60;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: squadId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch squad with members + profiles
  const { data: squad } = await supabase
    .from('squads')
    .select('id, owner_id, squad_members(id, slot, profile_id, profiles(id, ubisoft_username, stats, coaching))')
    .eq('id', squadId)
    .single();

  if (!squad || squad.owner_id !== user.id) {
    return NextResponse.json({ error: 'Squad not found or not owner' }, { status: 403 });
  }

  const members = squad.squad_members || [];
  if (members.length < 3) {
    return NextResponse.json({ error: 'Squad needs at least 3 members for analysis' }, { status: 422 });
  }

  // Build player summaries
  const sortedMembers = [...members].sort((a: any, b: any) => a.slot - b.slot);
  const players: PlayerSummary[] = sortedMembers.map((m: any, i: number) => {
    const p = m.profiles;
    const stats = p?.stats || {};
    const coaching = p?.coaching || {};
    return {
      player: i + 1,
      username: p?.ubisoft_username || `Player ${i + 1}`,
      rank: stats.rank || null,
      playstyle: coaching.archetype || coaching.playstyleLabel || null,
      role: coaching.role || coaching.archetype || null,
      strengths: coaching.strengths
        ? coaching.strengths.map((s: any) => typeof s === 'string' ? s : s.t || s.d || String(s))
        : [],
      weaknesses: coaching.weaknesses
        ? coaching.weaknesses.map((s: any) => typeof s === 'string' ? s : s.t || s.d || String(s))
        : [],
      topOperators: stats.topOperators || [],
      mapPerformance: {
        best: stats.bestMaps || [],
        worst: stats.worstMaps || [],
      },
    };
  });

  try {
    const analysis = await generateSquadAnalysis(players);
    const now = new Date().toISOString();

    const { error: dbError } = await supabase
      .from('squads')
      .update({ analysis, analysis_generated_at: now })
      .eq('id', squadId);

    if (dbError) {
      console.error('Squad analysis DB update failed:', dbError);
    }

    return NextResponse.json({ analysis, analysis_generated_at: now });
  } catch (err: any) {
    console.error('Squad analysis generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Squad analysis failed' },
      { status: 500 }
    );
  }
}
