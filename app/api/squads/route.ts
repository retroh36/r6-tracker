import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('squads')
    .select('*, squad_members(count)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const squads = (data || []).map(s => ({
    ...s,
    member_count: s.squad_members?.[0]?.count ?? 0,
  }));

  return NextResponse.json(squads);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const name = (body.name || '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Squad name is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('squads')
    .insert({
      owner_id: user.id,
      name,
      tag: (body.tag || '').trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
