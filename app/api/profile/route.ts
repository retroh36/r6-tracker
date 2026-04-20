import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ stats: null, coaching: null, ubisoft_username: null });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('stats, coaching, ubisoft_username, updated_at')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ stats: null, coaching: null, ubisoft_username: null });
  }

  return NextResponse.json(data);
}
