'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

interface AuthContextType {
  email: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  email: null,
  signOut: async () => {},
});

export function AuthProvider({ email: initialEmail, children }: { email: string | null; children: ReactNode }) {
  const [email, setEmail] = useState(initialEmail);
  const router = useRouter();

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.push('/');
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ email, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
