import Link from 'next/link';
import { OperatorIcon } from './components/OperatorIcon';

export default function LandingPage() {
  return (
    <div className="landing-bg">
      {/* NAV */}
      <div className="navwrap">
        <div className="wrap">
          <nav>
            <Link className="brand" href="/">
              <img src="/wordmark.png" alt="R6 Squad Analyzer" className="brand-img" />
            </Link>
            <div className="landing-links">
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#proof">Squads</a>
            </div>
            <div className="nav-cta">
              <Link href="/signin" className="btn primary">
                <span>Get Started</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-inner">
          <div>
            <div className="status-row">
              <div className="pill"><span className="dot"></span> <span>Season Y11 · OPERATION <span className="acc">COLLISION POINT</span></span></div>
              <div className="pill mono">v2.4 · Ranked + Standard</div>
            </div>

            <h1 className="hero-title">
              Win the round <span className="slash">/</span><br />
              <span className="outline">before</span> it starts.
            </h1>

            <p className="hero-sub">
              Upload your Tracker Network screenshots and get a brutally honest playstyle breakdown. Build a 5-stack, lock a map, and we&apos;ll hand you <strong>operator picks, attack execs, defense setups, and callouts</strong> — tuned to how your squad actually plays.
            </p>

            <div className="hero-ctas">
              <Link href="/upload" className="btn primary">
                <span>Run Squad Analysis</span>
                <span className="arrow">→</span>
              </Link>
              <a href="#features" className="btn">
                <span>See Sample Report</span>
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="k">14<span className="u">s</span></div>
                <div className="l">Avg stat extract</div>
              </div>
              <div className="hero-stat">
                <div className="k">22<span className="u">/23</span></div>
                <div className="l">Maps supported</div>
              </div>
              <div className="hero-stat">
                <div className="k">+18<span className="u">%</span></div>
                <div className="l">Squad win-rate lift</div>
              </div>
            </div>
          </div>

          {/* Dashboard mock */}
          <div className="dash corners" aria-hidden="true">
            <span className="c-tl"></span><span className="c-tr"></span><span className="c-bl"></span><span className="c-br"></span>
            <div className="dash-head">
              <div className="title">SQUAD // <b>GHOST-07</b> · MAP LOCKED</div>
              <div className="kbd"><span></span><span></span><span></span><span></span></div>
            </div>

            <div className="dash-grid">
              <div className="panel">
                <div className="panel-h">
                  <div className="t">ROSTER · <b>5/5</b></div>
                  <div className="live"><span className="dot"></span> LIVE</div>
                </div>

                <div className="player-row">
                  <div className="avatar a1">VX</div>
                  <div>
                    <div className="pname">vexel.py</div>
                    <div className="prole">ENTRY · AGGRESSIVE</div>
                    <div className="rank-bar" style={{ width: 80, marginTop: 6 }}><i style={{ width: '82%' }}></i></div>
                  </div>
                  <div className="pmeta"><div className="v">1.42<small> K/D</small></div><div className="v">58<small>%WR</small></div></div>
                </div>
                <div className="player-row">
                  <div className="avatar a2">KR</div>
                  <div>
                    <div className="pname">kraitzen</div>
                    <div className="prole">SUPPORT · FLEX</div>
                    <div className="rank-bar" style={{ width: 80, marginTop: 6 }}><i style={{ width: '64%', background: 'oklch(0.78 0.12 200)' }}></i></div>
                  </div>
                  <div className="pmeta"><div className="v">1.18<small> K/D</small></div><div className="v">54<small>%WR</small></div></div>
                </div>
                <div className="player-row">
                  <div className="avatar a3">MS</div>
                  <div>
                    <div className="pname">m0rsecode</div>
                    <div className="prole">INTEL · ANCHOR</div>
                    <div className="rank-bar" style={{ width: 80, marginTop: 6 }}><i style={{ width: '72%', background: 'var(--good)' }}></i></div>
                  </div>
                  <div className="pmeta"><div className="v">1.09<small> K/D</small></div><div className="v">61<small>%WR</small></div></div>
                </div>
                <div className="player-row">
                  <div className="avatar a4">HX</div>
                  <div>
                    <div className="pname">hexboy.exe</div>
                    <div className="prole">ROAMER · LURK</div>
                    <div className="rank-bar" style={{ width: 80, marginTop: 6 }}><i style={{ width: '58%', background: 'var(--accent-2)' }}></i></div>
                  </div>
                  <div className="pmeta"><div className="v">1.31<small> K/D</small></div><div className="v">51<small>%WR</small></div></div>
                </div>
                <div className="player-row">
                  <div className="avatar a1">QN</div>
                  <div>
                    <div className="pname">quinoa.shot</div>
                    <div className="prole">HARD BREACH · OBJ</div>
                    <div className="rank-bar" style={{ width: 80, marginTop: 6 }}><i style={{ width: '76%' }}></i></div>
                  </div>
                  <div className="pmeta"><div className="v">1.05<small> K/D</small></div><div className="v">59<small>%WR</small></div></div>
                </div>
              </div>

              <div>
                <div className="panel" style={{ padding: 12 }}>
                  <div className="panel-h">
                    <div className="t">MAP · <b>COASTLINE</b></div>
                    <div className="live mono">ATK · B-SITE</div>
                  </div>
                  <div className="map-mock">
                    <div className="floorplan"></div>
                    <svg viewBox="0 0 100 72" preserveAspectRatio="none">
                      <path d="M 10 50 Q 30 30 55 38 T 90 34" fill="none" stroke="oklch(0.705 0.205 38)" strokeWidth="0.8" strokeDasharray="2 1.5" />
                      <path d="M 20 62 L 40 56 L 60 58" fill="none" stroke="oklch(0.78 0.165 75)" strokeWidth="0.8" strokeDasharray="2 1.5" />
                      <circle cx="55" cy="38" r="2" fill="oklch(0.705 0.205 38)" />
                      <circle cx="40" cy="56" r="1.6" fill="oklch(0.78 0.165 75)" />
                    </svg>
                    <div className="map-tag t1"><span className="n">A1</span> BREACH</div>
                    <div className="map-tag t2"><span className="n">A3</span> FLANK</div>
                    <div className="map-tag t3"><span className="n">D2</span> ANCHOR</div>
                  </div>
                  <div className="legend">
                    <span><i className="atk"></i> ATK ROUTE</span>
                    <span><i className="def"></i> DEF SETUP</span>
                    <span><i className="cal"></i> CALLOUT</span>
                  </div>
                </div>

                <div className="coach">
                  <div className="bang">!</div>
                  <div className="txt">
                    <span className="lbl">COACH · HEXBOY.EXE</span>
                    You over-peek <b>46% of site plants</b>. On Coastline B, hold <b>Sunrise → Hookah ceiling</b> and trade instead of pushing. Est. round-win swing: <b>+11%</b>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="disclaimer">
        <b>NOTICE</b>
        R6 Squad Analyzer is an independent fan-made coaching tool. Not affiliated with, endorsed by, or sponsored by Ubisoft Entertainment. All game names, map names, and operator references are used under nominative fair use for compatibility purposes.
      </div>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> SECTION 01 / WORKFLOW</div>
              <h2>Four steps <em>from chaos</em><br />to a winning gameplan.</h2>
            </div>
            <div className="right">
              No API keys. No game integration. Just drop your stats page, invite your squad, and pick a map. We handle the OCR, the breakdown, and the coaching in under a minute.
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-num">01<small>/04</small></div>
              <h3>Drop your stats screenshot</h3>
              <p>Drag in your Tracker Network page — overall, ranked, or operator tab. Our extractor reads K/D, W/L, playtime, top operators, and headshot % in seconds.</p>
              <div className="step-viz">
                <div className="viz-upload">
                  <div className="bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                  <div className="label">EXTRACTING · 57%</div>
                </div>
              </div>
              <div className="step-tag">INPUT<i></i>OCR</div>
            </div>

            <div className="step">
              <div className="step-num">02<small>/04</small></div>
              <h3>Get a playstyle read</h3>
              <p>An AI coach classifies your archetype — Entry, Anchor, Roamer, Intel, Support — flags your weak spots, and recommends three operators you&apos;re currently underutilizing.</p>
              <div className="step-viz">
                <div className="viz-coach">
                  <div className="line"><i></i></div>
                  <div className="line"><i></i></div>
                  <div className="line"><i></i></div>
                  <div className="line"><i></i></div>
                </div>
              </div>
              <div className="step-tag">ANALYSIS<i></i>COACH</div>
            </div>

            <div className="step">
              <div className="step-num">03<small>/04</small></div>
              <h3>Build your 5-stack</h3>
              <p>Send your squad link. Once all five profiles lock in, we balance roles, flag redundancies, and surface compatibility warnings — no two-Thatcher stacks on your watch.</p>
              <div className="step-viz">
                <div className="viz-squad">
                  <div className="slot f">1</div>
                  <div className="slot f">2</div>
                  <div className="slot f">3</div>
                  <div className="slot f">4</div>
                  <div className="slot e">5</div>
                </div>
              </div>
              <div className="step-tag">SQUAD<i></i>SYNC</div>
            </div>

            <div className="step">
              <div className="step-num">04<small>/04</small></div>
              <h3>Lock a map, read the plan</h3>
              <p>Pick any map from the competitive pool. You get per-player operator assignments, attack execs with timings, defense setups with rotates, and shot-ready callouts.</p>
              <div className="step-viz">
                <div className="viz-strat">
                  <svg viewBox="0 0 100 72" preserveAspectRatio="none">
                    <path d="M 15 25 Q 35 35 50 45 T 85 50" fill="none" stroke="oklch(0.705 0.205 38)" strokeWidth="0.7" strokeDasharray="1.5 1" />
                  </svg>
                  <div className="pin a"></div>
                  <div className="pin b"></div>
                  <div className="pin c"></div>
                </div>
              </div>
              <div className="step-tag">OUTPUT<i></i>STRATEGY</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feat" id="features">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> SECTION 02 / CAPABILITIES</div>
              <h2>What the <em>coach</em> actually gives you.</h2>
            </div>
            <div className="right">
              Every report is generated per-squad, per-map. The AI doesn&apos;t just tell you to &quot;communicate more&quot; — it hands you the exec, the timing, and the line.
            </div>
          </div>

          <div className="feat-grid">
            <div className="feat-list">
              {[
                { n: '01', t: 'Per-player operator picks', d: "Matched to your playstyle, your squad's role gaps, and the map's meta — with primary, backup, and \"if banned\" alternates." },
                { n: '02', t: 'Attack execs with timings', d: 'T-minus breach windows, utility order, flank responsibilities. A plan you can actually call out in prep phase.' },
                { n: '03', t: 'Defense setups & rotates', d: 'Anchor assignments, roam paths, reinforcement patterns, and the two rotates to pre-call when intel comes in.' },
                { n: '04', t: 'Shareable callouts card', d: 'A one-page reference your squad pulls up on a second monitor — key angles, pre-fires, and common peek windows.' },
              ].map(f => (
                <div key={f.n} className="feat-item">
                  <div className="feat-icon">{f.n}</div>
                  <div>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="strat-card corners">
              <span className="c-tl"></span><span className="c-tr"></span><span className="c-bl"></span><span className="c-br"></span>
              <div className="strat-head">
                <div className="map">
                  <div className="map-ico"></div>
                  <div className="mname">CLUBHOUSE<small>GAMEPLAN · GHOST-07</small></div>
                </div>
                <div className="side"><b>ATK</b> · CHURCH / ARSENAL</div>
              </div>

              <div className="ops-grid">
                {[
                  { id: 'P1', name: 'ZOFIA', role: 'ENTRY', primary: true },
                  { id: 'P2', name: 'THATCHER', role: 'SUPPORT', primary: false },
                  { id: 'P3', name: 'IANA', role: 'INTEL', primary: false },
                  { id: 'P4', name: 'ASH', role: 'LURK', primary: false },
                  { id: 'P5', name: 'HIBANA', role: 'HARD BREACH', primary: false },
                ].map(op => (
                  <div key={op.id} className={'op' + (op.primary ? ' primary' : '')}>
                    <div className="op-id">{op.id}</div>
                    <OperatorIcon name={op.name} size={28} />
                    <div className="op-name">{op.name}</div>
                    <div className="op-role">{op.role}</div>
                  </div>
                ))}
              </div>

              <div className="plan-block">
                <div className="plan-h">ATTACK EXEC · <b>CHURCH</b></div>
                <div className="plan-steps">
                  {[
                    { n: '01', t: 'Iana scouts Gator from Tree — confirm anchor position', p: 'T-0:40' },
                    { n: '02', t: 'Thatcher EMPs Church hatch + Arsenal wall', p: 'T-0:28' },
                    { n: '03', t: 'Hibana opens vertical, Zofia concusses through', p: 'T-0:14' },
                    { n: '04', t: 'Ash entries Piano, Zofia trades — Iana holds hall', p: 'T-0:06' },
                  ].map(s => (
                    <div key={s.n} className="plan-step">
                      <span className="n">{s.n}</span>
                      <span className="t">{s.t}</span>
                      <span className="p">{s.p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="proof" id="proof">
        <div className="wrap">
          <div className="proof-head">
            <div className="tac">// TRUSTED BY COMPETITIVE STACKS</div>
            <h2>Used by <em>4,200+ ranked squads</em> across 3 regions.</h2>
          </div>

          <div className="logos">
            <div className="logo"><span className="brk">[</span>{'\u00a0'}NIGHTHAWK{'\u00a0'}<span className="brk">]</span></div>
            <div className="logo">BLKHND.GG</div>
            <div className="logo"><span className="brk">&lt;/</span>FRAGLINE<span className="brk">&gt;</span></div>
            <div className="logo">VOLTRON-5</div>
            <div className="logo">MERIDIAN{'\u00a0'}SIX</div>
            <div className="logo"><span className="brk">★</span>{'\u00a0'}AXIS.KR{'\u00a0'}<span className="brk">★</span></div>
          </div>

          <div className="quotes">
            {[
              { q: "It called out that my entry fragger over-peeks on plants before he even said it in VC. Felt personal. We clean up a lot more rounds now.", name: 'drift.txt', rank: 'DIAMOND III · IGL · NIGHTHAWK', initials: 'DR', tone: 'r' },
              { q: "The per-map operator assignments stopped our team's biggest fight: who plays Thatcher. We just run the sheet now.", name: 'lumen.keys', rank: 'EMERALD I · SUPPORT · MERIDIAN SIX', initials: 'LM', tone: 'a' },
              { q: 'Finally a coaching tool that reads my actual stats instead of telling me generic "work on aim" slop. The callouts page is clutch.', name: 'sov.rin', rank: 'CHAMPION · ROAMER · AXIS.KR', initials: 'SV', tone: 'g' },
            ].map(q => (
              <div key={q.name} className="quote">
                <div className="mark">&quot;</div>
                <blockquote>{q.q}</blockquote>
                <div className="who">
                  <div className={'qav ' + q.tone}>{q.initials}</div>
                  <div>
                    <div className="nm">{q.name}</div>
                    <div className="rk">{q.rank}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-strip">
        <div className="wrap">
          <div className="stats-grid">
            {[
              { n: '4,217', u: '+', l: 'Squads deployed' },
              { n: '38,104', u: '', l: 'Reports generated' },
              { n: '+18', u: '%', l: 'Avg win-rate lift' },
              { n: '22', u: '/23', l: 'Ranked maps supported' },
            ].map(s => (
              <div key={s.l} className="big-stat">
                <div className="n">{s.n}{s.u && <em>{s.u}</em>}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="cta-inner">
          <div className="tac">// READY WHEN YOU ARE</div>
          <h2>Stop theorycrafting.<br />Start <em>executing.</em></h2>
          <p>Free for your first squad and your first three map reports. Takes about ninety seconds from sign-in to gameplan.</p>
          <Link href="/signin" className="btn primary">
            <span>Get Started — It&apos;s Free</span>
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="brand" style={{ alignItems: 'flex-start' }}>
                <img src="/wordmark.png" alt="R6 Squad Analyzer" style={{ height: 28, width: 'auto' }} />
              </div>
              <p>An independent coaching layer for competitive Rainbow Six squads. Built by players who were tired of losing post-plants.</p>
            </div>
            <div className="foot-col">
              <h5>Product</h5>
              <ul>
                <li><a href="#how">How it works</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#">Map coverage</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Squad</h5>
              <ul>
                <li><a href="#">Discord</a></li>
                <li><a href="#">X / Twitter</a></li>
                <li><a href="#">Reddit hub</a></li>
                <li><a href="#">Affiliate program</a></li>
                <li><a href="#">Creator kit</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Terms of service</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Fair-use notice</a></li>
                <li><a href="#">Status page</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="foot-bot">
            <div className="left">© 2026 <b>R6 SQUAD ANALYZER</b>  //  Not affiliated with Ubisoft Entertainment</div>
            <div className="right">
              <span><span className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%' }}></span> ALL SYSTEMS NOMINAL</span>
              <span>BUILD 2026.04.19-R</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
