// ================================================================
// UPLOAD STATS SCREEN — drag/drop + simulated OCR + retry
// ================================================================
function UploadScreen({ onComplete, user, onRoute }) {
  const [phase, setPhase] = useState('idle'); // idle | uploading | extracting | partial | done
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [fields, setFields] = useState(window.DATA.OCR_FIELDS.map(f => ({...f})));
  const [logs, setLogs] = useState([]);
  const [missing, setMissing] = useState([]);
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  const addLog = (line, tone='') => setLogs(l => [...l, { t: Date.now(), line, tone }]);

  const startFlow = (f) => {
    setFile(f);
    setPhase('uploading');
    setUploadPct(0);
    setLogs([]);
    setFields(window.DATA.OCR_FIELDS.map(x => ({...x, progress:0})));
    addLog(`INGEST · ${f.name}`, 'acc');
    addLog(`SIZE · ${(f.size/1024).toFixed(1)} KB`);

    // simulated upload
    let p = 0;
    const up = setInterval(() => {
      p += Math.random()*18 + 8;
      if (p >= 100) {
        p = 100; clearInterval(up);
        setUploadPct(100);
        addLog('UPLOAD COMPLETE', 'good');
        setTimeout(()=>beginExtraction(), 300);
      } else setUploadPct(p);
    }, 140);
  };

  const beginExtraction = () => {
    setPhase('extracting');
    addLog('OCR · INITIALIZING TESSERACT-TACTICAL', 'acc');
    addLog('MODEL · R6-TRACKER-V4');

    // Stagger field extraction
    let i = 0;
    const processNext = () => {
      if (i >= window.DATA.OCR_FIELDS.length) {
        // simulate a 15% chance of missing 1-2 fields to demonstrate retry
        const rand = Math.random();
        if (rand < 0.18) {
          const miss = ['headshot', 'hours'];
          setMissing(miss);
          addLog(`WARN · ${miss.length} FIELD(S) UNREADABLE`, 'warn');
          setPhase('partial');
        } else {
          addLog('EXTRACTION COMPLETE · 9/9 FIELDS', 'good');
          addLog('ROUTING TO COACH MODULE →', 'acc');
          setPhase('done');
          setTimeout(()=>onComplete(), 1400);
        }
        return;
      }
      const f = window.DATA.OCR_FIELDS[i];
      // animate progress 0 -> 100
      let p = 0;
      const t = setInterval(() => {
        p += 22 + Math.random()*18;
        setFields(curr => curr.map(x => x.key === f.key ? {...x, progress: Math.min(100, p)} : x));
        if (p >= 100) {
          clearInterval(t);
          addLog(`✓ ${f.label.padEnd(18)} · ${f.value}`);
          i++;
          timerRef.current = setTimeout(processNext, 140);
        }
      }, 60);
    };
    processNext();
  };

  const retryMissing = () => {
    addLog('RETRY · RUNNING HIGH-DPI PASS', 'acc');
    setPhase('extracting');
    let j = 0;
    const retry = () => {
      if (j >= missing.length) {
        setMissing([]);
        addLog('ALL FIELDS RESOLVED', 'good');
        addLog('ROUTING TO COACH MODULE →', 'acc');
        setPhase('done');
        setTimeout(()=>onComplete(), 1400);
        return;
      }
      const key = missing[j];
      const f = window.DATA.OCR_FIELDS.find(x => x.key === key);
      let p = 0;
      const t = setInterval(() => {
        p += 18 + Math.random()*15;
        setFields(curr => curr.map(x => x.key === key ? {...x, progress: Math.min(100, p)} : x));
        if (p >= 100) { clearInterval(t); addLog(`✓ ${f.label.padEnd(18)} · ${f.value} [RETRY]`, 'good'); j++; setTimeout(retry, 160); }
      }, 55);
    };
    retry();
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle'); setFile(null); setUploadPct(0); setLogs([]); setMissing([]);
    setFields(window.DATA.OCR_FIELDS.map(x => ({...x, progress:0})));
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) startFlow(f);
  };

  return (
    <>
      <TopNav route="upload" onRoute={onRoute || (()=>{})} user={user} />
      <div className="page page-bg-grid">
        <div className="wrap">

          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> STEP 01 / STAT INGEST</div>
              <h1>Drop your <em>Tracker Network</em> screenshot.</h1>
            </div>
            <div className="right">
              We support the Overall, Ranked, and Operator tabs. For the sharpest read, upload a full-page capture at 1080p or higher. Supports PNG, JPG, WebP · max 8MB.
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:28,alignItems:'start'}} className="upload-grid">
            <style>{`
              @media (max-width:1000px){ .upload-grid{grid-template-columns:1fr !important} }
              .dz{
                position:relative;min-height:420px;border:1.5px dashed var(--line);background:var(--panel);
                display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 32px;
                transition:all .15s;cursor:pointer;text-align:center;
              }
              .dz.over{border-color:var(--accent);background:oklch(0.22 0.02 250);box-shadow:0 0 0 1px var(--accent), 0 0 40px -10px var(--accent)}
              .dz.busy{cursor:default}
              .dz-ico{
                width:72px;height:80px;margin:0 auto 24px;position:relative;
                background:var(--bg-2);border:1px solid var(--line);
                clip-path: polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%);
                display:grid;place-items:center;
              }
              .dz-ico svg{width:32px;height:32px;stroke:var(--accent);fill:none;stroke-width:1.5}
              .log{
                background:#0a0a0e;border:1px solid var(--line-dim);padding:14px;min-height:280px;max-height:360px;overflow-y:auto;
                font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;
              }
              .log .l{color:var(--fg-dim)}
              .log .l.acc{color:var(--accent)}
              .log .l.good{color:var(--good)}
              .log .l.warn{color:var(--accent-2)}
              .log .l::before{content:"> ";color:var(--fg-mute)}
              .field-row{display:grid;grid-template-columns:1fr auto 120px;gap:14px;align-items:center;padding:8px 0;border-bottom:1px dashed var(--line-dim)}
              .field-row:last-child{border-bottom:0}
              .field-row.missing{opacity:0.85}
              .field-row .lbl{font-family:'JetBrains Mono';font-size:10px;color:var(--fg-mute);text-transform:uppercase;letter-spacing:0.14em}
              .field-row .val{font-family:'JetBrains Mono';font-size:12px;color:var(--fg);font-weight:600}
              .field-row.missing .val{color:var(--danger)}
            `}</style>

            {/* DROPZONE */}
            <div
              className={"dz " + (dragOver?'over':'') + (phase !== 'idle' ? ' busy' : '')}
              onDragOver={e=>{e.preventDefault();setDragOver(true)}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={onDrop}
              onClick={()=>phase==='idle' && fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" hidden
                     onChange={e=>e.target.files[0] && startFlow(e.target.files[0])} />

              {phase === 'idle' && (
                <div className="anim-fade">
                  <div className="dz-ico">
                    <svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6-6 6 6"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/></svg>
                  </div>
                  <div className="tac" style={{marginBottom:12}}>// AWAITING INPUT</div>
                  <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:28,letterSpacing:'-0.02em',marginBottom:10}}>
                    Drop screenshot here
                  </div>
                  <div style={{fontSize:13,color:'var(--fg-dim)',marginBottom:20}}>
                    or <span style={{color:'var(--accent)',textDecoration:'underline'}}>click to browse</span>
                  </div>
                  <div style={{display:'flex',gap:12,justifyContent:'center',fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',textTransform:'uppercase',letterSpacing:'0.16em'}}>
                    <span>PNG · JPG · WEBP</span>
                    <span style={{color:'var(--line)'}}>|</span>
                    <span>MAX 8MB</span>
                    <span style={{color:'var(--line)'}}>|</span>
                    <span>1080P+ RECOMMENDED</span>
                  </div>
                </div>
              )}

              {phase !== 'idle' && (
                <div style={{width:'100%'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,textAlign:'left'}}>
                      <div className="dz-ico" style={{width:46,height:50,margin:0}}>
                        <svg viewBox="0 0 24 24" style={{width:20,height:20}}><rect x="4" y="4" width="16" height="16" rx="1"/><circle cx="9" cy="9" r="1.5"/><path d="M4 16l5-5 7 7"/></svg>
                      </div>
                      <div>
                        <div style={{fontFamily:"'JetBrains Mono'",fontSize:12,color:'var(--fg)'}}>{file?.name || 'tracker_stats.png'}</div>
                        <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',textTransform:'uppercase',letterSpacing:'0.14em',marginTop:3}}>
                          {phase==='uploading' && <span style={{color:'var(--accent)'}}>UPLOADING · {Math.round(uploadPct)}%</span>}
                          {phase==='extracting' && <span style={{color:'var(--accent)'}} className="anim-pulse">OCR EXTRACTION · ACTIVE</span>}
                          {phase==='partial' && <span style={{color:'var(--accent-2)'}}>PARTIAL EXTRACT · RETRY AVAILABLE</span>}
                          {phase==='done' && <span style={{color:'var(--good)'}}>COMPLETE · ROUTING</span>}
                        </div>
                      </div>
                    </div>
                    {phase !== 'done' && (
                      <button className="btn ghost" onClick={(e)=>{e.stopPropagation();reset()}} style={{height:32,padding:'0 12px',fontSize:10}}>CANCEL</button>
                    )}
                  </div>

                  {phase === 'uploading' && <Bar value={uploadPct} />}

                  {(phase === 'extracting' || phase === 'partial' || phase === 'done') && (
                    <div style={{marginTop:8}}>
                      {fields.map(f => {
                        const isMissing = (phase==='partial') && missing.includes(f.key) && f.progress < 100;
                        const done = f.progress >= 100 && !isMissing;
                        return (
                          <div key={f.key} className={"field-row" + (isMissing?' missing':'')}>
                            <div>
                              <div className="lbl">{f.label}</div>
                              <div style={{marginTop:6}}>
                                <Bar value={isMissing ? 100 : f.progress} tone={isMissing ? 'amber' : done ? 'good' : 'accent'} />
                              </div>
                            </div>
                            <div style={{width:16,textAlign:'center'}}>
                              {done && <span style={{color:'var(--good)',fontSize:13}}>✓</span>}
                              {isMissing && <span style={{color:'var(--danger)',fontSize:13}}>!</span>}
                              {!done && !isMissing && f.progress > 0 && f.progress < 100 && <span className="anim-pulse" style={{color:'var(--accent)',fontSize:14,fontFamily:"'JetBrains Mono'"}}>◆</span>}
                            </div>
                            <div className="val" style={{textAlign:'right'}}>
                              {done ? f.value : isMissing ? '— UNREADABLE' : f.progress > 0 ? '...' : '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {phase === 'partial' && (
                    <div style={{marginTop:22,padding:16,border:'1px solid var(--accent-2)',background:'oklch(0.780 0.165 75 / 0.06)',display:'flex',gap:14,alignItems:'flex-start'}}>
                      <div style={{width:22,height:22,background:'var(--accent-2)',color:'#0c0c10',display:'grid',placeItems:'center',fontFamily:"'JetBrains Mono'",fontWeight:700,fontSize:13,flex:'none',clipPath:'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)'}}>!</div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,textTransform:'uppercase',letterSpacing:'0.18em',color:'var(--accent-2)',marginBottom:4}}>PARTIAL EXTRACT</div>
                        <div style={{fontSize:13,color:'var(--fg-dim)',lineHeight:1.5,marginBottom:12,textAlign:'left'}}>
                          Couldn't read <b style={{color:'var(--fg)'}}>{missing.length}</b> field(s). This usually means JPEG compression, low resolution, or a cropped screenshot. Retry with a higher-DPI pass, or re-upload a cleaner capture.
                        </div>
                        <div style={{display:'flex',gap:10}}>
                          <button className="btn primary" onClick={(e)=>{e.stopPropagation();retryMissing()}} style={{height:36}}>
                            <span>RETRY HIGH-DPI PASS</span>
                          </button>
                          <button className="btn" onClick={(e)=>{e.stopPropagation();reset()}} style={{height:36}}>RE-UPLOAD</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — terminal log + tips */}
            <div style={{display:'grid',gap:20}}>
              <div className="card">
                <div className="card-h">
                  <div className="t">EXTRACTION LOG · <b>LIVE</b></div>
                  <div className="r">{logs.length} events</div>
                </div>
                <div className="log">
                  {logs.length === 0 && <div className="l" style={{opacity:0.5}}>STANDING BY · AWAITING INPUT</div>}
                  {logs.map((l,i) => <div key={i} className={"l " + l.tone}>{l.line}</div>)}
                  {phase==='extracting' && <div className="l acc anim-pulse">PROCESSING...</div>}
                </div>
              </div>

              <div className="card">
                <div className="card-h">
                  <div className="t">TIPS FOR <b>CLEAN EXTRACTS</b></div>
                </div>
                <div style={{display:'grid',gap:14,fontSize:13,color:'var(--fg-dim)',lineHeight:1.5}}>
                  {[
                    ['FULL PAGE', 'Capture the entire Tracker page — not just one stat panel.'],
                    ['1080P+', 'Lower-res screenshots lose digit fidelity on K/D and W/L.'],
                    ['AVOID JPEG', 'PNG preserves the thin-font UI better than compressed JPEG.'],
                    ['DESKTOP ONLY', 'Mobile Tracker layouts aren\'t supported yet.'],
                  ].map(([k,v]) => (
                    <div key={k} style={{display:'grid',gridTemplateColumns:'90px 1fr',gap:12,alignItems:'baseline',paddingBottom:12,borderBottom:'1px dashed var(--line-dim)'}}>
                      <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.16em'}}>{k}</div>
                      <div>{v}</div>
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

window.UploadScreen = UploadScreen;
