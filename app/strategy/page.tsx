// TODO: wire to real backend
'use client';
import { useState } from 'react';
import { TopNav } from '../components/TopNav';
import { Corners } from '../components/ui';
import { OperatorIcon } from '../components/OperatorIcon';
import { PLAYER, STRATEGY_DATA } from '@/lib/mock-data';
import Link from 'next/link';

function tagStyle(top: string, left: string, color: string): React.CSSProperties {
  return {
    position: 'absolute', top, left,
    fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em',
    color: 'var(--fg)', background: 'var(--bg)', border: '1px solid ' + color, padding: '3px 6px',
    display: 'flex', alignItems: 'center', gap: 6,
  };
}

export default function StrategyPage() {
  const [side, setSide] = useState<'ATK' | 'DEF'>('ATK');
  const [site, setSite] = useState<'A' | 'B'>('B');
  const mapName = 'COASTLINE';
  const key = side + '-' + site;

  const ops = STRATEGY_DATA.ops[side];
  const execs = STRATEGY_DATA.execs[key as keyof typeof STRATEGY_DATA.execs] || [];
  const callouts = STRATEGY_DATA.callouts[key as keyof typeof STRATEGY_DATA.callouts] || [];

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
                <div className="tac" style={{ color: 'var(--accent)', marginBottom: 10 }}>// TACTICAL BRIEF · GHOST-07</div>
                <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '-0.035em', lineHeight: 1 }}>
                  {mapName}
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap', fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-dim)', letterSpacing: '0.14em' }}>
                  <span>VERSION · <b style={{ color: 'var(--fg)' }}>v1</b></span>
                  <span>GENERATED · <b style={{ color: 'var(--fg)' }}>JUST NOW</b></span>
                  <span>CONFIDENCE · <b style={{ color: 'var(--accent)' }}>HIGH (87%)</b></span>
                  <span>SITE · <b style={{ color: 'var(--accent)' }}>{site === 'B' ? 'HOOKAH/SUNRISE' : 'BILLIARDS/VIP'}</b></span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn primary">EXPORT PDF</button>
                <button className="btn ghost">SHARE LINK</button>
              </div>
            </div>
          </div>

          {/* Side + site toggles */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="tac">// PHASE</div>
            <div style={{ display: 'flex', border: '1px solid var(--line)' }}>
              {(['ATK', 'DEF'] as const).map(s => (
                <button key={s} onClick={() => setSide(s)} style={{ padding: '10px 20px', fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, background: side === s ? 'var(--accent)' : 'transparent', color: side === s ? '#0c0c10' : 'var(--fg-dim)', borderRight: s === 'ATK' ? '1px solid var(--line)' : 'none' }}>
                  {s === 'ATK' ? '◆ ATTACK' : '◇ DEFENSE'}
                </button>
              ))}
            </div>
            <div className="tac" style={{ marginLeft: 20 }}>// BOMB SITE</div>
            <div style={{ display: 'flex', border: '1px solid var(--line)' }}>
              {(['A', 'B'] as const).map(s => (
                <button key={s} onClick={() => setSite(s)} style={{ padding: '10px 18px', fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.16em', fontWeight: 600, background: site === s ? 'var(--bg-3)' : 'transparent', color: site === s ? 'var(--accent)' : 'var(--fg-dim)', borderRight: s === 'A' ? '1px solid var(--line)' : 'none' }}>
                  SITE {s}
                </button>
              ))}
            </div>
          </div>

          {/* OP ASSIGNMENTS */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-h">
              <div className="t">OPERATOR ASSIGNMENTS · <b>{side}</b></div>
              <div className="r">5/5 LOCKED</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }} className="ops-assign-grid">
              <style>{`@media (max-width:900px){ .ops-assign-grid{grid-template-columns:repeat(2,1fr) !important} }
                       @media (max-width:480px){ .ops-assign-grid{grid-template-columns:1fr !important} }`}</style>
              {ops.map((x, i) => (
                <div key={i} className="corners" style={{ background: 'var(--bg-2)', border: '1px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line-dim)'), padding: 16, position: 'relative' }}>
                  {i === 0 && <><span className="c-tl" style={{ width: 10, height: 10 }}></span><span className="c-tr" style={{ width: 10, height: 10 }}></span></>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div className={'av md ' + x.theme}>{x.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.username}</div>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'var(--fg-mute)', letterSpacing: '0.14em', marginTop: 2 }}>P{i + 1}</div>
                    </div>
                  </div>
                  <div style={{ paddingTop: 12, borderTop: '1px dashed var(--line-dim)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <OperatorIcon name={x.op} size={24} />
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>{x.op}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'var(--accent)', letterSpacing: '0.16em', marginBottom: 10 }}>{x.role}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.45 }}>{x.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXEC + MAP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }} className="plan-grid">
            <style>{`@media (max-width:900px){ .plan-grid{grid-template-columns:1fr !important} }`}</style>

            <div className="card">
              <div className="card-h">
                <div className="t">{side} EXECUTION · <b>SITE {site}</b></div>
                <div className="r">{execs.length} STEPS</div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {execs.map(e => (
                  <div key={e.n} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 70px', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg-2)', border: '1px solid var(--line-dim)' }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{e.n}</div>
                    <div style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.45 }}>{e.t}</div>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.1em', textAlign: 'right' }}>{e.at}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MAP DIAGRAM */}
            <div className="card">
              <div className="card-h">
                <div className="t">MAP · <b>{mapName} · SITE {site}</b></div>
                <div className="r">{side === 'ATK' ? '◆ ROUTES' : '◇ SETUP'}</div>
              </div>
              <div style={{ aspectRatio: '1 / 0.72', background: 'linear-gradient(180deg, oklch(0.22 0.014 250), oklch(0.16 0.012 250))', border: '1px solid var(--line-dim)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 14, backgroundImage: 'linear-gradient(var(--line-dim) 1px, transparent 1px),linear-gradient(90deg, var(--line-dim) 1px, transparent 1px)', backgroundSize: '14px 14px', opacity: 0.5 }}></div>
                <svg viewBox="0 0 100 72" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  {side === 'ATK' ? (
                    <>
                      <path d="M 10 50 Q 30 30 55 38 T 90 34" fill="none" stroke="oklch(0.705 0.205 38)" strokeWidth="0.8" strokeDasharray="2 1.5" />
                      <path d="M 20 62 L 40 56 L 60 58" fill="none" stroke="oklch(0.78 0.165 75)" strokeWidth="0.8" strokeDasharray="2 1.5" />
                      <circle cx="55" cy="38" r="2" fill="oklch(0.705 0.205 38)" />
                      <circle cx="40" cy="56" r="1.6" fill="oklch(0.78 0.165 75)" />
                    </>
                  ) : (
                    <>
                      <rect x="40" y="30" width="30" height="18" fill="none" stroke="oklch(0.78 0.155 155)" strokeWidth="0.5" strokeDasharray="1 1" />
                      <path d="M 30 20 L 30 55" stroke="oklch(0.705 0.205 38)" strokeWidth="0.6" strokeDasharray="1 1" />
                      <path d="M 75 25 L 75 55" stroke="oklch(0.705 0.205 38)" strokeWidth="0.6" strokeDasharray="1 1" />
                    </>
                  )}
                </svg>
                {side === 'ATK' ? (
                  <>
                    <div style={tagStyle('22%', '18%', 'var(--accent)')}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>A1</span> BREACH</div>
                    <div style={tagStyle('58%', '58%', 'var(--accent)')}><span style={{ color: 'var(--accent)', fontWeight: 700 }}>A3</span> FLANK</div>
                    <div style={tagStyle('38%', '72%', 'var(--accent-2)')}><span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>A5</span> VERT</div>
                  </>
                ) : (
                  <>
                    <div style={tagStyle('45%', '35%', 'var(--good)')}><span style={{ color: 'var(--good)', fontWeight: 700 }}>D1</span> ANCHOR</div>
                    <div style={tagStyle('30%', '20%', 'var(--good)')}><span style={{ color: 'var(--good)', fontWeight: 700 }}>D3</span> CAM</div>
                    <div style={tagStyle('65%', '70%', 'var(--accent-2)')}><span style={{ color: 'var(--accent-2)', fontWeight: 700 }}>D4</span> ROAM</div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                {(side === 'ATK'
                  ? [['var(--accent)', 'PRIMARY'], ['var(--accent-2)', 'SECONDARY'], ['var(--fg-dim)', 'CALLOUT']]
                  : [['var(--good)', 'ANCHOR'], ['var(--accent-2)', 'ROAM'], ['var(--fg-dim)', 'CALLOUT']]
                ).map(([c, l]) => (
                  <span key={l} style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', display: 'inline-flex', alignItems: 'center', gap: 6, letterSpacing: '0.12em' }}>
                    <i style={{ width: 8, height: 8, display: 'inline-block', background: c }}></i>{l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CALLOUTS */}
          <div className="card">
            <div className="card-h">
              <div className="t">CALLOUTS · <b>{side} · SITE {site}</b></div>
              <div className="r">COMMIT TO MEMORY</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="call-grid">
              <style>{`@media (max-width:700px){ .call-grid{grid-template-columns:1fr !important} }`}</style>
              {callouts.map(([name, note]: string[], i: number) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '32px 140px 1fr', gap: 12, alignItems: 'center', padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--line-dim)' }}>
                  <div style={{ width: 32, height: 32, background: 'var(--bg-3)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 11, color: 'var(--accent)', clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}>C{i + 1}</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14, letterSpacing: '-0.005em' }}>{name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.45 }}>{note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/squad" className="btn">← PICK A DIFFERENT MAP</Link>
            <Link href="/dashboard" className="btn">DASHBOARD</Link>
            <button className="btn primary">REGENERATE WITH NEW ROSTER</button>
          </div>

        </div>
      </div>
    </>
  );
}
