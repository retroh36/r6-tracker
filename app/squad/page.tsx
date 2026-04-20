'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TopNav } from '../components/TopNav';
import { Corners, Pill } from '../components/ui';
import { useAuth } from '../context/auth-context';
import { PLAYER } from '@/lib/mock-data';

interface SquadSummary {
  id: string;
  name: string;
  tag: string | null;
  member_count: number;
  created_at: string;
}

interface MemberProfile {
  id: string;
  ubisoft_username: string;
  stats: any;
}

interface SquadMember {
  id: string;
  slot: number;
  profile_id: string;
  profiles: MemberProfile;
}

interface SquadDetail {
  id: string;
  name: string;
  tag: string | null;
  owner_id: string;
  squad_members: SquadMember[];
}

interface SearchResult {
  id: string;
  ubisoft_username: string;
  stats: { kd: number | null; winRate: number | null; rank: string | null };
}

export default function SquadPage() {
  const { email } = useAuth();

  // Squad list
  const [squads, setSquads] = useState<SquadSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Active squad
  const [activeSquadId, setActiveSquadId] = useState<string | null>(null);
  const [activeSquad, setActiveSquad] = useState<SquadDetail | null>(null);
  const [squadLoading, setSquadLoading] = useState(false);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [creating, setCreating] = useState(false);

  // Search modal
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  // Inline edit
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTag, setEditTag] = useState('');

  // Error
  const [error, setError] = useState('');

  // --- Data fetching ---

  const fetchSquads = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/squads');
    const data = await res.json();
    if (Array.isArray(data)) {
      setSquads(data);
      if (data.length > 0 && !activeSquadId) {
        setActiveSquadId(data[0].id);
      }
    }
    setLoading(false);
  }, [activeSquadId]);

  const fetchSquad = useCallback(async (id: string) => {
    setSquadLoading(true);
    const res = await fetch(`/api/squads/${id}`);
    const data = await res.json();
    if (data.id) setActiveSquad(data);
    setSquadLoading(false);
  }, []);

  useEffect(() => {
    if (email) fetchSquads();
    else setLoading(false);
  }, [email]);

  useEffect(() => {
    if (activeSquadId) fetchSquad(activeSquadId);
  }, [activeSquadId]);

  // --- Debounced search ---

  useEffect(() => {
    if (!showSearch) return;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      const params = new URLSearchParams({ q: searchQuery });
      if (activeSquadId) params.set('squad_id', activeSquadId);
      const res = await fetch(`/api/users/search?${params}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, showSearch, activeSquadId]);

  // --- Actions ---

  const createSquad = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch('/api/squads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), tag: newTag.trim() }),
    });
    const data = await res.json();
    if (data.id) {
      setShowCreate(false);
      setNewName('');
      setNewTag('');
      setActiveSquadId(data.id);
      await fetchSquads();
    }
    setCreating(false);
  };

  const updateSquad = async () => {
    if (!activeSquadId || !editName.trim()) return;
    await fetch(`/api/squads/${activeSquadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), tag: editTag.trim() }),
    });
    setEditingName(false);
    await fetchSquad(activeSquadId);
    await fetchSquads();
  };

  const deleteSquad = async () => {
    if (!activeSquadId) return;
    await fetch(`/api/squads/${activeSquadId}`, { method: 'DELETE' });
    setActiveSquad(null);
    setActiveSquadId(null);
    await fetchSquads();
  };

  const addMember = async (profileId: string) => {
    if (!activeSquadId) return;
    setAdding(profileId);
    setError('');
    const res = await fetch(`/api/squads/${activeSquadId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to add player');
    } else {
      setShowSearch(false);
      setSearchQuery('');
      await fetchSquad(activeSquadId);
      await fetchSquads();
    }
    setAdding(null);
  };

  const removeMember = async (memberId: string) => {
    if (!activeSquadId) return;
    await fetch(`/api/squads/${activeSquadId}/members/${memberId}`, { method: 'DELETE' });
    await fetchSquad(activeSquadId);
    await fetchSquads();
  };

  // --- Helpers ---

  const membersInSlots = () => {
    const slots: (SquadMember | null)[] = [null, null, null, null, null];
    if (activeSquad) {
      for (const m of activeSquad.squad_members) {
        if (m.slot >= 1 && m.slot <= 5) slots[m.slot - 1] = m;
      }
    }
    return slots;
  };

  const openSearch = () => {
    setShowSearch(true);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  // --- Render: not logged in ---

  if (!email) {
    return (
      <>
        <TopNav user={PLAYER} />
        <div className="page page-bg-grid">
          <div className="wrap">
            <div className="corners" style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: 48, position: 'relative', textAlign: 'center', marginTop: 40 }}>
              <Corners />
              <div className="tac" style={{ color: 'var(--accent)', marginBottom: 16 }}>// AUTHENTICATION REQUIRED</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.02em', marginBottom: 12 }}>
                Sign in to build your squad.
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.5, maxWidth: 480, margin: '0 auto 28px' }}>
                Create a 5-stack, add players by searching their uploaded profiles, and generate map-specific gameplans.
              </div>
              <Link href="/signin" className="btn primary">
                <span>SIGN IN</span><span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Render: loading ---

  if (loading) {
    return (
      <>
        <TopNav user={PLAYER} />
        <div className="page page-bg-grid">
          <div className="wrap" style={{ paddingTop: 80, textAlign: 'center' }}>
            <div className="tac anim-pulse" style={{ color: 'var(--accent)' }}>// LOADING SQUADS...</div>
          </div>
        </div>
      </>
    );
  }

  // --- Render: no squads ---

  if (squads.length === 0) {
    return (
      <>
        <TopNav user={PLAYER} />
        <div className="page page-bg-grid">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <div className="sec-num"><i></i> SQUAD DEPLOYMENT</div>
                <h1>Build your <em>5-stack</em>.</h1>
              </div>
            </div>

            <div className="corners" style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: 48, position: 'relative', textAlign: 'center' }}>
              <Corners />
              <div className="tac" style={{ color: 'var(--accent)', marginBottom: 16 }}>// NO SQUADS FOUND</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(24px,3vw,36px)', letterSpacing: '-0.02em', marginBottom: 12 }}>
                Create your first squad.
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.5, maxWidth: 480, margin: '0 auto 28px' }}>
                Add up to 5 players, and once everyone&apos;s uploaded stats, generate per-player operator assignments and tactical gameplans.
              </div>
              <button className="btn primary" onClick={() => setShowCreate(true)}>
                <span>CREATE SQUAD</span><span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create modal */}
        {showCreate && renderCreateModal()}
      </>
    );
  }

  // --- Render: active squad ---

  const slots = membersInSlots();
  const memberCount = activeSquad?.squad_members.length ?? 0;

  function renderCreateModal() {
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'oklch(0 0 0 / 0.6)', backdropFilter: 'blur(8px)' }}
        onClick={() => setShowCreate(false)}
        onKeyDown={e => e.key === 'Escape' && setShowCreate(false)}
      >
        <div
          className="corners"
          style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: 32, position: 'relative', width: '100%', maxWidth: 440 }}
          onClick={e => e.stopPropagation()}
        >
          <Corners />
          <div className="tac" style={{ color: 'var(--accent)', marginBottom: 12 }}>// NEW SQUAD</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', marginBottom: 24 }}>
            Deploy a new squad.
          </div>

          <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
            <div className="field">
              <div className="field-label"><span>SQUAD NAME</span></div>
              <input
                className="input mono"
                placeholder="e.g. GHOST-07"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && createSquad()}
              />
            </div>
            <div className="field">
              <div className="field-label"><span>TAG (OPTIONAL)</span></div>
              <input
                className="input mono"
                placeholder="e.g. GHT"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                maxLength={5}
                onKeyDown={e => e.key === 'Enter' && createSquad()}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn primary" style={{ flex: 1 }} onClick={createSquad} disabled={creating || !newName.trim()}>
              <span>{creating ? 'DEPLOYING...' : 'DEPLOY SQUAD'}</span><span className="arrow">→</span>
            </button>
            <button className="btn ghost" onClick={() => setShowCreate(false)}>CANCEL</button>
          </div>
        </div>
      </div>
    );
  }

  function renderSearchModal() {
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', background: 'oklch(0 0 0 / 0.6)', backdropFilter: 'blur(8px)' }}
        onClick={closeSearch}
        onKeyDown={e => e.key === 'Escape' && closeSearch()}
      >
        <div
          className="corners"
          style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: 32, position: 'relative', width: '100%', maxWidth: 520, maxHeight: '80vh', overflow: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          <Corners />
          <div className="tac" style={{ color: 'var(--accent)', marginBottom: 12 }}>// ADD PLAYER</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Search by username.
          </div>

          <div className="field" style={{ marginBottom: 20 }}>
            <div className="field-label"><span>UBISOFT USERNAME</span></div>
            <input
              className="input mono"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ padding: '8px 12px', border: '1px solid var(--danger)', background: 'oklch(0.650 0.230 25 / 0.08)', marginBottom: 16, fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--danger)', letterSpacing: '0.04em' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: 6 }}>
            {searching && (
              <div className="tac anim-pulse" style={{ color: 'var(--accent)', padding: '16px 0' }}>SEARCHING...</div>
            )}

            {!searching && searchQuery.trim() && searchResults.length === 0 && (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.14em', marginBottom: 6 }}>NO USERS FOUND</div>
                <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.5 }}>They need to upload stats first.</div>
              </div>
            )}

            {searchResults.map(r => (
              <div
                key={r.id}
                style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, alignItems: 'center',
                  padding: '10px 14px', background: 'var(--bg-2)', border: '1px solid var(--line-dim)',
                  cursor: adding ? 'default' : 'pointer', transition: 'border-color .12s',
                }}
                onClick={() => !adding && addMember(r.id)}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-dim)')}
              >
                <div className="av md h-r">{(r.ubisoft_username || '??').slice(0, 2).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.ubisoft_username}</div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', letterSpacing: '0.14em', marginTop: 2 }}>
                    {r.stats.rank || 'UNRANKED'}
                    {r.stats.kd != null && <> · K/D {r.stats.kd}</>}
                    {r.stats.winRate != null && <> · WR {r.stats.winRate}%</>}
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: adding === r.id ? 'var(--accent)' : 'var(--fg-mute)', letterSpacing: '0.14em' }}>
                  {adding === r.id ? 'ADDING...' : '+ ADD'}
                </div>
              </div>
            ))}
          </div>

          <button className="btn ghost" style={{ width: '100%', marginTop: 20 }} onClick={closeSearch}>CLOSE</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopNav user={PLAYER} />
      <div className="page page-bg-grid">
        <div className="wrap">

          <div className="sec-head">
            <div>
              <div className="sec-num"><i></i> SQUAD DEPLOYMENT</div>
              <h1>Manage your <em>5-stack</em>.</h1>
            </div>
            <div className="right">
              <button className="btn primary" onClick={() => setShowCreate(true)}>
                <span>NEW SQUAD</span><span className="arrow">+</span>
              </button>
            </div>
          </div>

          {/* Squad tabs */}
          {squads.length > 1 && (
            <div className="tabs" style={{ marginBottom: 28 }}>
              {squads.map(s => (
                <div
                  key={s.id}
                  className={'tab' + (activeSquadId === s.id ? ' active' : '')}
                  onClick={() => setActiveSquadId(s.id)}
                >
                  {s.name} <b>{s.member_count}/5</b>
                </div>
              ))}
            </div>
          )}

          {/* Squad header */}
          {activeSquad && (
            <div className="corners" style={{ background: 'linear-gradient(90deg, oklch(0.705 0.205 38 / 0.1), transparent 50%), var(--panel)', border: '1px solid var(--line)', padding: 24, marginBottom: 32, position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
              <Corners />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div className="tac" style={{ color: 'var(--accent)' }}>// SQUAD STATUS</div>
                  <Pill tone={memberCount === 5 ? 'green' : 'amber'}>{memberCount}/5 · {memberCount === 5 ? 'COMBAT READY' : 'PARTIAL ROSTER'}</Pill>
                </div>

                {editingName ? (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      className="input mono"
                      style={{ height: 38, fontSize: 18, fontWeight: 700, maxWidth: 300 }}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onBlur={updateSquad}
                      onKeyDown={e => { if (e.key === 'Enter') updateSquad(); if (e.key === 'Escape') setEditingName(false); }}
                      autoFocus
                    />
                    <input
                      className="input mono"
                      style={{ height: 38, fontSize: 12, maxWidth: 80 }}
                      value={editTag}
                      onChange={e => setEditTag(e.target.value)}
                      onBlur={updateSquad}
                      placeholder="TAG"
                      maxLength={5}
                    />
                  </div>
                ) : (
                  <div
                    style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 'clamp(22px,2.5vw,32px)', letterSpacing: '-0.02em', lineHeight: 1.1, cursor: 'pointer' }}
                    onClick={() => { setEditingName(true); setEditName(activeSquad.name); setEditTag(activeSquad.tag || ''); }}
                    title="Click to edit"
                  >
                    {activeSquad.name}
                    {activeSquad.tag && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: 'var(--fg-mute)', marginLeft: 12, letterSpacing: '0.14em' }}>[{activeSquad.tag}]</span>}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn primary" disabled title="Coming soon">
                  <span>GENERATE STRATEGY</span>
                </button>
                <button className="btn danger" onClick={deleteSquad} style={{ height: 40, padding: '0 14px', fontSize: 10 }}>DELETE</button>
              </div>
            </div>
          )}

          {/* 5 SLOTS */}
          {squadLoading ? (
            <div className="tac anim-pulse" style={{ color: 'var(--accent)', padding: '40px 0' }}>// LOADING ROSTER...</div>
          ) : (
            <div style={{ marginBottom: 40 }}>
              <div className="tac" style={{ marginBottom: 14 }}>// ROSTER · 5 SLOTS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }} className="slot-grid">
                <style>{`
                  @media (max-width:960px){ .slot-grid{grid-template-columns:repeat(2,1fr) !important} }
                  @media (max-width:520px){ .slot-grid{grid-template-columns:1fr !important} }
                  .slot{background:var(--panel);border:1px solid var(--line);padding:18px;position:relative;min-height:180px;display:flex;flex-direction:column;transition:all .15s}
                  .slot.filled:hover{border-color:var(--accent)}
                  .slot.empty{border-style:dashed;cursor:pointer}
                  .slot.empty:hover{border-color:var(--accent);background:oklch(0.22 0.02 250)}
                  .slot .slot-n{font-family:'JetBrains Mono';font-size:10px;color:var(--fg-mute);letter-spacing:0.18em;margin-bottom:14px;display:flex;justify-content:space-between}
                  .slot .slot-n b{color:var(--accent);font-weight:600}
                  .slot .rm-btn{position:absolute;top:8px;right:8px;width:22px;height:22px;display:grid;place-items:center;border:1px solid var(--line-dim);color:var(--fg-mute);font-size:13px;cursor:pointer;transition:all .12s;opacity:0}
                  .slot:hover .rm-btn{opacity:1}
                  .slot .rm-btn:hover{border-color:var(--danger);color:var(--danger)}
                `}</style>

                {slots.map((member, i) => {
                  if (member) {
                    const p = member.profiles;
                    const initials = (p.ubisoft_username || '??').slice(0, 2).toUpperCase();
                    const rank = p.stats?.rank || 'UNRANKED';
                    const kd = p.stats?.kd ?? '—';
                    const wr = p.stats?.winRate ?? '—';
                    return (
                      <div key={member.id} className="slot filled corners">
                        <span className="c-tl" style={{ width: 10, height: 10 }}></span>
                        <span className="c-tr" style={{ width: 10, height: 10 }}></span>
                        <div className="slot-n">
                          <span>SLOT <b>0{i + 1}</b></span>
                          <span style={{ color: 'var(--good)' }}>● READY</span>
                        </div>
                        <div className="rm-btn" onClick={() => removeMember(member.id)} title="Remove">×</div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' }}>
                          <div className="av lg h-r">{initials}</div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.ubisoft_username}</div>
                            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'var(--accent)', letterSpacing: '0.16em', marginTop: 4 }}>{rank}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 10, fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', paddingTop: 8, borderTop: '1px dashed var(--line-dim)', width: '100%', justifyContent: 'center' }}>
                            <span>K/D <b style={{ color: 'var(--fg)' }}>{kd}</b></span>
                            <span>WR <b style={{ color: 'var(--fg)' }}>{wr}{typeof wr === 'number' ? '%' : ''}</b></span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={`empty-${i}`} className="slot empty" onClick={openSearch}>
                      <div className="slot-n">
                        <span>SLOT <b>0{i + 1}</b></span>
                        <span style={{ color: 'var(--fg-mute)' }}>○ EMPTY</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' }}>
                        <div className="av lg empty" style={{ fontSize: 20, color: 'var(--fg-mute)' }}>+</div>
                        <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'var(--fg-mute)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                          ADD PLAYER
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generate strategy CTA */}
          <div className="corners" style={{ background: 'var(--panel)', border: '1px solid var(--line-dim)', padding: 22, position: 'relative', textAlign: 'center' }}>
            <Corners />
            <div className="tac" style={{ color: 'var(--fg-mute)', marginBottom: 10 }}>// STRATEGY GENERATION</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 16, color: 'var(--fg-dim)', marginBottom: 14 }}>
              Fill all 5 slots to unlock strategy generation.
            </div>
            <button className="btn primary" disabled style={{ opacity: 0.4 }}>
              <span>GENERATE STRATEGY — COMING SOON</span>
            </button>
          </div>

        </div>
      </div>

      {/* Modals */}
      {showCreate && renderCreateModal()}
      {showSearch && renderSearchModal()}
    </>
  );
}
