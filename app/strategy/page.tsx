'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopNav } from '../components/TopNav';
import { Corners } from '../components/ui';
import { OperatorIcon } from '../components/OperatorIcon';
import { PLAYER } from '@/lib/mock-data';
import { findMap } from '@/lib/maps';

interface OperatorPick {
  player: number;
  operator: string;
  reason: string;
}

interface Strategy {
  mapOverview: string;
  attackPlan: {
    sitePriority: string;
    operatorPicks: OperatorPick[];
    executeStrategy: string;
  };
  defensePlan: {
    sitePriority: string[];
    operatorPicks: OperatorPick[];
    setupStrategy: string;
  };
  keyCallouts: string[];
  squadWeaknesses: string;
}

interface SnapshotPlayer {
  profile_id: string;
  username: string;
  slot: number;
  stats: any;
  coaching: any;
}

interface StrategyData {
  strategy: Strategy;
  stats_snapshot: SnapshotPlayer[];
  player_count: number;
  cached: boolean;
  generated_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function StrategyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const squadId = searchParams.get('squad');
  const mapSlug = searchParams.get('map');

  const [data, setData] = useState<StrategyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState('');
  const [side, setSide] = useState<'ATK' | 'DEF'>('ATK');
  const [activeFloor, setActiveFloor] = useState(1);

  useEffect(() => {
    if (!squadId || !mapSlug) {
      router.replace('/squad');
      return;
    }

    // Check sessionStorage handoff first
    const handoff = sessionStorage.getItem('r6_strategy');
    if (handoff) {
      try {
        const parsed = JSON.parse(handoff);
        if (parsed.strategy) {
          setData(parsed);
          setLoading(false);
          sessionStorage.removeItem('r6_strategy');
          return;
        }
      } catch {}
      sessionStorage.removeItem('r6_strategy');
    }

    // Fallback: fetch from API
    fetch(`/api/strategies?squad_id=${squadId}&map=${mapSlug}`)
      .then(r => r.json())
      .then(d => {
        if (d.strategy) {
          setData(d);
        } else {
          router.replace('/squad');
        }
      })
      .catch(() => router.replace('/squad'))
      .finally(() => setLoading(false));
  }, [squadId, mapSlug]);

