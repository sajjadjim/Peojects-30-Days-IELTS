'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Moon,
  Sun,
  Laptop,
  Target,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types/ielts';
import CustomPlanBuilderModal from '@/components/plan/CustomPlanBuilderModal';

export default function SettingsPage() {
  const {
    data,
    updateProfile,
    resetAllData,
    exportData,
    importData,
    cloudStatus,
    cloudMessage,
    lastSyncedAt,
    syncNow,
    pullFromCloud,
    testConnection,
    setupSql,
  } = useIELTS();

  const { user, syncProfileToDb } = useAuth();

  const [formData, setFormData] = useState<UserProfile>(data.profile);
  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(data.profile);
  }, [data.profile]);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCloudActionRunning, setIsCloudActionRunning] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(setupSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    handleChange('theme', newTheme);
    let effective = newTheme;
    if (newTheme === 'system') {
      effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', effective);
    try {
      localStorage.setItem('ielts_theme', newTheme);
    } catch (_) {}
    updateProfile({ theme: newTheme });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    if (syncProfileToDb) {
      syncProfileToDb({
        name: formData.name,
        currentBand: formData.currentBand,
        targetBand: formData.targetBand,
        dailyStudyTargetMinutes: formData.dailyStudyTargetMinutes,
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts_study_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus('Data backup successfully restored!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Failed to parse JSON backup file. Please verify format.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setImportStatus('Reset to realistic IELTS baseline seed data completed.');
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-streak" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>
            <SettingsIcon size={13} />
            System Preferences
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
          Study Settings & Data Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
          Configure your sprint targets, export local backup, or reset study data
        </p>
      </div>

      {importStatus && (
        <div className="glass-card" style={{ padding: '14px 18px', marginBottom: '20px', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#818cf8', fontWeight: 600 }}>
          {importStatus}
        </div>
      )}

      {/* Target & Profile Settings Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
              IELTS Target & Study Commitments
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Freely set your target band, plan duration in days, and daily study hours
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPlanBuilderOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Sliders size={14} />
            <span>Launch Plan Builder Wizard</span>
          </button>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label className="form-label">Current Practice Baseline Band</label>
              <select
                className="select"
                value={formData.currentBand}
                onChange={(e) => handleChange('currentBand', parseFloat(e.target.value))}
              >
                {[3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5].map(b => (
                  <option key={b} value={b}>Band {b.toFixed(1)} Baseline</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Target Goal Band</label>
              <select
                className="select"
                value={formData.targetBand}
                onChange={(e) => handleChange('targetBand', parseFloat(e.target.value))}
              >
                {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(b => (
                  <option key={b} value={b}>
                    Band {b.toFixed(1)} {b >= 8.0 ? '(Advanced/Expert)' : b >= 7.0 ? '(C1 Good User)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Plan Duration (Days)</label>
              <input
                type="number"
                min="3"
                max="365"
                className="input"
                value={formData.durationDays || 30}
                onChange={(e) => handleChange('durationDays', parseInt(e.target.value, 10) || 30)}
                required
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Default: 30 days (e.g. 7, 14, 30, 45, 60, 90)
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Sprint Start Date</label>
              <input
                type="date"
                className="input"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Daily Study Target (minutes)</label>
              <input
                type="number"
                min="30"
                max="480"
                step="15"
                className="input"
                value={formData.dailyStudyTargetMinutes}
                onChange={(e) => handleChange('dailyStudyTargetMinutes', parseInt(e.target.value, 10) || 180)}
                required
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Default: 180 minutes (3 hours/day)
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Minimum Streak Requirement (minutes)</label>
              <input
                type="number"
                min="30"
                max="180"
                step="15"
                className="input"
                value={formData.minimumStreakMinutes}
                onChange={(e) => handleChange('minimumStreakMinutes', parseInt(e.target.value, 10) || 120)}
                required
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Default: 120 minutes required to maintain streak
              </div>
            </div>

            <div>
              <label className="form-label">Daily Vocabulary Target (words/day)</label>
              <input
                type="number"
                min="5"
                max="30"
                className="input"
                value={formData.dailyVocabTarget}
                onChange={(e) => handleChange('dailyVocabTarget', parseInt(e.target.value, 10) || 10)}
                required
              />
            </div>
          </div>

          {/* Interface Theme Options */}
          <div>
            <label className="form-label" style={{ marginBottom: '8px' }}>
              Interface Theme & Visual Appearance
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: formData.theme === 'dark' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-card)',
                  color: formData.theme === 'dark' ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Moon size={22} color={formData.theme === 'dark' ? '#818cf8' : '#64748b'} />
                <span>Dark Mode</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Focus & low light</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: formData.theme === 'light' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-card)',
                  color: formData.theme === 'light' ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sun size={22} color={formData.theme === 'light' ? '#f59e0b' : '#64748b'} />
                <span>Light Mode</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Crisp daylight study</span>
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.theme === 'system' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: formData.theme === 'system' ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-card)',
                  color: formData.theme === 'system' ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Laptop size={22} color={formData.theme === 'system' ? '#38bdf8' : '#64748b'} />
                <span>System Auto</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Match OS preference</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            {saveSuccess ? (
              <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                Settings Saved Successfully!
              </span>
            ) : <span />}

            <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
              <Save size={16} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Cloud Database Persistence */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <Database size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
                Supabase Cloud Database
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Project: <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>https://qicndufzkorzfeyszmqz.supabase.co</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            background: cloudStatus === 'synced' ? 'rgba(16, 185, 129, 0.15)' : cloudStatus === 'setup_needed' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: cloudStatus === 'synced' ? '1px solid rgba(16, 185, 129, 0.4)' : cloudStatus === 'setup_needed' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
            color: cloudStatus === 'synced' ? '#34d399' : cloudStatus === 'setup_needed' ? '#fbbf24' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: cloudStatus === 'synced' ? '#10b981' : cloudStatus === 'setup_needed' ? '#f59e0b' : '#94a3b8'
            }} />
            <span>{cloudStatus === 'synced' ? 'Online & Synced' : cloudStatus === 'setup_needed' ? 'SQL Setup Needed' : cloudStatus === 'syncing' ? 'Syncing...' : 'Connected'}</span>
          </div>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
          {cloudMessage || 'Your IELTS 30-Day study tracker is connected to your Supabase PostgreSQL cloud database.'}
          {lastSyncedAt && (
            <span style={{ display: 'block', marginTop: '4px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Last synchronized with Supabase: {lastSyncedAt.toLocaleTimeString()} ({lastSyncedAt.toLocaleDateString()})
            </span>
          )}
        </p>

        {/* Setup notice if table does not exist in Supabase yet */}
        {cloudStatus === 'setup_needed' && (
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            padding: '16px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>
                Required: Initialize Database Table in Supabase
              </div>
              <button
                onClick={handleCopySql}
                className="btn btn-sm"
                style={{
                  background: copiedSql ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  gap: '6px',
                  fontSize: '12px'
                }}
              >
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Open <a href="https://supabase.com/dashboard/project/qicndufzkorzfeyszmqz/sql" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Supabase SQL Editor <ExternalLink size={11} style={{ display: 'inline' }} /></a>, paste the SQL schema, and click <b>Run</b>. Then click "Test Connection" below.
            </p>
            <pre style={{
              fontSize: '11px',
              color: '#94a3b8',
              background: '#090d16',
              padding: '10px 12px',
              borderRadius: '8px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {setupSql}
            </pre>
          </div>
        )}

        {/* Supabase Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={async () => {
              setIsCloudActionRunning(true);
              await syncNow();
              setIsCloudActionRunning(false);
            }}
            disabled={isCloudActionRunning || cloudStatus === 'setup_needed'}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Database size={14} />
            <span>Upload Progress to Supabase</span>
          </button>

          <button
            onClick={async () => {
              setIsCloudActionRunning(true);
              await pullFromCloud();
              setIsCloudActionRunning(false);
            }}
            disabled={isCloudActionRunning || cloudStatus === 'setup_needed'}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <span>Restore from Supabase</span>
          </button>

          <button
            onClick={async () => {
              setIsCloudActionRunning(true);
              await testConnection();
              setIsCloudActionRunning(false);
            }}
            disabled={isCloudActionRunning}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <RefreshCw size={14} className={isCloudActionRunning ? 'spin' : ''} />
            <span>Test Connection</span>
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Offline File Backups (JSON)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={handleExport} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
              <Download size={14} />
              <span>Export JSON Backup</span>
            </button>

            <label className="btn btn-secondary btn-sm" style={{ gap: '6px', cursor: 'pointer' }}>
              <Upload size={14} />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone: Seed Data Reset */}
      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', marginBottom: '8px' }}>
          <AlertTriangle size={18} />
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
            Danger Zone
          </h3>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Reset your study tracker to the realistic sample curriculum seed data. This will overwrite local test logs.
        </p>

        {showResetConfirm ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleConfirmReset} className="btn btn-danger">
              Yes, Overwrite & Reset Data
            </button>
            <button onClick={() => setShowResetConfirm(false)} className="btn btn-ghost btn-sm">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowResetConfirm(true)} className="btn btn-danger btn-sm" style={{ gap: '6px' }}>
            <RotateCcw size={14} />
            <span>Reset to Initial Seed Data</span>
          </button>
        )}
      </div>

      {/* Interactive Custom Plan Builder Wizard */}
      <CustomPlanBuilderModal
        isOpen={isPlanBuilderOpen}
        onClose={() => setIsPlanBuilderOpen(false)}
      />
    </div>
  );
}
