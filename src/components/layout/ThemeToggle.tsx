'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';

export default function ThemeToggle() {
  const { data, updateProfile } = useIELTS();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    // Read from data-theme attribute on documentElement or localStorage
    const active = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' || data.profile.theme || 'dark';
    setCurrentTheme(active === 'light' ? 'light' : 'dark');
  }, [data.profile.theme]);

  const toggleTheme = () => {
    const nextTheme: 'dark' | 'light' = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('ielts_theme', nextTheme);
    } catch (_) {}
    updateProfile({ theme: nextTheme });
  };

  if (!mounted) {
    return (
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      />
    );
  }

  const isLight = currentTheme === 'light';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="btn btn-ghost"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-full)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        color: isLight ? '#f59e0b' : '#38bdf8',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title={isLight ? 'Switch to Dark mode' : 'Switch to Light mode'}
      aria-label="Toggle light and dark mode"
    >
      {isLight ? (
        <Sun size={17} style={{ transition: 'transform 0.3s ease' }} />
      ) : (
        <Moon size={17} style={{ transition: 'transform 0.3s ease' }} />
      )}
    </button>
  );
}
