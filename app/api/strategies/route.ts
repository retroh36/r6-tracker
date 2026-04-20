import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { findMap, MAPS } from '@/lib/maps';
import { generateSquadStrategy, type PlayerSummary } from '@/lib/strategy';

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const squadId = searchParams.get('squad_id');
  const mapSlug = searchParams.get('map');

  if (!squadId || !mapSlug) {
    return NextResponse.json({ error: 'squad_id and map are required' }, { status: 400 });
  }

  const mapInfo = findMap(mapSlug);
  if (!mapInfo) {
    return NextResponse.json({ error: 'Invalid map' }, { status: 400 });
  }

  const { data } = await supabase
    .from('strategies')
    .select('id, strategy, stats_snapshot, player_count, created_at')
    .eq('squad_id', squadId)
    .eq('map_name', mapInfo.name)
    .single();

  if (!data) {
    return NextResponse.json({ strategy: null });
  }

  return NextResponse.json({
    strategy: data.strategy,
    stats_snapshot: data.stats_snapshot,
    player_count: data.player_count,
    cached: true,
    generated_at: data.created_at,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { squad_id, map_name, force_regenerate } = body;

  if (!squad_id || !map_name) {
    return NextResponse.json({ error: 'squad_id and map_name are required' }, { status: 400 });
  }

  // Validate map
  const mapInfo = findMap(map_name);
  if (!mapInfo) {
    return NextResponse.json({ error: `Invalid map: ${map_name}. Supported: ${MAPS.map(m => m.name).join(', ')}` }, { status: 400 });
  }

  // Verify squad ownership
  const { data: squad } = await supabase
    .from('squads')
    .select('id, owner_id, squad_members(id, slot, profile_id, profiles(id, ubisoft_username, stats, coaching))')
    .eq('id', squad_id)
    .single();

  if (!squad || squad.owner_id !== user.id) {
    return NextResponse.json({ error: 'Squad not found or not owner' }, { status: 403 });
  }

  const members = squad.squad_members || [];
  if (members.length < 3) {
    return NextResponse.json({ error: 'Squad needs at least 3 members for strategy generation' }, { status: 422 });
  }
  if (members.length > 5) {
    return NextResponse.json({ error: 'Squad has too many members' }, { status: 422 });
  }

  // Check cache
  if (!force_regenerate) {
    const { data: cached } = await supabase
      .from('strategies')
      .select('id, strategy, stats_snapshot, player_count, created_at')
      .eq('squad_id', squad_id)
      .eq('map_name', mapInfo.name)
      .single();

    if (cached) {
      return NextResponse.json({
        strategy: cached.strategy,
        stats_snapshot: cached.stats_snapshot,
        player_count: cached.player_count,
        cached: true,
        generated_at: cached.created_at,
      });
    }
  }

  // Build per-player summaries
  const sortedMembers = [...members].sort((a: any, b: any) => a.slot - b.slot);
  const squadSummary: PlayerSummary[] = sortedMembers.map((m: any, i: number) => {
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
        ? (Array.isArray(coaching.strengths[0]) ? coaching.strengths : coaching.strengths.map((s: any) => typeof s === 'string' ? s : s.t || s.d || String(s)))
        : [],
      weaknesses: coaching.weaknesses
        ? (Array.isArray(coaching.weaknesses[0]) ? coaching.weaknesses : coaching.weaknesses.map((s: any) => typeof s === 'string' ? s : s.t || s.d || String(s)))
        : [],
      topOperators: stats.topOperators || [],
      mapPerformance: {
        best: stats.bestMaps || [],
        worst: stats.worstMaps || [],
      },
    };
  });

  const statsSnapshot = sortedMembers.map((m: any) => ({
    profile_id: m.profile_id,
    username: m.profiles?.ubisoft_username,
    slot: m.slot,
    stats: m.profiles?.stats,
    coaching: m.profiles?.coaching,
  }));

  // Resolve blueprint paths
  let blueprintPaths: string[] | undefined;
  if (mapInfo.blueprints.length > 0) {
    blueprintPaths = mapInfo.blueprints.map(bp =>
      path.join(process.cwd(), 'public', 'maps', bp.file)
    );
    console.log(`Strategy generation: blueprints=${blueprintPaths.length} for ${mapInfo.name}`);
  } else {
    console.log(`Strategy generation: no blueprints for ${mapInfo.name}`);
  }

  // Generate strategy
  try {
    const strategy = await generateSquadStrategy(squadSummary, mapInfo.name, blueprintPaths);

    // Upsert to DB
    const { error: dbError } = await supabase
      .from('strategies')
      .upsert({
        squad_id,
        map_name: mapInfo.name,
        player_count: members.length,
        stats_snapshot: statsSnapshot,
        strategy,
        generated_by: user.id,
        created_at: new Date().toISOString(),
      }, { onConflict: 'squad_id,map_name' });

    if (dbError) {
      console.error('Strategy DB upsert failed:', dbError);
    }

    return NextResponse.json({
      strategy,
      stats_snapshot: statsSnapshot,
      player_count: members.length,
      cached: false,
      generated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Strategy generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Strategy generation failed' },
      { status: 500 }
    );
  }
}
