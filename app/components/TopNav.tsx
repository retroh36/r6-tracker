'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <div className="nav">
      <div className="wrap nav-inner">
        <Link href="/dashboard" className="brand">
          <div className="brand-mark" aria-hidden="true"></div>
          <div className="brand-name">R6 <span>/</span> SQUAD ANALYZER</div>
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
            <div className="un">{user.username}</div>
            <div className="rk">{user.rank}</div>
          </div>
          <div className={'av sm ' + user.avatar.theme}>{user.avatar.initials}</div>
        </div>
      </div>
    </div>
  );
}
