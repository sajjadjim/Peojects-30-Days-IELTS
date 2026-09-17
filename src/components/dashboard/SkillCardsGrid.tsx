'use client';

import React from 'react';
import Link from 'next/link';
import { Headphones, BookOpen, PenTool, Mic, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';

export default function SkillCardsGrid() {
  const { stats, data } = useIELTS();

  const skills = [
    {
      id: 'listening',
      name: 'Listening',
      icon: Headphones,
      currentBand: stats.latestListening,
      targetBand: data.profile.targetBand,
      accentColor: 'var(--listening-color)',
      bgGradient: 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.15) 0%, var(--bg-card) 100%)',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      href: '/listening',
      sessionsCount: data.listening.length,
      recentNote: data.listening[0]?.testName || 'No tests logged yet',
      sublabel: 'Audio & Question Tracking',
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: BookOpen,
      currentBand: stats.latestReading,
      targetBand: data.profile.targetBand,
      accentColor: 'var(--reading-color)',
      bgGradient: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.15) 0%, var(--bg-card) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      href: '/reading',
      sessionsCount: data.reading.length,
      recentNote: data.reading[0]?.testName || 'No passages logged yet',
      sublabel: 'Passage Time & Accuracy',
    },
    {
      id: 'writing',
      name: 'Writing',
      icon: PenTool,
      currentBand: stats.latestWriting,
      targetBand: data.profile.targetBand,
      accentColor: 'var(--writing-color)',
      bgGradient: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.15) 0%, var(--bg-card) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      href: '/writing',
      sessionsCount: data.writing.length,
      recentNote: data.writing[0] ? `${data.writing[0].taskType.toUpperCase()} (${data.writing[0].wordCount}w)` : 'No essays logged yet',
      sublabel: 'Task 1 & 2 Self-Assessment',
    },
    {
      id: 'speaking',
      name: 'Speaking',
      icon: Mic,
      currentBand: stats.latestSpeaking,
      targetBand: data.profile.targetBand,
      accentColor: 'var(--speaking-color)',
      bgGradient: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15) 0%, var(--bg-card) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      href: '/speaking',
      sessionsCount: data.speaking.length,
      recentNote: data.speaking[0] ? `${data.speaking[0].part} (${data.speaking[0].topic.slice(0, 25)}...)` : 'No talks logged yet',
      sublabel: 'Part 2 Cue Card & Timer',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '18px',
      margin: '24px 0',
    }}>
      {skills.map((skill) => {
        const Icon = skill.icon;
        const bandProgressPercent = Math.min(
          100,
          Math.max(0, Math.round(((skill.currentBand - 4.0) / (skill.targetBand - 4.0)) * 100))
        );

        return (
          <Link
            key={skill.id}
            href={skill.href}
            className="glass-card card-hover-glow group"
            style={{
              padding: '20px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: `1px solid ${skill.borderColor}`,
              background: skill.bgGradient,
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  className="transition-transform duration-300 group-hover:scale-110"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${skill.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: skill.accentColor,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <span>{skill.sessionsCount} logged</span>
                  <ArrowUpRight size={15} color={skill.accentColor} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Title & Sublabel */}
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {skill.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {skill.sublabel}
                </div>
              </div>

              {/* Band Score Display */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'var(--stat-box-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Practice Band
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: skill.accentColor,
                    lineHeight: 1.2,
                  }}>
                    {skill.currentBand.toFixed(1)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Target Band
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: '#10b981',
                    lineHeight: 1.2,
                  }}>
                    {skill.targetBand.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '5px',
                  background: 'var(--border-strong)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${bandProgressPercent}%`,
                    height: '100%',
                    backgroundColor: skill.accentColor,
                    borderRadius: '3px',
                  }} />
                </div>
              </div>
            </div>

            {/* Footer recent activity note */}
            <div style={{
              marginTop: '16px',
              paddingTop: '10px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Recent: {skill.recentNote}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
