import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const squadId = searchParams.get('squad_id');

  if (!q) return NextResponse.json([]);

  // Escape ILIKE special characters
  const escaped = q.replace(/%/g, '\\%').replace(/_/g, '\\_');

  // Get existing member IDs to exclude
  let excludeIds: string[] = [];
  if (squadId) {
    const { data: members } = await supabase
      .from('squad_members')
      .select('profile_id')
      .eq('squad_id', squadId);
    if (members) excludeIds = members.map(m => m.profile_id);
  }

  let query = supabase
    .from('profiles')
    .select('id, ubisoft_username, stats')
    .ilike('ubisoft_username', `%${escaped}%`)
    .not('stats', 'is', null)
    .limit(10);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (data || []).map(p => ({
    id: p.id,
    ubisoft_username: p.ubisoft_username,
    stats: {
      kd: p.stats?.kd ?? null,
      winRate: p.stats?.winRate ?? null,
      rank: p.stats?.rank ?? null,
    },
  }));

  return NextResponse.json(results);
}
