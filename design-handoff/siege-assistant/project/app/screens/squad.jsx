// ================================================================
// SQUAD PAGE — 5-player slots + map selector + generate strategy
// ================================================================
function SquadScreen({ onRoute, user, onGenerateStrategy }) {
  const sq = window.DATA.SQUAD;
  const [selectedMap, setSelectedMap] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const readyCount = sq.members.filter(m => m.status==='ready').length;
  const canGenerate = readyCount === sq.slots && selectedMap;

  const generate = () => {
    setGenerating(true);
    setGenStep(0);
    const steps = [
      'ANALYZING ROSTER COMPOSITION',
      'CROSS-REFERENCING MAP META',
      'ASSIGNING OPERATOR PICKS',
      'PLOTTING ATTACK EXECUTIONS',
      'BUILDING DEFENSE SETUPS',
      'COMPILING CALLOUTS',
    ];
    let i = 0;
    const t = setInterval(() => {
      i++;
      setGenStep(i);
      if (i >= steps.length) {
        clearInterval(t);
        setTimeout(() => {
          setGenerating(false);
          onGenerateStrategy(selectedMap);
        }, 400);
      }
    }, 420);
  };

  const genSteps = [
    'ANALYZING ROSTER COMPOSITION',
    'CROSS-REFERENCING MAP META',
    'ASSIGNING OPERATOR PICKS',
    'PLOTTING ATTACK EXECUTIONS',
    'BUILDING DEFENSE SETUPS',
    'COMPILING CALLOUTS',
  ];

  return (
    <>
      <TopNav route="squad" onRoute={onRoute} user={user} />
      <div className="page page-bg-grid">
        <div className="wrap">

          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> SQUAD DEPLOYMENT</div>
              <h1><em>{sq.name}</em> · pick a map, deploy the plan.</h1>
            </div>
            <div className="right">
              All <b style={{color:'var(--fg)'}}>{readyCount}/{sq.slots}</b> operators have uploaded stats. Select a map from the competitive pool to generate per-player operator assignments, attack execs, defense setups, and callouts.
            </div>
          </div>

          {/* 5 SLOTS */}
          <div style={{marginBottom:40}}>
            <div className="tac" style={{marginBottom:14}}>// ROSTER · 5 SLOTS</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}} className="slot-grid">
              <style>{`
                @media (max-width:960px){ .slot-grid{grid-template-columns:repeat(2,1fr) !important} }
                @media (max-width:520px){ .slot-grid{grid-template-columns:1fr !important} }
                .slot{background:var(--panel);border:1px solid var(--line);padding:18px;position:relative;min-height:180px;display:flex;flex-direction:column;transition:all .15s}
                .slot.ready{border-color:var(--line)}
                .slot.ready:hover{border-color:var(--accent)}
                .slot .slot-n{font-family:'JetBrains Mono';font-size:10px;color:var(--fg-mute);letter-spacing:0.18em;margin-bottom:14px;display:flex;justify-content:space-between}
                .slot .slot-n b{color:var(--accent);font-weight:600}
              `}</style>
              {sq.members.map((m, i) => (
                <div key={m.id} className="slot ready corners">
                  <span className="c-tl" style={{width:10,height:10}}></span><span className="c-tr" style={{width:10,height:10}}></span>
                  <div className="slot-n"><span>SLOT <b>0{i+1}</b></span><span style={{color:'var(--good)'}}>● READY</span></div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,flex:1,justifyContent:'center'}}>
                    <div className={"av lg " + m.avatar.theme}>{m.avatar.initials}</div>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:13,fontWeight:600}}>{m.username}</div>
                      <div style={{fontFamily:"'JetBrains Mono'",fontSize:9,color:'var(--accent)',letterSpacing:'0.16em',marginTop:4}}>{m.role}</div>
                    </div>
                    <div style={{display:'flex',gap:10,fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',paddingTop:8,borderTop:'1px dashed var(--line-dim)',width:'100%',justifyContent:'center'}}>
                      <span>K/D <b style={{color:'var(--fg)'}}>{m.kd}</b></span>
                      <span>WR <b style={{color:'var(--fg)'}}>{m.wr}%</b></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAP PICKER + GENERATE */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:24}} className="map-grid">
            <style>{`@media (max-width:960px){ .map-grid{grid-template-columns:1fr !important} }`}</style>

            <div className="card">
              <div className="card-h">
                <div className="t">MAP POOL · <b>COMPETITIVE</b></div>
                <div className="r">SEASON Y11 · 12/22 ACTIVE</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}} className="map-list">
                <style>{`
                  @media (max-width:680px){ .map-list{grid-template-columns:repeat(2,1fr) !important} }
                  .mapc{padding:14px 12px;background:var(--bg-2);border:1px solid var(--line-dim);cursor:pointer;transition:all .12s;text-align:left;position:relative}
                  .mapc:hover{border-color:var(--fg-dim)}
                  .mapc.on{border-color:var(--accent);background:linear-gradient(180deg, oklch(0.705 0.205 38 / 0.12), transparent)}
                  .mapc .ico{width:100%;height:54px;background:var(--bg-3);border:1px solid var(--line-dim);position:relative;margin-bottom:10px;overflow:hidden}
                  .mapc.on .ico{border-color:var(--accent)}
                  .mapc .ico::before,.mapc .ico::after{content:"";position:absolute;background:var(--fg-mute)}
                  .mapc.on .ico::before,.mapc.on .ico::after{background:var(--accent)}
                  .mapc .ico::before{left:8px;right:8px;top:18px;height:1px}
                  .mapc .ico::after{left:8px;right:18px;top:28px;height:1px}
                  .mapc .mn{font-family:'Space Grotesk';font-weight:600;font-size:13px;letter-spacing:-0.01em}
                  .mapc .mm{font-family:'JetBrains Mono';font-size:9px;color:var(--fg-mute);text-transform:uppercase;letter-spacing:0.16em;margin-top:3px}
                  .mapc.on .mm{color:var(--accent)}
                `}</style>
                {window.DATA.MAPS.map((m,i) => (
                  <div key={m} className={"mapc corners" + (selectedMap===m?' on':'')} onClick={()=>setSelectedMap(m)}>
                    {selectedMap===m && <><span className="c-tl" style={{width:10,height:10}}></span><span className="c-tr" style={{width:10,height:10}}></span></>}
                    <div className="ico"></div>
                    <div className="mn">{m}</div>
                    <div className="mm">{selectedMap===m ? '● SELECTED' : `POOL · ${['A','B','C'][i%3]}-TIER`}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* GENERATE PANEL */}
            <div style={{display:'grid',gap:18,alignContent:'start'}}>
              <div className="corners" style={{background:'var(--panel)',border:'1px solid ' + (canGenerate?'var(--accent)':'var(--line)'),padding:22,position:'relative'}}>
                <Corners />
                <div className="tac" style={{color:canGenerate?'var(--accent)':'var(--fg-mute)',marginBottom:14}}>// STRATEGY GENERATION</div>

                <div style={{marginBottom:18}}>
                  <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',letterSpacing:'0.16em',marginBottom:6}}>SELECTED MAP</div>
                  <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:selectedMap?26:18,letterSpacing:'-0.02em',color:selectedMap?'var(--fg)':'var(--fg-mute)',minHeight:32}}>
                    {selectedMap || '— NO MAP LOCKED —'}
                  </div>
                </div>

                <div style={{display:'grid',gap:8,marginBottom:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',letterSpacing:'0.14em'}}>
                    <span>ROSTER</span><span style={{color:'var(--good)'}}>{readyCount}/{sq.slots} READY</span>
                  </div>
                  <Bar value={(readyCount/sq.slots)*100} tone="good" />
                </div>

                {generating ? (
                  <div style={{display:'grid',gap:6,padding:'8px 0'}}>
                    {genSteps.map((s,i) => (
                      <div key={s} style={{display:'flex',alignItems:'center',gap:10,fontFamily:"'JetBrains Mono'",fontSize:10,letterSpacing:'0.12em',color: i<genStep?'var(--good)':i===genStep?'var(--accent)':'var(--fg-mute)'}}>
                        <span>{i<genStep?'✓':i===genStep?'◆':'○'}</span>
                        <span className={i===genStep?'anim-pulse':''}>{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button className="btn primary" style={{width:'100%',height:52}} disabled={!canGenerate} onClick={generate}>
                    <span>GENERATE STRATEGY</span><span className="arrow">→</span>
                  </button>
                )}

                {!canGenerate && !generating && (
                  <div style={{marginTop:12,fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',letterSpacing:'0.1em',lineHeight:1.5}}>
                    {!selectedMap ? '» SELECT A MAP TO UNLOCK' : '» ALL 5 PLAYERS MUST UPLOAD'}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="card-h"><div className="t">RECENT GAMEPLANS</div></div>
                <div style={{display:'grid',gap:8,fontSize:13}}>
                  {[
                    ['COASTLINE','ATK','2h ago'],
                    ['CLUBHOUSE','DEF','1d ago'],
                    ['OREGON','ATK','3d ago'],
                  ].map(([m,s,a]) => (
                    <div key={m+a} style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:10,alignItems:'center',padding:'8px 10px',background:'var(--bg-2)',border:'1px solid var(--line-dim)'}}>
                      <div style={{fontFamily:"'Space Grotesk'",fontWeight:600,fontSize:13}}>{m}</div>
                      <div className="mono" style={{fontSize:10,color:s==='ATK'?'var(--accent)':'var(--accent-2)',letterSpacing:'0.14em'}}>{s}</div>
                      <div className="mono" style={{fontSize:9,color:'var(--fg-mute)',letterSpacing:'0.14em'}}>{a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

window.SquadScreen = SquadScreen;
