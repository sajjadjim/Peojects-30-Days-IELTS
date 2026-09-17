'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, Timer, BookMarked, AlertOctagon } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: LayoutDashboard },
    { label: 'Plan', href: '/plan', icon: CalendarDays },
    { label: 'Timer', href: '/timer', icon: Timer },
    { label: 'Vocab', href: '/vocabulary', icon: BookMarked },
    { label: 'Mistakes', href: '/mistakes', icon: AlertOctagon },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '65px',
      backgroundColor: 'var(--bg-header)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      padding: '0 8px',
    }} className="show-mobile">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: isActive ? '#818cf8' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: isActive ? 600 : 500,
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            <Icon size={19} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
