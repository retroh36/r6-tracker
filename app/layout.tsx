import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AuthProvider } from './context/auth-context';
import { AnalysisProvider } from './context/analysis-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'R6 Squad Analyzer',
  description: 'Tactical coaching for ranked Rainbow Six Siege squads',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider email={user?.email ?? null}>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
