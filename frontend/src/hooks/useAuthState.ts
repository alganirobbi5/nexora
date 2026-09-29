import { useAuth } from '@/contexts/AuthContext';

export type { User, RegisterPayload, LoginPayload } from '@/lib/auth';

export default function useAuthState() {
  const auth = useAuth();

  if (!auth) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }

  return auth;
}