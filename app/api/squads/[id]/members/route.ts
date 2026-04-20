import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: squadId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const { data: squad } = await supabase
    .from('squads')
    .select('owner_id')
    .eq('id', squadId)
    .single();

  if (!squad || squad.owner_id !== user.id) {
    return NextResponse.json({ error: 'Not found or not owner' }, { status: 403 });
  }

  const body = await request.json();
  const profileId = body.profile_id;

  if (!profileId) {
    return NextResponse.json({ error: 'profile_id is required' }, { status: 400 });
  }

  // Get existing members
  const { data: existing } = await supabase
    .from('squad_members')
    .select('slot, profile_id')
    .eq('squad_id', squadId);

  const members = existing || [];

  if (members.length >= 5) {
    return NextResponse.json({ error: 'Squad is full (5/5)' }, { status: 400 });
  }

  if (members.some(m => m.profile_id === profileId)) {
    return NextResponse.json({ error: 'Player is already in this squad' }, { status: 400 });
  }

  // Auto-assign slot if not provided
  let slot = body.slot;
  if (!slot) {
    const taken = new Set(members.map(m => m.slot));
    for (let s = 1; s <= 5; s++) {
      if (!taken.has(s)) { slot = s; break; }
    }
  }

  const { data, error } = await supabase
    .from('squad_members')
    .insert({ squad_id: squadId, profile_id: profileId, slot })
    .select('id, slot, profile_id, profiles(id, ubisoft_username, stats)')
    .single();

  // Invalidate cached squad analysis
  if (!error) {
    await supabase
      .from('squads')
      .update({ analysis: null, analysis_generated_at: null })
      .eq('id', squadId);
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
