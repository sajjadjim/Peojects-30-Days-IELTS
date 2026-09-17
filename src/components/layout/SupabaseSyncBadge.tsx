'use client';

import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink, X } from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';

export default function SupabaseSyncBadge() {
  const { cloudStatus, cloudMessage, lastSyncedAt, syncNow, pullFromCloud, testConnection, setupSql } = useIELTS();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(setupSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualSync = async () => {
    setIsActionLoading(true);
    await syncNow();
    setIsActionLoading(false);
  };

  const handleManualPull = async () => {
    setIsActionLoading(true);
    await pullFromCloud();
    setIsActionLoading(false);
  };

  const handleTest = async () => {
    setIsActionLoading(true);
    await testConnection();
    setIsActionLoading(false);
  };

  // Badge appearance based on cloudStatus
  let badgeBg = 'rgba(255, 255, 255, 0.05)';
  let badgeBorder = 'rgba(255, 255, 255, 0.1)';
  let badgeColor = 'var(--text-secondary)';
  let badgeLabel = 'Supabase';
  let badgeDot = '#94a3b8';

  if (cloudStatus === 'synced') {
    badgeBg = 'rgba(16, 185, 129, 0.12)';
    badgeBorder = 'rgba(16, 185, 129, 0.3)';
    badgeColor = '#34d399';
    badgeLabel = 'Supabase Synced';
    badgeDot = '#10b981';
  } else if (cloudStatus === 'syncing') {
    badgeBg = 'rgba(99, 102, 241, 0.15)';
    badgeBorder = 'rgba(99, 102, 241, 0.35)';
    badgeColor = '#a5b4fc';
    badgeLabel = 'Syncing...';
    badgeDot = '#6366f1';
  } else if (cloudStatus === 'setup_needed') {
    badgeBg = 'rgba(245, 158, 11, 0.15)';
    badgeBorder = 'rgba(245, 158, 11, 0.4)';
    badgeColor = '#fbbf24';
    badgeLabel = 'SQL Setup Needed';
    badgeDot = '#f59e0b';
  } else if (cloudStatus === 'error') {
    badgeBg = 'rgba(239, 68, 68, 0.15)';
    badgeBorder = 'rgba(239, 68, 68, 0.4)';
    badgeColor = '#f87171';
    badgeLabel = 'Sync Issue';
    badgeDot = '#ef4444';
  } else if (cloudStatus === 'checking') {
    badgeLabel = 'Connecting...';
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '5px 11px',
          borderRadius: 'var(--radius-full)',
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          color: badgeColor,
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        title="Click to view Supabase database sync status"
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: badgeDot,
            boxShadow: cloudStatus === 'synced' ? '0 0 8px #10b981' : cloudStatus === 'syncing' ? '0 0 8px #6366f1' : 'none',
          }}
        />
        <Database size={13} />
        <span>{badgeLabel}</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid var(--border-strong)',
              backgroundColor: '#0f172a',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <Database size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Supabase Database Connection
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    qicndufzkorzfeyszmqz.supabase.co
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px', borderRadius: '8px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status Alert */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: badgeBg,
                border: `1px solid ${badgeBorder}`,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              {cloudStatus === 'synced' ? (
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : cloudStatus === 'setup_needed' ? (
                <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: badgeColor }}>
                  {cloudStatus === 'synced'
                    ? 'Connected and Fully Synchronized'
                    : cloudStatus === 'setup_needed'
                    ? 'Supabase Table Setup Required'
                    : cloudStatus === 'syncing'
                    ? 'Synchronizing with Supabase...'
                    : 'Supabase Connection Status'}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {cloudMessage || 'Supabase project credentials configured.'}
                </div>
                {lastSyncedAt && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Last synced: {lastSyncedAt.toLocaleTimeString()} ({lastSyncedAt.toLocaleDateString()})
                  </div>
                )}
              </div>
            </div>

            {/* SQL Setup Instruction if needed */}
            {cloudStatus === 'setup_needed' && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                    Step: Run this SQL in your Supabase SQL Editor
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="btn btn-sm"
                    style={{
                      background: copied ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      gap: '6px',
                      fontSize: '12px',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  Open your <a href="https://supabase.com/dashboard/project/qicndufzkorzfeyszmqz/sql" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Supabase SQL Editor <ExternalLink size={11} style={{ display: 'inline' }} /></a>, paste this SQL and hit <b>Run</b>:
                </p>
                <pre
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    background: '#090d16',
                    padding: '12px',
                    borderRadius: '8px',
                    maxHeight: '160px',
                    overflowY: 'auto',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {setupSql}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={handleTest}
                disabled={isActionLoading}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <RefreshCw size={14} className={isActionLoading ? 'spin' : ''} />
                <span>Test Connection</span>
              </button>

              <button
                onClick={handleManualPull}
                disabled={isActionLoading || cloudStatus === 'setup_needed'}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px' }}
              >
                <span>Download from Cloud</span>
              </button>

              <button
                onClick={handleManualSync}
                disabled={isActionLoading || cloudStatus === 'setup_needed'}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <span>Upload to Cloud Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
