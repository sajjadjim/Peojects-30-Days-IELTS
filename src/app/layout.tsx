import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { IELTSProvider } from '@/context/IELTSContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import AuthModal from '@/components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'IELTS Target 7.0 — 30-Day Intensive Personal Study Tracker',
  description: 'Structured 30-day IELTS practice operating system: time management, band score progression (5.5 → 7.0), error notebook, and daily mock test analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ielts_theme');
                  var theme = saved || 'dark';
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <IELTSProvider>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Header />
                <main>{children}</main>
              </div>
              <MobileNav />
            </div>
            <AuthModal />
          </IELTSProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
