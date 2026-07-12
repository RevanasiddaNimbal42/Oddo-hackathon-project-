import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Role } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, role: Role, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const roleUsers: Record<Role, User> = {
  'Fleet Manager': { id: 'u1', name: 'Alex Morgan', email: 'alex@transitops.com', role: 'Fleet Manager', avatarHue: 210 },
  'Dispatcher': { id: 'u2', name: 'Jordan Lee', email: 'jordan@transitops.com', role: 'Dispatcher', avatarHue: 340 },
  'Safety Officer': { id: 'u3', name: 'Riley Park', email: 'riley@transitops.com', role: 'Safety Officer', avatarHue: 150 },
  'Financial Analyst': { id: 'u4', name: 'Casey Wu', email: 'casey@transitops.com', role: 'Financial Analyst', avatarHue: 45 },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('transitops-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, role: Role, name?: string) => {
    const base = roleUsers[role];
    const u = name ? { ...base, name, email } : base;
    setUser(u);
    localStorage.setItem('transitops-user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transitops-user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
