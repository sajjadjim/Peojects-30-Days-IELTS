'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  Timer,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  Sparkles,
  AlertOctagon,
  FileCheck2,
  BarChart3,
  Calendar,
  Settings,
  Flame,
  Target
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Practice Center', href: '/practice', icon: Sparkles, color: '#38bdf8' },
  { name: 'Study Plan', href: '/plan', icon: CalendarDays },
  { name: "Today's Routine", href: '/daily', icon: CheckSquare },
  { name: 'Study Timer', href: '/timer', icon: Timer, color: '#f97316' },
];

const skillNavItems: NavItem[] = [
  { name: 'Listening', href: '/listening', icon: Headphones, color: 'var(--listening-color)' },
  { name: 'Reading', href: '/reading', icon: BookOpen, color: 'var(--reading-color)' },
  { name: 'Writing', href: '/writing', icon: PenTool, color: 'var(--writing-color)' },
  { name: 'Speaking', href: '/speaking', icon: Mic, color: 'var(--speaking-color)' },
  { name: 'Vocabulary', href: '/vocabulary', icon: BookMarked, color: 'var(--vocab-color)' },
  { name: 'Grammar', href: '/grammar', icon: Sparkles, color: 'var(--grammar-color)' },
  { name: 'Mistake Book', href: '/mistakes', icon: AlertOctagon, color: '#ef4444' },
];

const reviewNavItems: NavItem[] = [
  { name: 'Mock Tests', href: '/mock-tests', icon: FileCheck2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { stats, data } = useIELTS();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
      overflowY: 'auto',
    }} className="hidden-mobile">
      {/* Brand & Goal Badge */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            {data.profile.targetBand.toFixed(1)}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              IELTS Target {data.profile.targetBand.toFixed(1)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {data.profile.durationDays}-Day Custom Plan
            </div>
          </div>
        </Link>

        {/* Goal Trajectory Pill */}
        <div style={{
          marginTop: '16px',
          padding: '10px 12px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={15} color="#818cf8" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Band Progress</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
            {data.profile.currentBand} → {data.profile.targetBand}
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Core Nav */}
        <div>
          <div style={{ padding: '0 10px 6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Mission Control
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                    border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} style={{ color: isActive ? 'var(--primary)' : (item.color || 'var(--text-muted)') }} />
                    <span>{item.name}</span>
                  </div>
                  {item.href === '/daily' && stats.todayTasksTotal > 0 && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      background: stats.todayTasksCompleted === stats.todayTasksTotal ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: stats.todayTasksCompleted === stats.todayTasksTotal ? '#34d399' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}>
                      {stats.todayTasksCompleted}/{stats.todayTasksTotal}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Skill Modules */}
        <div>
          <div style={{ padding: '0 10px 6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Skills & Drills
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {skillNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                    border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} style={{ color: item.color }} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Review & Analytics */}
        <div>
          <div style={{ padding: '0 10px 6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Analytics & History
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {reviewNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                    border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={17} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User / Streak Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--accent-streak-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-streak)'
          }}>
            <Flame size={16} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {stats.currentStreak} Day Streak
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              Best: {stats.longestStreak} days
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
            Day {stats.currentDayNumber}/30
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
            {stats.daysRemaining} left
          </div>
        </div>
      </div>
    </aside>
  );
}
