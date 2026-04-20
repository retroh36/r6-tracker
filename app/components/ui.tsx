// ================================================================
// Shared presentational components
// ================================================================
import { ReactNode } from 'react';

export function Pill({ children, tone = 'green' }: { children: ReactNode; tone?: string }) {
  return (
    <span className="pill">
      <span className={'dot' + (tone === 'amber' ? ' amber' : tone === 'red' ? ' red' : '')}></span>
      {children}
    </span>
  );
}

export function StatCell({ label, value, unit, accent = false, sub }: {
  label: string; value: string | number; unit?: string; accent?: boolean; sub?: string;
}) {
  return (
    <div>
      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em', color: accent ? 'var(--accent)' : 'var(--fg)' }}>
        {value}
        {unit && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: 'var(--accent)', marginLeft: 2 }}>{unit}</span>}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--fg-mute)', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--good)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function Corners() {
  return (
    <>
      <span className="c-tl"></span>
      <span className="c-tr"></span>
      <span className="c-bl"></span>
      <span className="c-br"></span>
    </>
  );
}

export function Bar({ value, max = 100, tone = 'accent' }: { value: number; max?: number; tone?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={'bar' + (tone === 'amber' ? ' amber' : tone === 'good' ? ' good' : '')}>
      <i style={{ width: pct + '%' }}></i>
    </div>
  );
}

export function CompareBar({ you, them }: { you: number; them: number }) {
  return (
    <div style={{ position: 'relative', height: 22, background: 'var(--bg-2)', border: '1px solid var(--line-dim)' }}>
      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: you + '%', background: 'var(--accent)' }}></div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: them + '%', width: 2, background: 'var(--fg)' }}></div>
      <div style={{ position: 'absolute', left: `calc(${them}% - 4px)`, width: 10, height: 4, background: 'var(--fg)', top: -5 }}></div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="disclaimer">
      <b>NOTICE</b>
      Independent fan-made coaching tool. Not affiliated with, endorsed by, or sponsored by Ubisoft Entertainment. Game, map, and operator references used under nominative fair use.
    </div>
  );
}