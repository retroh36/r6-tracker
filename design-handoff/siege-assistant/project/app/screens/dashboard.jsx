// ================================================================
// DASHBOARD — squad overview
// ================================================================
function DashboardScreen({ onRoute, user }) {
  const sq = window.DATA.SQUAD;
  const readyCount = sq.members.filter(m => m.status==='ready').length;

  return (
    <>
      <TopNav route="dashboard" onRoute={onRoute} user={user} />
      <div className="page page-bg-grid">
        <div className="wrap">

          {/* HERO STRIP */}
          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> SQUAD DASHBOARD</div>
              <h1>Welcome back, <em>{user.username}</em>.</h1>
            </div>
            <div className="right">
              Your squad has <b style={{color:'var(--fg)'}}>{readyCount}/{sq.slots}</b> operators locked in. Once the fifth uploads, you'll unlock map-specific strategy generation.
            </div>
          </div>

          {/* STATUS BANNER */}
          <div className="corners" style={{background:'linear-gradient(90deg, oklch(0.705 0.205 38 / 0.1), transparent 50%), var(--panel)',border:'1px solid var(--line)',padding:24,marginBottom:32,position:'relative',display:'grid',gridTemplateColumns:'1fr auto',gap:20,alignItems:'center'}}>
            <Corners />
            <div>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10,flexWrap:'wrap'}}>
                <div className="tac" style={{color:'var(--accent)'}}>// SQUAD STATUS</div>
                <Pill tone={readyCount === sq.slots ? 'green' : 'amber'}>{readyCount}/{sq.slots} · {readyCount === sq.slots ? 'COMBAT READY' : 'PARTIAL ROSTER'}</Pill>
              </div>
              <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'clamp(22px,2.5vw,32px)',letterSpacing:'-0.02em',lineHeight:1.1}}>
                {readyCount === sq.slots
                  ? <>All operators reporting. <span style={{color:'var(--accent)'}}>Select a map to deploy.</span></>
                  : <>Waiting on <span style={{color:'var(--accent)'}}>{sq.slots - readyCount} operator(s)</span> to upload stats.</>}
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn" onClick={()=>navigator.clipboard?.writeText('r6sa.gg/join/ghost-07')}>COPY INVITE LINK</button>
              <button className="btn primary" disabled={readyCount < sq.slots} onClick={()=>onRoute('squad')}>
                <span>GENERATE STRATEGY</span><span className="arrow">→</span>
              </button>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:24}} className="dash-main">
            <style>{`@media (max-width:960px){ .dash-main{grid-template-columns:1fr !important} }`}</style>

            {/* LEFT: Roster */}
            <div>
              <div className="card" style={{marginBottom:20}}>
                <div className="card-h">
                  <div className="t">ROSTER · <b>{sq.name}</b></div>
                  <div className="r">SESSIONS: {sq.sessions} · LAST PLAYED {sq.lastPlayed}</div>
                </div>
                <div style={{display:'grid',gap:8}}>
                  {sq.members.map(m => (
                    <div key={m.id} onClick={()=>m.id===1 && onRoute('profile')}
                         style={{display:'grid',gridTemplateColumns:'48px 1fr 120px 80px 80px 90px',gap:16,alignItems:'center',padding:'12px 14px',background:'var(--bg-2)',border:'1px solid var(--line-dim)',cursor:m.id===1?'pointer':'default',transition:'border-color .12s'}}
                         onMouseEnter={e=>m.id===1 && (e.currentTarget.style.borderColor='var(--accent)')}
                         onMouseLeave={e=>m.id===1 && (e.currentTarget.style.borderColor='var(--line-dim)')}>
                      <div className={"av md " + m.avatar.theme}>{m.avatar.initials}</div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,display:'flex',gap:8,alignItems:'center'}}>
                          {m.username}
                          {m.id===1 && <span style={{fontFamily:"'JetBrains Mono'",fontSize:9,color:'var(--accent)',letterSpacing:'0.16em',border:'1px solid var(--accent)',padding:'1px 5px'}}>YOU</span>}
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',letterSpacing:'0.14em',marginTop:3}}>{m.role}</div>
                      </div>
                      <div className="mono" style={{fontSize:12,color:'var(--fg-dim)'}}>K/D <b style={{color:'var(--fg)'}}>{m.kd}</b></div>
                      <div className="mono" style={{fontSize:12,color:'var(--fg-dim)'}}>WR <b style={{color:'var(--fg)'}}>{m.wr}%</b></div>
                      <Pill tone={m.status==='ready'?'green':'amber'}>{m.status==='ready'?'READY':'PENDING'}</Pill>
                      <div style={{textAlign:'right',fontFamily:"'JetBrains Mono'",fontSize:10,color:m.id===1?'var(--accent)':'var(--fg-mute)',letterSpacing:'0.14em'}}>
                        {m.id===1 ? 'VIEW →' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="card-h"><div className="t">RECENT ACTIVITY</div><div className="r">LAST 24H</div></div>
                <div style={{display:'grid',gap:10}}>
                  {[
                    { w:'hexboy.exe', t:'uploaded new ranked stats', a:'8m ago', k:'upload' },
                    { w:'m0rsecode', t:'completed Peek-reset drill', a:'1h ago', k:'drill' },
                    { w:'COACH', t:'flagged utility overspend on entries (kraitzen)', a:'3h ago', k:'coach' },
                    { w:'SQUAD', t:'generated Coastline ATK gameplan · v3', a:'5h ago', k:'strat' },
                  ].map((ev,i) => (
                    <div key={i} style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:14,alignItems:'center',padding:'10px 0',borderBottom:i<3?'1px dashed var(--line-dim)':0}}>
                      <div style={{width:28,height:28,background:'var(--bg-3)',border:'1px solid var(--line)',display:'grid',placeItems:'center',fontFamily:"'JetBrains Mono'",fontSize:10,color:ev.k==='coach'?'var(--accent)':ev.k==='strat'?'var(--accent-2)':'var(--fg-dim)',clipPath:'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)'}}>
                        {ev.k==='upload'?'↑':ev.k==='drill'?'◆':ev.k==='coach'?'!':'▶'}
                      </div>
                      <div style={{fontSize:13,color:'var(--fg-dim)'}}>
                        <b style={{color:'var(--fg)',fontFamily:"'JetBrains Mono'",fontSize:11,letterSpacing:'0.06em'}}>{ev.w}</b> {ev.t}
                      </div>
                      <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',letterSpacing:'0.14em'}}>{ev.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Your stats + CTA */}
            <div style={{display:'grid',gap:20}}>
              <div className="corners" style={{background:'var(--panel)',border:'1px solid var(--line)',padding:20,position:'relative'}}>
                <Corners />
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
                  <div className={"av lg " + user.avatar.theme}>{user.avatar.initials}</div>
                  <div>
                    <div className="tac" style={{marginBottom:4}}>YOUR DOSSIER</div>
                    <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:20,letterSpacing:'-0.015em'}}>{user.username}</div>
                    <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--accent)',letterSpacing:'0.16em',marginTop:3}}>{user.archetype} · {user.rank}</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,paddingTop:14,borderTop:'1px dashed var(--line-dim)'}}>
                  <StatCell label="K/D" value={user.stats.kd} accent />
                  <StatCell label="WIN RATE" value={user.stats.winRate} unit="%" />
                </div>
                <button className="btn primary" style={{width:'100%',marginTop:16}} onClick={()=>onRoute('profile')}>
                  <span>VIEW COACH REPORT</span><span className="arrow">→</span>
                </button>
              </div>

              <div className="card">
                <div className="card-h"><div className="t">SQUAD AVG</div></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                  <StatCell label="AVG K/D"  value={user.squadAvg.kd} />
                  <StatCell label="AVG WR"   value={user.squadAvg.winRate} unit="%" />
                  <StatCell label="AVG HS%"  value={user.squadAvg.headshot} unit="%" />
                  <StatCell label="AVG DMG"  value={user.squadAvg.avgDamage} />
                </div>
              </div>

              <div className="corners" style={{background:'linear-gradient(180deg, oklch(0.705 0.205 38 / 0.08), transparent), var(--panel)',border:'1px solid var(--accent)',padding:20,position:'relative'}}>
                <Corners />
                <div className="tac" style={{color:'var(--accent)',marginBottom:10}}>// COACH HIGHLIGHT</div>
                <div style={{fontFamily:"'Space Grotesk'",fontWeight:600,fontSize:16,lineHeight:1.3,marginBottom:10}}>
                  Your squad lacks a hard-breach specialist on attack.
                </div>
                <div style={{fontSize:13,color:'var(--fg-dim)',lineHeight:1.5,marginBottom:14}}>
                  Only <b style={{color:'var(--fg)'}}>quinoa.shot</b> rates Hibana/Ace. Consider rotating <b style={{color:'var(--accent)'}}>vexel.py</b> to secondary breach on bomb sites with wall-plays.
                </div>
                <button className="btn ghost" style={{width:'100%',height:36,fontSize:10}}>ADD TO PRACTICE QUEUE</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

window.DashboardScreen = DashboardScreen;
