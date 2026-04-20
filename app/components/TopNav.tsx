'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import { useAnalysis } from '../context/analysis-context';

interface NavUser {
  username: string;
  rank: string;
  avatar: { initials: string; theme: string };
}

const links = [
  { href: '/dashboard', label: 'DASHBOARD' },
  { href: '/squad',     label: 'SQUAD' },
  { href: '/upload',    label: 'UPLOAD' },
  { href: '/profile',   label: 'PROFILE' },
];

export function TopNav({ user: _user }: { user: NavUser }) {
  const pathname = usePathname();
  const { email, signOut } = useAuth();
  const { result } = useAnalysis();

  const rank = email ? (result?.stats?.rank || null) : null;
  const initials = email
    ? email.split('@')[0].slice(0, 2).toUpperCase()
    : null;

  return (
    <div className="nav">
      <div className="wrap nav-inner">
        <Link href="/dashboard" className="brand">
          <img src="/wordmark.png" alt="R6 Squad Analyzer" className="brand-img" />
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={'nav-link' + (pathname === l.href ? ' active' : '')}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="nav-user">
          {email ? (
            <>
              <div className="meta" style={{ textAlign: 'right' }}>
                <div className="un">{email}</div>
                {rank && <div className="rk">{rank}</div>}
              </div>
              <button
                onClick={signOut}
                className="av sm h-r"
                title="Sign out"
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {initials}
                <span style={{
                  position: 'absolute', bottom: -3, right: -3,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--good)', boxShadow: '0 0 6px var(--good)',
                  border: '1.5px solid var(--bg)',
                }}></span>
              </button>
            </>
          ) : (
            <Link href="/signin" className="btn ghost" style={{ height: 34, padding: '0 14px', fontSize: 10 }}>
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
