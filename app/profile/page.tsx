'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '../components/TopNav';
import { Pill, StatCell, Corners, Bar, CompareBar } from '../components/ui';
import { OperatorIcon } from '../components/OperatorIcon';
import { useAnalysis } from '../context/analysis-context';
import { PLAYER, COACH_REPORT } from '@/lib/mock-data';

export default function ProfilePage() {
  const router = useRouter();
  const { result } = useAnalysis();
  const [tab, setTab] = useState('coach');

  // Build user + report from real data or fall back to mock
  const hasReal = !!result;

  const user = hasReal ? {
    username: result.stats.username || 'Unknown',
    handle: (result.stats.username || 'USER').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) + '-01',
    platform: result.stats.platform || 'PC',
    rank: result.stats.rank || 'UNRANKED',
    archetype: result.coaching.archetype || 'FLEX',
    archetypeConfidence: result.coaching.confidence || 0,
    avatar: {
      initials: (result.stats.username || 'UN').slice(0, 2).toUpperCase(),
      theme: 'h-r',
    },
    stats: {
      kd: result.stats.kd ?? 0,
      winRate: result.stats.winRate ?? 0,
      headshot: result.stats.headshotPct ?? 0,
      hoursTotal: result.stats.hoursPlayed ?? null,
      hoursSeason: null as number | null,
      matches: result.stats.matchesPlayed ?? 0,
      avgDamage: result.stats.avgDamage ?? null,
    },
    topOps: (result.stats.topOperators || []).map((op: any) => ({
      name: op.name,
      role: op.role,
      pick: op.pickRate ?? 0,
      kd: op.kd ?? 0,
      wr: op.winRate ?? 0,
    })),
    squadAvg: PLAYER.squadAvg,
  } : PLAYER;

  const report = hasReal ? result.coaching : COACH_REPORT;

  const navUser = {
    username: user.username,
    rank: user.rank,
    avatar: user.avatar,
  };

  return (
    <>
      <TopNav user={navUser} />
      <div className="page page-bg-grid">
        <div className="wrap">

          {hasReal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid var(--good)', background: 'oklch(0.780 0.155 155 / 0.06)', marginBottom: 24 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--good)', boxShadow: '0 0 10px var(--good)' }}></span>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--good)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>EXTRACT COMPLETE · COACH REPORT GENERATED</div>
            </div>
          )}

          {/* HEADER */}
          <div className="corners" style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: 28, marginBottom: 32, position: 'relative', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28, alignItems: 'center' }}>
            <Corners />
            <div className={'av xl ' + user.avatar.theme}>{user.avatar.initials}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <div className="tac">OPERATOR DOSSIER</div>
                <Pill>ACTIVE · LAST SYNC 2m</Pill>
              </div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(32px,4vw,48px)', letterSpacing: '-0.03em', lineHeight: 1 }}>{user.username}</div>
              <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.14em' }}>HANDLE · <b style={{ color: 'var(--fg)' }}>{user.handle}</b></span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.14em' }}>PLATFORM · <b style={{ color: 'var(--fg)' }}>{user.platform}</b></span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.14em' }}>RANK · <b style={{ color: 'var(--accent)' }}>{user.rank}</b></span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.14em' }}>ARCHETYPE · <b style={{ color: 'var(--accent)' }}>{user.archetype}</b></span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn primary" onClick={() => router.push('/dashboard')}><span>BACK TO SQUAD</span><span className="arrow">→</span></button>
              <button className="btn ghost" onClick={() => router.push('/upload')}>RE-UPLOAD STATS</button>
            </div>
          </div>

          {/* STAT STRIP */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 0, border: '1px solid var(--line)', marginBottom: 40 }} className="stat-strip">
            <style>{`
              .stat-strip > div{padding:20px;border-right:1px solid var(--line-dim)}
              .stat-strip > div:last-child{border-right:0}
              @media (max-width:900px){ .stat-strip{grid-template-columns:repeat(3,1fr) !important} .stat-strip > div:nth-child(3n){border-right:0} .stat-strip > div:nth-child(-n+3){border-bottom:1px solid var(--line-dim)} }
            `}</style>
            <StatCell label="K/D RATIO" value={user.stats.kd} accent />
            <StatCell label="WIN RATE" value={user.stats.winRate} unit="%" />
            <StatCell label="HEADSHOT" value={user.stats.headshot} unit="%" />
            <StatCell label="MATCHES" value={user.stats.matches} />
            <StatCell label="HOURS" value={user.stats.hoursTotal != null ? user.stats.hoursTotal.toLocaleString() : '—'} sub={user.stats.hoursSeason ? `+${user.stats.hoursSeason} this season` : undefined} />
            <StatCell label="AVG DMG" value={user.stats.avgDamage ?? '—'} />
          </div>

          {/* TABS */}
          <div className="tabs" style={{ marginBottom: 28 }}>
            <div className={'tab ' + (tab === 'coach' ? 'active' : '')} onClick={() => setTab('coach')}>AI COACH REPORT <b>•</b></div>
            <div className={'tab ' + (tab === 'ops' ? 'active' : '')} onClick={() => setTab('ops')}>OPERATORS</div>
            {!hasReal && <div className={'tab ' + (tab === 'compare' ? 'active' : '')} onClick={() => setTab('compare')}>VS SQUAD</div>}
            <div className={'tab ' + (tab === 'drills' ? 'active' : '')} onClick={() => setTab('drills')}>DRILLS</div>
          </div>

          {/* COACH TAB */}
          {tab === 'coach' && (
            <div className="anim-fade">
              {/* Archetype banner */}
              <div className="corners" style={{ background: 'linear-gradient(90deg, oklch(0.705 0.205 38 / 0.12), transparent 60%), var(--panel)', border: '1px solid var(--line)', padding: 28, marginBottom: 28, position: 'relative' }}>
                <Corners />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
                  <div>
                    <div className="tac" style={{ color: 'var(--accent)', marginBottom: 10 }}>// CLASSIFIED ARCHETYPE</div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(32px,4vw,52px)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>
                      {report.archetype}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: 'var(--fg-mute)', letterSpacing: '0.16em', marginBottom: 16 }}>{report.subtype}</div>
                    <p style={{ fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.6, margin: 0, maxWidth: 640 }}>{report.summary}</p>
                  </div>
                  <div style={{ width: 140, textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 56, color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.03em' }}>{report.confidence}<span style={{ fontSize: 24 }}>%</span></div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.18em', marginTop: 8 }}>CONFIDENCE</div>
                    <div style={{ marginTop: 12 }}><Bar value={report.confidence} /></div>
                  </div>
                </div>
              </div>

              {/* Strengths / Weaknesses */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }} className="sw-grid">
                <style>{`@media (max-width:860px){ .sw-grid{grid-template-columns:1fr !important} }`}</style>

                <div className="card">
                  <div className="card-h">
                    <div className="t">STRENGTHS · <b>PLAY TO THESE</b></div>
                    <div className="r" style={{ color: 'var(--good)' }}>● TOP 22%</div>
                  </div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {report.strengths.map((s: any, i: number) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12, paddingBottom: 14, borderBottom: i < 2 ? '1px dashed var(--line-dim)' : 'none' }}>
                        <div style={{ width: 22, height: 22, background: 'var(--good)', color: '#0c0c10', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 11, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>+</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
                          <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{s.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-h">
                    <div className="t">WEAKNESSES · <b>FIX THESE</b></div>
                    <div className="r" style={{ color: 'var(--danger)' }}>● ATTENTION</div>
                  </div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {report.weaknesses.map((s: any, i: number) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12, paddingBottom: 14, borderBottom: i < 2 ? '1px dashed var(--line-dim)' : 'none' }}>
                        <div style={{ width: 22, height: 22, background: 'var(--accent)', color: '#0c0c10', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 11, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)' }}>!</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
                          <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{s.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Operators */}
              <div className="card" style={{ marginBottom: 28 }}>
                <div className="card-h">
                  <div className="t">RECOMMENDED OPERATORS · <b>TOP 3</b></div>
                  <div className="r">RANKED BY SYNERGY SCORE</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="rec-grid">
                  <style>{`@media (max-width:780px){ .rec-grid{grid-template-columns:1fr !important} }`}</style>
                  {report.recommendedOps.map((op: any, i: number) => (
                    <div key={op.name} className="corners" style={{ background: 'var(--bg-2)', border: '1px solid var(--line-dim)', padding: 18, position: 'relative' }}>
                      {i === 0 && <><span className="c-tl"></span><span className="c-tr"></span></>}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <OperatorIcon name={op.name} size={36} />
                        <div>
                          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>{op.name}</div>
                          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--accent)', letterSpacing: '0.14em', marginTop: 2 }}>{op.role} · PICK #{i + 1}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.55, marginBottom: 14, minHeight: 60 }}>{op.reason}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.14em', marginBottom: 6 }}>
                        <span>SYNERGY</span><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{op.confidence}%</span>
                      </div>
                      <Bar value={op.confidence} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Underutilized */}
              <div className="card">
                <div className="card-h">
                  <div className="t">UNDERUTILIZED · <b>TRY THESE</b></div>
                  <div className="r" style={{ color: 'var(--accent-2)' }}>BLIND SPOTS IN POOL</div>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {report.underutilized.map((op: any) => (
                    <div key={op.name} style={{ display: 'grid', gridTemplateColumns: '36px 130px 1fr', gap: 16, alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed var(--line-dim)' }}>
                      <OperatorIcon name={op.name} size={36} />
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15 }}>{op.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{op.why}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OPS TAB */}
          {tab === 'ops' && (
            <div className="card anim-fade">
              <div className="card-h"><div className="t">TOP OPERATORS · <b>BY PLAYTIME</b></div><div className="r">CURRENT SEASON</div></div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px 80px 160px', gap: 14, padding: '8px 0', fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', textTransform: 'uppercase', letterSpacing: '0.16em', borderBottom: '1px solid var(--line-dim)' }}>
                  <span></span><span>OPERATOR</span><span>ROLE</span><span>K/D</span><span>WR</span><span>PICKRATE</span>
                </div>
                {user.topOps.map((op: any, i: number) => (
                  <div key={op.name} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px 80px 160px', gap: 14, alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--line-dim)' }}>
                    <OperatorIcon name={op.name} size={36} />
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15 }}>{op.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: op.role === 'ATK' ? 'var(--accent)' : 'var(--accent-2)' }}>{op.role}</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{op.kd}</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{op.wr}%</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}><Bar value={op.pick} max={30} /></div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>{op.pick}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPARE TAB */}
          {tab === 'compare' && (
            <div className="card anim-fade">
              <div className="card-h"><div className="t">VS SQUAD AVERAGE · <b>GHOST-07</b></div><div className="r">● YOU  ◆ SQUAD AVG</div></div>
              <div style={{ display: 'grid', gap: 18, paddingTop: 8 }}>
                {[
                  ['K/D RATIO', user.stats.kd, user.squadAvg.kd, 2.5],
                  ['WIN RATE', user.stats.winRate, user.squadAvg.winRate, 100],
                  ['HEADSHOT %', user.stats.headshot, user.squadAvg.headshot, 100],
                  ['AVG DAMAGE', user.stats.avgDamage ?? 0, user.squadAvg.avgDamage, 200],
                ].map(([l, y, t, m]) => (
                  <div key={l as string} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 80px', gap: 18, alignItems: 'center' }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.14em' }}>{l as string}</div>
                    <CompareBar you={((y as number) / (m as number)) * 100} them={((t as number) / (m as number)) * 100} />
                    <div className="mono" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>YOU {y as number}{(l as string).includes('%') ? '%' : ''}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--fg-dim)' }}>AVG {t as number}{(l as string).includes('%') ? '%' : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DRILLS TAB */}
          {tab === 'drills' && (
            <div className="card anim-fade">
              <div className="card-h"><div className="t">PRACTICE DRILLS · <b>ASSIGNED</b></div><div className="r">FIX WEAKNESSES</div></div>
              <div style={{ display: 'grid', gap: 14 }}>
                {report.drills.map((d: any, i: number) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '42px 1fr auto', gap: 16, alignItems: 'center', padding: '14px 16px', background: 'var(--bg-2)', border: '1px solid var(--line-dim)' }}>
                    <div style={{ width: 42, height: 42, background: 'var(--bg-3)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono'", fontWeight: 700, color: 'var(--accent)', clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}>0{i + 1}</div>
                    <div>
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{d.t}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{d.d}</div>
                    </div>
                    <button className="btn ghost" style={{ height: 32, padding: '0 14px', fontSize: 10 }}>MARK DONE</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
