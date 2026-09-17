'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInAsGuest,
  setupRecaptchaVerifier,
  sendPhoneVerificationCode,
  sendPasswordReset,
  ConfirmationResult
} from '@/lib/firebase';
import { syncUserToDatabase } from '@/lib/supabase';

type AuthView = 'signin' | 'signup' | 'phone' | 'forgot';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, user } = useAuth();

  const [view, setView] = useState<AuthView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Close modal if user logged in successfully
  useEffect(() => {
    if (user && isAuthModalOpen) {
      closeAuthModal();
      resetForm();
    }
  }, [user, isAuthModalOpen, closeAuthModal]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhoneNumber('');
    setVerificationCode('');
    setConfirmationResult(null);
    setIsCodeSent(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setView('signin');
  };

  if (!isAuthModalOpen) return null;

  const formatFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/invalid-phone-number':
        return 'Please enter a valid phone number including country code (e.g. +1234567890).';
      case 'auth/code-expired':
        return 'SMS code has expired. Please request a new code.';
      case 'auth/invalid-verification-code':
        return 'Incorrect verification code. Please check and re-enter.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few moments and try again.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before completing.';
      default:
        return err?.message || 'Authentication error occurred. Please try again.';
    }
  };

  // 1. Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const newUser = await signUpWithEmail(email, password, name);
      await syncUserToDatabase(newUser, { displayName: name });
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Anonymous Guest Sign In
  const handleGuestSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInAsGuest();
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Phone Auth: Step 1 - Send Code
  const handleSendPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const verifier = setupRecaptchaVerifier('recaptcha-container');
      const confirmation = await sendPhoneVerificationCode(phoneNumber, verifier);
      setConfirmationResult(confirmation);
      setIsCodeSent(true);
      setSuccessMsg(`SMS verification code sent to ${phoneNumber}`);
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Phone Auth: Step 2 - Verify Code
  const handleVerifyPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Forgot Password Recovery
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setSuccessMsg(`Password reset link sent! Check your inbox for ${email}.`);
    } catch (err: any) {
      setErrorMsg(formatFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          borderRadius: '20px',
          border: '1px solid var(--border-strong)',
          backgroundColor: '#0c1222',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          position: 'relative',
        }}
      >
        {/* Invisible Recaptcha container */}
        <div id="recaptcha-container"></div>

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 12px',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {view === 'signin' && 'Welcome Back'}
            {view === 'signup' && 'Create Study Account'}
            {view === 'phone' && 'Phone Number Sign In'}
            {view === 'forgot' && 'Reset Password'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {view === 'signin' && 'Sign in to sync your 30-day IELTS progress'}
            {view === 'signup' && 'Track vocabulary, mock exams, and daily streaks'}
            {view === 'phone' && 'Fast SMS verification without passwords'}
            {view === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              fontSize: '12.5px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              fontSize: '12.5px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Social & Guest Buttons (Shown on Sign In & Sign Up) */}
        {(view === 'signin' || view === 'signup') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                height: '42px',
                fontSize: '13.5px',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.25a11.96 11.96 0 0 0 0 10.84l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch to Phone Auth or Anonymous */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setView('phone');
                }}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '12px' }}
              >
                <Phone size={13} color="#38bdf8" />
                <span>Phone Auth</span>
              </button>

              <button
                type="button"
                onClick={handleGuestSignIn}
                disabled={isLoading}
                className="btn btn-secondary btn-sm"
                style={{ gap: '6px', fontSize: '12px' }}
              >
                <UserCheck size={13} color="#a5b4fc" />
                <span>Guest Access</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or with email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>
          </div>
        )}

        {/* View 1: Email Sign In Form */}
        {view === 'signin' && (
          <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView('forgot');
                  }}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11.5px', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', height: '42px', fontSize: '14px', fontWeight: 700 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setView('signup');
                }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* View 2: Email Sign Up Form */}
        {view === 'signup' && (
          <form onSubmit={handleEmailSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajjad Hossain"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Password (min 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', height: '42px', fontSize: '14px', fontWeight: 700 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Free Account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setView('signin');
                }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* View 3: Phone Number Authentication */}
        {view === 'phone' && (
          <div>
            {!isCodeSent ? (
              <form onSubmit={handleSendPhoneCode} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Phone Number (with country code)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="tel"
                      required
                      placeholder="+880 1700 000000 or +1 555 1234"
                      className="input"
                      style={{ paddingLeft: '36px' }}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Includes country code (e.g., +880, +1, +44)
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', height: '42px', fontSize: '14px', fontWeight: 700 }}
                >
                  {isLoading ? 'Sending SMS...' : 'Send Verification Code'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      setView('signin');
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Back to Email Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneCode} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Enter 6-Digit SMS Code
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      className="input"
                      style={{ paddingLeft: '36px', letterSpacing: '4px', fontSize: '16px', fontWeight: 700 }}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', height: '42px', fontSize: '14px', fontWeight: 700 }}
                >
                  {isLoading ? 'Verifying Code...' : 'Verify & Enter'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCodeSent(false);
                      setVerificationCode('');
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* View 4: Forgot Password Recovery */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', height: '42px', fontSize: '14px', fontWeight: 700 }}
            >
              {isLoading ? 'Sending Link...' : 'Send Recovery Email'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setView('signin');
                }}
                className="btn btn-ghost btn-sm"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
