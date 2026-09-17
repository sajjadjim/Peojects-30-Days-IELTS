'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Flame, Clock, PlusCircle, AlertTriangle } from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes } from '@/lib/ieltsUtils';

import SupabaseSyncBadge from './SupabaseSyncBadge';
import UserMenu from '@/components/auth/UserMenu';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onOpenQuickAdd?: () => void;
}

export default function Header({ onOpenQuickAdd }: HeaderProps) {
  const { stats, data } = useIELTS();

  const progressPercent = Math.min(
    100,
    Math.round((stats.todayStudyMinutes / data.profile.dailyStudyTargetMinutes) * 100)
  );

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-header)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      {/* Left: Sprint Day Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {data.profile.durationDays}-Day IELTS Challenge
            </span>
            <span style={{
              padding: '1px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}>
              Day {stats.currentDayNumber} of {data.profile.durationDays}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>
            {stats.daysRemaining} days left until exam readiness
          </div>
        </div>
      </div>

      {/* Right: Study Stats & Primary Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Theme Toggle Button (Light/Dark Mode) */}
        <ThemeToggle />

        {/* User Auth Menu */}
        <UserMenu />

        {/* Supabase Cloud Sync Badge */}
        <SupabaseSyncBadge />

        {/* Streak Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-streak-bg)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          color: 'var(--accent-streak)',
          fontSize: '12.5px',
          fontWeight: 700,
        }} title="Current active study streak">
          <Flame size={16} />
          <span>{stats.currentStreak}d Streak</span>
        </div>

        {/* Today's Study Progress Bar Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12.5px',
        }}>
          <Clock size={15} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatMinutes(stats.todayStudyMinutes)}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              / {formatMinutes(data.profile.dailyStudyTargetMinutes)}
            </span>
          </div>
          <div style={{
            width: '60px',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginLeft: '4px'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent >= 100 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #06b6d4)',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {/* Start Timer CTA */}
        <Link
          href="/timer"
          className="btn btn-primary btn-sm pulse-glow"
          style={{ textDecoration: 'none' }}
        >
          <Play size={14} fill="currentColor" />
          <span>Start Timer</span>
        </Link>
      </div>
    </header>
  );
}