  const regenerate = async () => {
    if (!squadId || !mapSlug) return;
    setRegenerating(true);
    setRegenError('');
    try {
      const res = await fetch('/api/strategies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ squad_id: squadId, map_name: mapSlug, force_regenerate: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Regeneration failed');
      }
      const fresh = await res.json();
      setData(fresh);
    } catch (err: any) {
      setRegenError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopNav user={PLAYER} />
        <div className="page page-bg-grid">
          <div className="wrap" style={{ paddingTop: 80, textAlign: 'center' }}>
            <div className="tac anim-pulse" style={{ color: 'var(--accent)' }}>// LOADING STRATEGY...</div>
          </div>
        </div>
      </>
    );
  }

  if (!data) return null;

  const { strategy, stats_snapshot, generated_at } = data;
  const snapshot = stats_snapshot || [];
  const mapInfo = mapSlug ? findMap(mapSlug) : null;
  const mapName = mapInfo?.name || (mapSlug ? mapSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown');
  const blueprints = mapInfo?.blueprints || [];
  const activeBlueprint = blueprints.find(bp => bp.floor === activeFloor) || blueprints[0];

  // Map player number to snapshot data
  const playerFor = (num: number): SnapshotPlayer | null => snapshot[num - 1] || null;

  const currentPicks = side === 'ATK' ? strategy.attackPlan.operatorPicks : strategy.defensePlan.operatorPicks;

  return (
    <>
      <TopNav user={PLAYER} />
      <div className="page page-bg-grid">
        <div className="wrap">

          {/* Header */}
          <div className="corners" style={{ background: 'linear-gradient(90deg, oklch(0.705 0.205 38 / 0.10), transparent 50%), var(--panel)', border: '1px solid var(--line)', padding: 28, marginBottom: 28, position: 'relative' }}>
            <Corners />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
              <div>
                <div className="tac" style={{ color: 'var(--accent)', marginBottom: 10 }}>// TACTICAL BRIEF</div>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.035em', lineHeight: 1 }}>
                  {mapName.toUpperCase()}
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap', fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.14em' }}>
                  <span>PLAYERS · <b style={{ color: 'var(--fg)' }}>{snapshot.length}</b></span>
                  <span>GENERATED · <b style={{ color: 'var(--fg)' }}>{generated_at ? timeAgo(generated_at) : 'JUST NOW'}</b></span>
                  {data.cached && <span style={{ color: 'var(--accent-2)' }}>CACHED</span>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn primary" onClick={regenerate} disabled={regenerating}>
                  <span>{regenerating ? 'REGENERATING...' : 'REGENERATE'}</span>
                </button>
                <button className="btn ghost" onClick={() => router.push('/squad')}>← BACK TO SQUAD</button>
              </div>
            </div>
            {regenError && (
              <div style={{ marginTop: 14, padding: '8px 12px', border: '1px solid var(--danger)', background: 'oklch(0.650 0.230 25 / 0.08)', fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--danger)' }}>
                {regenError}
              </div>
            )}
          </div>

          {/* Map overview */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-h">
              <div className="t">MAP OVERVIEW</div>
            </div>
            <p style={{ fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.6, margin: 0 }}>{strategy.mapOverview}</p>
          </div>

          {/* Map blueprints */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-h">
              <div className="t">MAP BLUEPRINTS · <b>{mapName.toUpperCase()}</b></div>
              {blueprints.length > 0 && <div className="r">{blueprints.length} FLOORS</div>}
            </div>
            {blueprints.length > 0 ? (
              <>
                <div style={{ display: 'flex', gap: 0, border: '1px solid var(--line)', marginBottom: 16 }}>
                  {blueprints.map(bp => (
                    <button
                      key={bp.floor}
                      onClick={() => setActiveFloor(bp.floor)}
                      style={{
                        padding: '8px 16px', fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.16em', fontWeight: 600,
                        background: activeFloor === bp.floor ? 'var(--accent)' : 'transparent',
                        color: activeFloor === bp.floor ? '#0c0c10' : 'var(--fg-dim)',
                        borderRight: '1px solid var(--line)',
                      }}
                    >
                      {bp.label}
                    </button>
                  ))}
                </div>
                {activeBlueprint && (
                  <div style={{ border: '1px solid var(--line-dim)', background: 'var(--bg-2)', position: 'relative' }}>
                    <img
                      src={`/maps/${activeBlueprint.file}`}
                      alt={`${mapName} - ${activeBlueprint.label}`}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', bottom: 8, right: 8, fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.14em', background: 'oklch(0 0 0 / 0.7)', padding: '3px 8px' }}>
                      {activeBlueprint.label} · {mapName.toUpperCase()}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center', fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.14em' }}>
                BLUEPRINT VIEW UNAVAILABLE FOR THIS MAP
              </div>
            )}
          </div>

          {/* Side toggle */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="tac">// PHASE</div>
            <div style={{ display: 'flex', border: '1px solid var(--line)' }}>
              {(['ATK', 'DEF'] as const).map(s => (
                <button key={s} onClick={() => setSide(s)} style={{ padding: '10px 20px', fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, background: side === s ? 'var(--accent)' : 'transparent', color: side === s ? '#0c0c10' : 'var(--fg-dim)', borderRight: s === 'ATK' ? '1px solid var(--line)' : 'none' }}>
                  {s === 'ATK' ? '◆ ATTACK' : '◇ DEFENSE'}
                </button>
              ))}
            </div>
          </div>

          {/* Operator picks */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-h">
              <div className="t">OPERATOR ASSIGNMENTS · <b>{side}</b></div>
              <div className="r">{currentPicks.length} PICKS</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(currentPicks.length, 5)},1fr)`, gap: 10 }} className="ops-assign-grid">
              <style>{`
                @media (max-width:900px){ .ops-assign-grid{grid-template-columns:repeat(2,1fr) !important} }
                @media (max-width:480px){ .ops-assign-grid{grid-template-columns:1fr !important} }
              `}</style>
              {currentPicks.map((pick, i) => {
                const player = playerFor(pick.player);
                const initials = player ? (player.username || '??').slice(0, 2).toUpperCase() : `P${pick.player}`;
                return (
                  <div key={i} className="corners" style={{ background: 'var(--bg-2)', border: '1px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line-dim)'), padding: 16, position: 'relative' }}>
                    {i === 0 && <><span className="c-tl" style={{ width: 10, height: 10 }}></span><span className="c-tr" style={{ width: 10, height: 10 }}></span></>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div className="av md h-r">{initials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player?.username || `Player ${pick.player}`}</div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'var(--fg-mute)', letterSpacing: '0.14em', marginTop: 2 }}>P{pick.player}</div>
                      </div>
                    </div>
                    <div style={{ paddingTop: 12, borderTop: '1px dashed var(--line-dim)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <OperatorIcon name={pick.operator} size={24} />
                        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>{pick.operator}</div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.45 }}>{pick.reason}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategy details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="plan-grid">
            <style>{`@media (max-width:900px){ .plan-grid{grid-template-columns:1fr !important} }`}</style>

            {/* Site priority + execute/setup */}
            <div className="card">
              <div className="card-h">
                <div className="t">{side === 'ATK' ? 'ATTACK' : 'DEFENSE'} PLAN</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.16em', marginBottom: 6 }}>SITE PRIORITY</div>
                <div style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.5 }}>
                  {side === 'ATK'
                    ? strategy.attackPlan.sitePriority
                    : (Array.isArray(strategy.defensePlan.sitePriority)
                        ? strategy.defensePlan.sitePriority.join(' > ')
                        : strategy.defensePlan.sitePriority)}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.16em', marginBottom: 6 }}>
                  {side === 'ATK' ? 'EXECUTE STRATEGY' : 'SETUP STRATEGY'}
                </div>
                <div style={{ fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
                  {side === 'ATK' ? strategy.attackPlan.executeStrategy : strategy.defensePlan.setupStrategy}
                </div>
              </div>
            </div>

            {/* Squad weaknesses */}
            <div className="card">
              <div className="card-h">
                <div className="t">SQUAD <b>WEAKNESSES</b></div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.6, marginBottom: 20 }}>
                {strategy.squadWeaknesses}
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px dashed var(--line-dim)' }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.16em', marginBottom: 10 }}>ROSTER SNAPSHOT</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {snapshot.map((p, i) => (
                    <div key={p.profile_id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>P{i + 1}</span>
                      <span style={{ color: 'var(--fg)' }}>{p.username}</span>
                      <span style={{ color: 'var(--fg-mute)' }}>{p.stats?.rank || 'UNRANKED'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key callouts */}
          <div className="card" style={{ marginBottom: 32 }}>
            <div className="card-h">
              <div className="t">KEY CALLOUTS · <b>{mapName.toUpperCase()}</b></div>
              <div className="r">COMMIT TO MEMORY</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="call-grid">
              <style>{`@media (max-width:700px){ .call-grid{grid-template-columns:1fr !important} }`}</style>
              {strategy.keyCallouts.map((callout, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 12, alignItems: 'center', padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--line-dim)' }}>
                  <div style={{ width: 32, height: 32, background: 'var(--bg-3)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 11, color: 'var(--accent)', clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}>C{i + 1}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{callout}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => router.push('/squad')}>← PICK A DIFFERENT MAP</button>
            <button className="btn" onClick={() => router.push('/dashboard')}>DASHBOARD</button>
            <button className="btn primary" onClick={regenerate} disabled={regenerating}>
              {regenerating ? 'REGENERATING...' : 'REGENERATE WITH FRESH DATA'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
