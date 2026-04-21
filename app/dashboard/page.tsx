import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TopNav } from '../components/TopNav';
import { StatCell, Corners } from '../components/ui';
import { findMap } from '@/lib/maps';
import { PLAYER } from '@/lib/mock-data';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('stats, coaching, ubisoft_username')
    .eq('id', user!.id)
    .single();

  const hasAnalysis = profile?.stats && profile?.coaching;

  // Fetch squads with member counts
  const { data: squads } = await supabase
    .from('squads')
    .select('id, name, tag, squad_members(count)')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false });

  const squadList = (squads || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    tag: s.tag,
    memberCount: s.squad_members?.[0]?.count ?? 0,
  }));

  // Fetch recent strategies for user's squads
  const squadIds = squadList.map(s => s.id);
  const squadNameMap = Object.fromEntries(squadList.map(s => [s.id, s.name]));

  let strategies: { squad_id: string; squad_name: string; map_name: string; map_slug: string; created_at: string }[] = [];

  if (squadIds.length > 0) {
    const { data: strats } = await supabase
      .from('strategies')
      .select('squad_id, map_name, created_at')
      .in('squad_id', squadIds)
      .order('created_at', { ascending: false })
      .limit(5);

    strategies = (strats || []).map((s: any) => ({
      squad_id: s.squad_id,
      squad_name: squadNameMap[s.squad_id] || 'Unknown',
      map_name: s.map_name,
      map_slug: findMap(s.map_name)?.slug || s.map_name.toLowerCase().replace(/\s+/g, '-'),
      created_at: s.created_at,
    }));
  }

  const emailLocal = user!.email?.split('@')[0] || 'operator';

  return (
    <>
      <TopNav user={PLAYER} />
      <div className="page page-bg-grid">
        <div className="wrap">

          {/* WELCOME HEADER */}
          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> SQUAD DASHBOARD</div>
              <h1>Welcome back, <em>{emailLocal}</em>.</h1>
            </div>
          </div>

          {/* YOUR LATEST ANALYSIS */}
          <div className="corners" style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: 24, marginBottom: 32, position: 'relative' }}>
            <Corners />
            <div className="tac" style={{ color: 'var(--accent)', marginBottom: 14 }}>// YOUR DOSSIER</div>

            {hasAnalysis ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div className="av lg h-r">
                    {(profile.ubisoft_username || emailLocal).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, letterSpacing: '-0.015em' }}>
                      {profile.ubisoft_username || emailLocal}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--accent)', letterSpacing: '0.16em', marginTop: 3 }}>
                      {profile.coaching.archetype || 'FLEX'} · {profile.stats.rank || 'UNRANKED'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, paddingTop: 16, borderTop: '1px dashed var(--line-dim)', marginBottom: 20 }}>
                  <StatCell label="K/D" value={profile.stats.kd ?? '—'} accent />
                  <StatCell label="WIN RATE" value={profile.stats.winRate ?? '—'} unit="%" />
                  <StatCell label="HEADSHOT" value={profile.stats.headshotPct ?? '—'} unit="%" />
                  <StatCell label="MATCHES" value={profile.stats.matchesPlayed ?? '—'} />
                </div>

                <Link href="/profile" className="btn primary" style={{ width: '100%' }}>
                  <span>VIEW FULL REPORT</span><span className="arrow">→</span>
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, letterSpacing: '-0.015em', marginBottom: 8 }}>
                  Upload your stats to get your first coaching report.
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5, maxWidth: 420, margin: '0 auto 20px' }}>
                  Drop your Tracker Network screenshots and our AI coach will classify your playstyle, flag weaknesses, and recommend operators.
                </div>
                <Link href="/upload" className="btn primary">
                  <span>UPLOAD STATS</span><span className="arrow">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* YOUR SQUADS */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className="tac">// YOUR SQUADS</div>
              {squadList.length > 0 && (
                <Link href="/squad" className="btn ghost" style={{ height: 30, padding: '0 12px', fontSize: 9 }}>
                  NEW SQUAD +
                </Link>
              )}
            </div>

            {squadList.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {squadList.map(s => (
                  <Link
                    key={s.id}
                    href="/squad"
                    className="corners"
                    style={{ background: 'var(--bg-2)', border: '1px solid var(--line-dim)', padding: '16px 18px', position: 'relative', display: 'block', transition: 'border-color .12s' }}
                  >
                    <span className="c-tl" style={{ width: 10, height: 10 }}></span>
                    <span className="c-tr" style={{ width: 10, height: 10 }}></span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
                        {s.name}
                      </div>
                      {s.tag && (
                        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'var(--fg-mute)', letterSpacing: '0.14em', border: '1px solid var(--line-dim)', padding: '2px 6px' }}>
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pill">
                        <span className={'dot' + (s.memberCount >= 3 ? '' : ' amber')}></span>
                        {s.memberCount}/5 · {s.memberCount === 5 ? 'FULL' : s.memberCount >= 3 ? 'READY' : 'BUILDING'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  Build your first squad.
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5, maxWidth: 400, margin: '0 auto 16px' }}>
                  Create a 5-stack and add players to unlock squad analysis and map strategies.
                </div>
                <Link href="/squad" className="btn primary">
                  <span>CREATE SQUAD</span><span className="arrow">→</span>
                </Link>
              </div>
            )}
          </div>

          {/* RECENT STRATEGIES */}
          <div style={{ marginBottom: 32 }}>
            <div className="tac" style={{ marginBottom: 16 }}>// RECENT STRATEGIES</div>

            {strategies.length > 0 ? (
              <div style={{ display: 'grid', gap: 8 }}>
                {strategies.map((s, i) => (
                  <Link
                    key={`${s.squad_id}-${s.map_slug}-${i}`}
                    href={`/strategy?squad=${s.squad_id}&map=${s.map_slug}`}
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'center', padding: '12px 16px', background: 'var(--bg-2)', border: '1px solid var(--line-dim)', transition: 'border-color .12s' }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {s.squad_name} · {s.map_name}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.14em', marginTop: 3 }}>
                        {timeAgo(s.created_at)}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--accent)', letterSpacing: '0.14em' }}>
                      VIEW →
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  No strategies generated yet.
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5, maxWidth: 400, margin: '0 auto 16px' }}>
                  Pick a map on your squad page and generate your first gameplan.
                </div>
                <Link href="/squad" className="btn primary">
                  <span>GO TO SQUAD</span><span className="arrow">→</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
