// ================================================================
// R6 SQUAD ANALYZER — shared small components
// ================================================================
const { useState, useEffect, useRef, useMemo } = React;

// ---- NAV ----
function TopNav({ route, onRoute, user }) {
  const links = [
    { k: 'dashboard', label: 'DASHBOARD' },
    { k: 'squad',     label: 'SQUAD' },
    { k: 'upload',    label: 'UPLOAD' },
    { k: 'profile',   label: 'PROFILE' },
  ];
  return (
    <div className="nav">
      <div className="wrap nav-inner">
        <div className="brand" onClick={() => onRoute('dashboard')}>
          <div className="brand-mark" aria-hidden="true"></div>
          <div className="brand-name">R6 <span>/</span> SQUAD ANALYZER</div>
        </div>
        <div className="nav-links">
          {links.map(l => (
            <div key={l.k} className={"nav-link" + (route === l.k ? ' active' : '')} onClick={() => onRoute(l.k)}>
              {l.label}
            </div>
          ))}
        </div>
        <div className="nav-user">
          <div className="meta" style={{textAlign:'right'}}>
            <div className="un">{user.username}</div>
            <div className="rk">{user.rank}</div>
          </div>
          <div className={"av sm " + user.avatar.theme}>{user.avatar.initials}</div>
        </div>
      </div>
    </div>
  );
}

// ---- PILL + DOT ----
function Pill({ children, tone='green', mono=false }) {
  return (
    <span className="pill">
      <span className={"dot" + (tone === 'amber' ? ' amber' : tone === 'red' ? ' red' : '')}></span>
      {children}
    </span>
  );
}

// ---- STAT ROW ----
function StatCell({ label, value, unit, accent=false, sub }) {
  return (
    <div>
      <div style={{fontFamily:"'Space Grotesk'",fontWeight:600,fontSize:26,letterSpacing:'-0.02em',color: accent ? 'var(--accent)' : 'var(--fg)'}}>
        {value}{unit && <span style={{fontFamily:"'JetBrains Mono'",fontSize:13,color:'var(--accent)',marginLeft:2}}>{unit}</span>}
      </div>
      <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,textTransform:'uppercase',letterSpacing:'0.16em',color:'var(--fg-mute)',marginTop:6}}>{label}</div>
      {sub && <div style={{fontFamily:"'JetBrains Mono'",fontSize:10,color:'var(--good)',marginTop:4}}>{sub}</div>}
    </div>
  );
}

// ---- CORNER FRAME ----
function Corners() {
  return (<><span className="c-tl"></span><span className="c-tr"></span><span className="c-bl"></span><span className="c-br"></span></>);
}

// ---- BAR ----
function Bar({ value, max=100, tone='accent' }) {
  const pct = Math.max(0, Math.min(100, (value/max)*100));
  return (
    <div className={"bar" + (tone==='amber'?' amber':tone==='good'?' good':'')}>
      <i style={{width: pct+'%'}}></i>
    </div>
  );
}

// ---- COMPARE BAR (vs squad) ----
function CompareBar({ you, them, max=100 }) {
  const y = Math.max(0, Math.min(100, (you/max)*100));
  const t = Math.max(0, Math.min(100, (them/max)*100));
  return (
    <div style={{position:'relative',height:22,background:'var(--bg-2)',border:'1px solid var(--line-dim)'}}>
      <div style={{position:'absolute',inset:'0 auto 0 0',width: y+'%',background:'var(--accent)'}}></div>
      <div style={{position:'absolute',top:0,bottom:0,left: t+'%',width:2,background:'var(--fg)'}}></div>
      <div style={{position:'absolute',top:-1,bottom:-1,left: `calc(${t}% - 4px)`,width:10,height:4,background:'var(--fg)',top:-5}}></div>
    </div>
  );
}

// ---- FAIR USE DISCLAIMER ----
function Disclaimer() {
  return (
    <div className="disclaimer">
      <b>NOTICE</b>
      Independent fan-made coaching tool. Not affiliated with, endorsed by, or sponsored by Ubisoft Entertainment. Game, map, and operator references used under nominative fair use.
    </div>
  );
}

// ---- BRAND MARK (for standalone screens) ----
function BrandMark({ size=34 }) {
  return (
    <div style={{
      width:size,height:size,display:'grid',placeItems:'center',
      background:'linear-gradient(135deg, var(--accent), oklch(0.62 0.22 25))',
      clipPath:'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)'
    }}>
      <span style={{fontFamily:"'JetBrains Mono'",fontWeight:700,fontSize:size*0.35,color:'#0c0c10'}}>R6</span>
    </div>
  );
}

Object.assign(window, { TopNav, Pill, StatCell, Corners, Bar, CompareBar, Disclaimer, BrandMark });
