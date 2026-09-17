import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAAUFiuGLGll3DAS11jFWFmuCrl3jyQkJk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ielts-plan.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ielts-plan",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ielts-plan.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "727231239654",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:727231239654:web:4e117fece4e98c974ab227"
};

// Initialize Firebase safely (avoid multi-instance warning in Next.js HMR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign In with Email & Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return result.user;
}

/**
 * Sign Up with Email, Password & Display Name
 */
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
}

/**
 * Sign In with Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Sign In Anonymously (Guest)
 */
export async function signInAsGuest(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Setup Recaptcha for Phone Authentication
 */
export function setupRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (typeof window === 'undefined') {
    throw new Error('RecaptchaVerifier can only be created in browser environment');
  }

  // Clear existing if any on window
  const w = window as any;
  if (w.recaptchaVerifier) {
    try {
      w.recaptchaVerifier.clear();
    } catch (_) {}
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      // Response expired
    },
  });

  w.recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Send Phone Verification SMS
 */
export async function sendPhoneVerificationCode(
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return await signInWithPhoneNumber(auth, phoneNumber.trim(), verifier);
}

/**
 * Password Recovery / Reset Email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Sign Out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export type { User, ConfirmationResult };
