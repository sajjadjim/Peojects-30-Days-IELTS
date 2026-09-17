'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon, Shield, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserMenu() {
  const { user, isGuest, openAuthModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="btn btn-secondary btn-sm"
        style={{
          gap: '6px',
          borderRadius: 'var(--radius-full)',
          padding: '6px 14px',
          fontWeight: 700,
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          color: '#a5b4fc',
        }}
      >
        <LogIn size={14} />
        <span>Sign In</span>
      </button>
    );
  }

  // Display Name or identifier
  const displayName = user.displayName || (user.email ? user.email.split('@')[0] : user.phoneNumber || (isGuest ? 'Guest Learner' : 'IELTS Student'));
  const avatarUrl = user.photoURL;

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px 4px 6px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: isGuest ? '#64748b' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            {isGuest ? 'G' : displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span style={{ fontSize: '12.5px', fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </span>
        <ChevronDown size={13} color="var(--text-muted)" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '220px',
            padding: '8px',
            borderRadius: '12px',
            backgroundColor: '#0c1222',
            border: '1px solid var(--border-strong)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 100,
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email || user.phoneNumber || (isGuest ? 'Anonymous Guest' : 'Signed In')}
            </div>
          </div>

          {isGuest && (
            <button
              onClick={() => {
                setDropdownOpen(false);
                openAuthModal();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.1)',
                border: 'none',
                color: '#818cf8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '4px',
              }}
            >
              <Sparkles size={14} />
              <span>Link / Upgrade Account</span>
            </button>
          )}

          <button
            onClick={async () => {
              setDropdownOpen(false);
              await logout();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
