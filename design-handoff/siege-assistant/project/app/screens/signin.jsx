// ================================================================
// SIGN-IN SCREEN
// ================================================================
function SignInScreen({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => onSignIn(mode === 'signup'), 800);
  };

  return (
    <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1fr 1fr',position:'relative',overflow:'hidden'}} className="signin-root">
      <style>{`
        .signin-root{
          background:
            radial-gradient(800px 500px at 85% 50%, oklch(0.705 0.205 38 / 0.14), transparent 60%),
            var(--bg);
        }
        .signin-root::before{
          content:"";position:absolute;inset:0;pointer-events:none;opacity:0.35;
          background-image:linear-gradient(var(--grid) 1px, transparent 1px),linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 60% 70% at 30% 50%, black, transparent 80%);
        }
        @media (max-width:900px){ .signin-root{grid-template-columns:1fr !important} .signin-left{display:none !important} }
      `}</style>

      {/* LEFT — tactical brief */}
      <div className="signin-left" style={{padding:'56px 56px',display:'flex',flexDirection:'column',justifyContent:'space-between',borderRight:'1px solid var(--line-dim)',position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}} onClick={()=>window.location.href='Landing Page.html'}>
          <BrandMark />
          <div className="brand-name" style={{fontSize:16}}>R6 <span style={{color:'var(--accent)'}}>/</span> SQUAD ANALYZER</div>
        </div>

        <div>
          <div className="tac" style={{marginBottom:20}}>// RESTRICTED ACCESS · AUTHORIZED OPERATORS</div>
          <h1 style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:'clamp(40px,4.6vw,68px)',lineHeight:0.95,letterSpacing:'-0.03em',margin:'0 0 24px'}}>
            Authenticate to <span style={{color:'var(--accent)'}}>deploy.</span>
          </h1>
          <p style={{fontSize:16,color:'var(--fg-dim)',lineHeight:1.55,maxWidth:440,margin:'0 0 36px'}}>
            Sign in to upload your Tracker stats, invite your 5-stack, and generate map-specific gameplans. Sessions persist for 30 days.
          </p>

          <div style={{display:'grid',gap:18,maxWidth:480}}>
            {[
              { n:'01', t:'Email + password', d:'We\'ll send a recovery link if you lose access.' },
              { n:'02', t:'Upload stats once', d:'Re-upload anytime. Only the most recent is used.' },
              { n:'03', t:'Squad invites via shareable link', d:'No friend-finder, no social graph scrape.' },
            ].map(s => (
              <div key={s.n} style={{display:'grid',gridTemplateColumns:'42px 1fr',gap:16,paddingBottom:18,borderBottom:'1px dashed var(--line-dim)'}}>
                <div style={{width:42,height:42,background:'var(--bg-2)',border:'1px solid var(--line)',display:'grid',placeItems:'center',fontFamily:"'JetBrains Mono'",fontWeight:700,color:'var(--accent)',fontSize:13,clipPath:'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)'}}>{s.n}</div>
                <div>
                  <div style={{fontFamily:"'Space Grotesk'",fontWeight:600,fontSize:15,marginBottom:4}}>{s.t}</div>
                  <div style={{fontSize:13,color:'var(--fg-dim)',lineHeight:1.5}}>{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',textTransform:'uppercase',letterSpacing:'0.18em',display:'flex',gap:18}}>
          <span>BUILD 2026.04.19-R</span>
          <span><span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'var(--good)',marginRight:6,boxShadow:'0 0 8px var(--good)'}}></span>ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{padding:'56px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:1}}>
        <form onSubmit={submit} className="corners" style={{width:'100%',maxWidth:440,background:'var(--panel)',border:'1px solid var(--line)',padding:36,position:'relative'}}>
          <Corners />

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
            <div>
              <div className="tac" style={{marginBottom:8}}>// {mode === 'signin' ? 'RE-AUTH' : 'NEW OPERATOR'}</div>
              <div style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:26,letterSpacing:'-0.02em'}}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </div>
            </div>
            <div style={{display:'flex',gap:0,border:'1px solid var(--line-dim)'}}>
              {['signin','signup'].map(m => (
                <button key={m} type="button" onClick={()=>setMode(m)} style={{
                  padding:'8px 12px',fontFamily:"'JetBrains Mono'",fontSize:10,textTransform:'uppercase',letterSpacing:'0.14em',
                  background: mode===m ? 'var(--accent)' : 'transparent',
                  color: mode===m ? '#0c0c10' : 'var(--fg-dim)',
                  fontWeight:600
                }}>{m==='signin'?'IN':'UP'}</button>
              ))}
            </div>
          </div>

          <div style={{display:'grid',gap:18}}>
            <div className="field">
              <div className="field-label"><span>OPERATOR EMAIL</span>{email && <b>✓</b>}</div>
              <input className="input mono" type="email" placeholder="callsign@squad.gg"
                     value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div className="field">
              <div className="field-label">
                <span>PASSWORD</span>
                {mode==='signin' && <a href="#" style={{color:'var(--fg-dim)',fontSize:10}}>FORGOT?</a>}
              </div>
              <input className="input mono" type="password" placeholder="••••••••••"
                     value={password} onChange={e=>setPassword(e.target.value)}
                     autoComplete={mode==='signin'?'current-password':'new-password'} required />
              {mode==='signup' && (
                <div style={{display:'flex',gap:6,marginTop:6}}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{flex:1,height:3,background: password.length >= i*3 ? 'var(--accent)' : 'var(--line-dim)'}}></div>
                  ))}
                </div>
              )}
            </div>

            {mode==='signup' && (
              <div style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:12,color:'var(--fg-dim)',lineHeight:1.5}}>
                <div className="checkbox on" onClick={e=>e.preventDefault()}></div>
                <div>I confirm I'm 13+ and agree to the <a href="#" style={{color:'var(--accent)'}}>terms</a> and <a href="#" style={{color:'var(--accent)'}}>privacy</a> policy. Uploaded screenshots are deleted after 30 days.</div>
              </div>
            )}

            <button type="submit" className="btn primary tall" disabled={loading || !email || !password}>
              {loading
                ? <><span className="anim-pulse">TRANSMITTING</span> <span className="mono">···</span></>
                : <><span>{mode==='signin' ? 'AUTHENTICATE' : 'DEPLOY ACCOUNT'}</span><span className="arrow">→</span></>}
            </button>

            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:12,fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--fg-mute)',letterSpacing:'0.2em'}}>
              <div style={{height:1,background:'var(--line-dim)'}}></div>
              <span>OR</span>
              <div style={{height:1,background:'var(--line-dim)'}}></div>
            </div>

            <button type="button" className="btn ghost tall" onClick={()=>onSignIn(false)}>
              <span>CONTINUE AS GUEST · DEMO MODE</span>
            </button>
          </div>

          <div style={{marginTop:24,paddingTop:20,borderTop:'1px dashed var(--line-dim)',fontSize:12,color:'var(--fg-mute)',textAlign:'center'}}>
            {mode==='signin'
              ? <>No account? <a href="#" onClick={e=>{e.preventDefault();setMode('signup')}} style={{color:'var(--accent)'}}>Enlist →</a></>
              : <>Already in the fight? <a href="#" onClick={e=>{e.preventDefault();setMode('signin')}} style={{color:'var(--accent)'}}>Sign in →</a></>}
          </div>
        </form>
      </div>
    </div>
  );
}

window.SignInScreen = SignInScreen;
