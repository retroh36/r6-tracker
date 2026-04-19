'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '../components/TopNav';
import { Bar } from '../components/ui';
import { useAnalysis } from '../context/analysis-context';
import { PLAYER } from '@/lib/mock-data';

type Phase = 'idle' | 'uploading' | 'analyzing' | 'done' | 'error';

export default function UploadPage() {
  const router = useRouter();
  const { setResult } = useAnalysis();
  const [phase, setPhase] = useState<Phase>('idle');
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [logs, setLogs] = useState<{ line: string; tone: string }[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const addLog = (line: string, tone = '') => setLogs(l => [...l, { line, tone }]);

  const addFiles = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter(
      f => f.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(f.name)
    );
    setFiles(prev => [...prev, ...arr]);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const submit = async () => {
    if (files.length === 0) return;
    setPhase('uploading');
    setLogs([]);
    setError('');

    files.forEach(f => {
      addLog(`INGEST · ${f.name}`, 'acc');
      addLog(`SIZE · ${(f.size / 1024).toFixed(1)} KB`);
    });

    const formData = new FormData();
    files.forEach(f => formData.append('screenshots', f));

    try {
      addLog('UPLOADING TO ANALYSIS ENGINE', 'acc');
      setPhase('analyzing');
      addLog('UPLOAD COMPLETE', 'good');
      addLog('ANALYZING WITH CLAUDE OPUS...', 'acc');
      addLog('EXTRACTING STATS FROM SCREENSHOTS...', 'acc');

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      addLog('EXTRACTION COMPLETE', 'good');
      addLog('COACHING REPORT GENERATED', 'good');
      addLog('ROUTING TO PROFILE →', 'acc');

      setResult(data);
      setPhase('done');
      setTimeout(() => router.push('/profile'), 1200);
    } catch (err: any) {
      setPhase('error');
      setError(err.message || 'Analysis failed');
      addLog(`ERROR · ${err.message || 'Analysis failed'}`, 'warn');
    }
  };

  const reset = () => {
    setPhase('idle');
    setFiles([]);
    setLogs([]);
    setError('');
  };

  const busy = phase !== 'idle';

  return (
    <>
      <TopNav user={PLAYER} />
      <div className="page page-bg-grid">
        <div className="wrap">

          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> STEP 01 / STAT INGEST</div>
              <h1>Drop your <em>Tracker Network</em> screenshots.</h1>
            </div>
            <div className="right">
              We support the Overall, Ranked, and Operator tabs. For the sharpest read, upload a full-page capture at 1080p or higher. Supports PNG, JPG, WebP · max 8MB.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 28, alignItems: 'start' }} className="upload-grid">
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
              .file-chip{
                display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;
                padding:10px 14px;background:var(--bg-2);border:1px solid var(--line-dim);margin-top:8px;
              }
              .file-chip .fname{font-family:'JetBrains Mono';font-size:12px;color:var(--fg);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
              .file-chip .fsize{font-family:'JetBrains Mono';font-size:10px;color:var(--fg-mute);letter-spacing:0.14em}
              .file-chip .rm{width:22px;height:22px;display:grid;place-items:center;border:1px solid var(--line-dim);color:var(--fg-mute);font-size:14px;cursor:pointer;transition:all .12s}
              .file-chip .rm:hover{border-color:var(--danger);color:var(--danger)}
            `}</style>

            {/* DROP ZONE */}
            <div
              className={'dz ' + (dragOver ? 'over ' : '') + (busy ? 'busy' : '')}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => !busy && fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={e => e.target.files && addFiles(e.target.files)}
              />

              {phase === 'idle' && files.length === 0 && (
                <div className="anim-fade">
                  <div className="dz-ico">
                    <svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6-6 6 6" /><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
                  </div>
                  <div className="tac" style={{ marginBottom: 12 }}>// AWAITING INPUT</div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 10 }}>
                    Drop screenshots here
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-dim)', marginBottom: 20 }}>
                    or <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>click to browse</span> · multiple files supported
                  </div>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                    <span>PNG · JPG · WEBP</span>
                    <span style={{ color: 'var(--line)' }}>|</span>
                    <span>MAX 8MB</span>
                    <span style={{ color: 'var(--line)' }}>|</span>
                    <span>1080P+ RECOMMENDED</span>
                  </div>
                </div>
              )}

              {phase === 'idle' && files.length > 0 && (
                <div style={{ width: '100%', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <div className="tac" style={{ marginBottom: 6 }}>// {files.length} FILE{files.length > 1 ? 'S' : ''} SELECTED</div>
                      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>
                        Ready to analyze
                      </div>
                    </div>
                    <button className="btn ghost" style={{ height: 32, padding: '0 12px', fontSize: 10 }} onClick={() => fileRef.current?.click()}>
                      ADD MORE
                    </button>
                  </div>

                  {files.map((f, i) => (
                    <div key={`${f.name}-${i}`} className="file-chip">
                      <div className="dz-ico" style={{ width: 32, height: 36, margin: 0 }}>
                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}><rect x="4" y="4" width="16" height="16" rx="1" /><circle cx="9" cy="9" r="1.5" /><path d="M4 16l5-5 7 7" /></svg>
                      </div>
                      <div>
                        <div className="fname">{f.name}</div>
                        <div className="fsize">{(f.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <div className="rm" onClick={() => removeFile(i)}>×</div>
                    </div>
                  ))}

                  <button
                    className="btn primary"
                    style={{ width: '100%', height: 48, marginTop: 20 }}
                    onClick={submit}
                  >
                    <span>ANALYZE {files.length} SCREENSHOT{files.length > 1 ? 'S' : ''}</span>
                    <span className="arrow">→</span>
                  </button>
                </div>
              )}

              {busy && (
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                      <div className="dz-ico" style={{ width: 46, height: 50, margin: 0 }}>
                        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><rect x="4" y="4" width="16" height="16" rx="1" /><circle cx="9" cy="9" r="1.5" /><path d="M4 16l5-5 7 7" /></svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: 'var(--fg)' }}>{files.length} screenshot{files.length > 1 ? 's' : ''}</div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 3 }}>
                          {phase === 'uploading' && <span style={{ color: 'var(--accent)' }}>UPLOADING...</span>}
                          {phase === 'analyzing' && <span style={{ color: 'var(--accent)' }} className="anim-pulse">AI ANALYSIS · ACTIVE</span>}
                          {phase === 'done' && <span style={{ color: 'var(--good)' }}>COMPLETE · ROUTING</span>}
                          {phase === 'error' && <span style={{ color: 'var(--danger)' }}>ERROR · SEE LOG</span>}
                        </div>
                      </div>
                    </div>
                    {phase !== 'done' && (
                      <button className="btn ghost" onClick={(e) => { e.stopPropagation(); reset(); }} style={{ height: 32, padding: '0 12px', fontSize: 10 }}>
                        {phase === 'error' ? 'RETRY' : 'CANCEL'}
                      </button>
                    )}
                  </div>

                  {(phase === 'uploading' || phase === 'analyzing') && (
                    <div className="bar" style={{ marginTop: 12 }}>
                      <i className="anim-pulse" style={{ width: phase === 'analyzing' ? '80%' : '30%' }}></i>
                    </div>
                  )}
                  {phase === 'done' && <Bar value={100} tone="good" />}

                  {phase === 'error' && (
                    <div style={{ marginTop: 16, padding: 16, border: '1px solid var(--danger)', background: 'oklch(0.650 0.230 25 / 0.06)' }}>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--danger)', marginBottom: 4 }}>ERROR</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{error}</div>
                      <button className="btn primary" style={{ marginTop: 12, height: 36 }} onClick={(e) => { e.stopPropagation(); reset(); }}>
                        TRY AGAIN
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — log + tips */}
            <div style={{ display: 'grid', gap: 20 }}>
              <div className="card">
                <div className="card-h">
                  <div className="t">EXTRACTION LOG · <b>LIVE</b></div>
                  <div className="r">{logs.length} events</div>
                </div>
                <div className="log">
                  {logs.length === 0 && <div className="l" style={{ opacity: 0.5 }}>STANDING BY · AWAITING INPUT</div>}
                  {logs.map((l, i) => <div key={i} className={'l ' + l.tone}>{l.line}</div>)}
                  {(phase === 'uploading' || phase === 'analyzing') && <div className="l acc anim-pulse">PROCESSING...</div>}
                </div>
              </div>

              <div className="card">
                <div className="card-h">
                  <div className="t">TIPS FOR <b>CLEAN EXTRACTS</b></div>
                </div>
                <div style={{ display: 'grid', gap: 14, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>
                  {[
                    ['FULL PAGE', 'Capture the entire Tracker page — not just one stat panel.'],
                    ['1080P+', 'Lower-res screenshots lose digit fidelity on K/D and W/L.'],
                    ['AVOID JPEG', 'PNG preserves the thin-font UI better than compressed JPEG.'],
                    ['DESKTOP ONLY', "Mobile Tracker layouts aren't supported yet."],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, alignItems: 'baseline', paddingBottom: 12, borderBottom: '1px dashed var(--line-dim)' }}>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{k}</div>
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
