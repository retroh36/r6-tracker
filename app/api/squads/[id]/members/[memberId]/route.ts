import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const { id: squadId, memberId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership via joined squad
  const { data: member } = await supabase
    .from('squad_members')
    .select('id, squad_id, squads(owner_id)')
    .eq('id', memberId)
    .eq('squad_id', squadId)
    .single();

  if (!member || (member as any).squads?.owner_id !== user.id) {
    return NextResponse.json({ error: 'Not found or not owner' }, { status: 403 });
  }

  const { error } = await supabase
    .from('squad_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Invalidate cached squad analysis
  await supabase
    .from('squads')
    .update({ analysis: null, analysis_generated_at: null })
    .eq('id', squadId);

  return NextResponse.json({ ok: true });
}
