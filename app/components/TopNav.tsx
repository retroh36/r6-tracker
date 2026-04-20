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

export function TopNav({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const { email, signOut } = useAuth();
  const { result } = useAnalysis();

  // Logged-in: derive display from auth + real analysis data
  // Guest: fall back to mock props
  const rank = email
    ? (result?.stats?.rank || null)
    : user.rank;

  const initials = email
    ? email.split('@')[0].slice(0, 2).toUpperCase()
    : user.avatar.initials;

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
          <div className="meta" style={{ textAlign: 'right' }}>
            <div className="un">{email ?? user.username}</div>
            {rank && <div className="rk">{rank}</div>}
            {!email && !rank && <div className="rk">GUEST</div>}
          </div>
          {email ? (
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
          ) : (
            <Link href="/signin" className={'av sm ' + user.avatar.theme} title="Sign in">
              {initials}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
