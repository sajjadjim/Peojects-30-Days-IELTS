'use client';

import React from 'react';
import Link from 'next/link';
import {
  Play,
  CheckCircle2,
  PlusCircle,
  AlertOctagon,
  BookMarked,
  Mic,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'Practice Center',
      description: 'Cambridge split-screen tests',
      href: '/practice',
      icon: Sparkles,
      btnClass: 'btn-primary',
      highlight: true,
    },
    {
      title: "Start Today's Plan",
      description: 'Follow the Day 3 checklist',
      href: '/daily',
      icon: CheckCircle2,
      btnClass: 'btn-secondary',
      highlight: false,
    },
    {
      title: 'Start Timer',
      description: 'Timed study focus block',
      href: '/timer',
      icon: Play,
      btnClass: 'btn-secondary',
      highlight: false,
    },
    {
      title: 'Log Mistake',
      description: 'Record test error & rule',
      href: '/mistakes',
      icon: AlertOctagon,
      btnClass: 'btn-secondary',
      highlight: false,
    },
    {
      title: 'Add Vocabulary',
      description: 'Save new band 7 words',
      href: '/vocabulary',
      icon: BookMarked,
      btnClass: 'btn-secondary',
      highlight: false,
    },
    {
      title: 'Start Speaking',
      description: 'Part 2 Cue card & 2m timer',
      href: '/speaking',
      icon: Mic,
      btnClass: 'btn-secondary',
      highlight: false,
    },
    {
      title: '30-Day Plan',
      description: 'View 5 study phases',
      href: '/plan',
      icon: CalendarDays,
      btnClass: 'btn-secondary',
      highlight: false,
    },
  ];

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Action Launchers
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Direct zero-friction practice entry
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={`glass-card card-hover-glow interactive-press group ${act.highlight ? 'animate-glow-pulse' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                border: act.highlight ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid var(--border-subtle)',
                background: act.highlight ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), var(--bg-card))' : 'var(--bg-card)',
              }}
            >
              <div
                className="transition-transform duration-300 group-hover:scale-110"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: act.highlight ? 'var(--primary)' : 'var(--bg-elevated)',
                  color: act.highlight ? '#ffffff' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: act.highlight ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none',
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.title}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {act.description}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
