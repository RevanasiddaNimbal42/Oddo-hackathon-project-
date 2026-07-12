import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthLayout, AuthShowcase } from '../../components/auth/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../types';
import { cn } from '../../utils';

const roles: { value: Role; label: string; desc: string }[] = [
  { value: 'Fleet Manager', label: 'Fleet Manager', desc: 'Full access' },
  { value: 'Dispatcher', label: 'Dispatcher', desc: 'Trips & dispatch' },
  { value: 'Safety Officer', label: 'Safety Officer', desc: 'Drivers & maintenance' },
  { value: 'Financial Analyst', label: 'Financial Analyst', desc: 'Expenses & reports' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex@transitops.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      login('google.user@transitops.com', role, 'Google User');
      navigate('/');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      navigate('/');
    }, 600);
  };

  return (
    <AuthLayout
      side={
        <AuthShowcase
          title="Smart Transport Operations Platform"
          subtitle="Manage your fleet, drivers, trips, and expenses — all in one beautifully designed dashboard."
          stats={[
            { label: 'Vehicles managed', value: '12+' },
            { label: 'Active drivers', value: '10+' },
            { label: 'Trips dispatched', value: '500+' },
            { label: 'Uptime', value: '99.9%' },
          ]}
        />
      }
    >
      <h1 className="text-2xl font-bold text-fg tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted mt-1.5">Sign in to your TransitOps account</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={16} />}
          placeholder="you@company.com"
          required
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
          suffix={
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-subtle hover:text-fg transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          placeholder="Enter your password"
          required
        />

        <div>
          <label className="block text-sm font-medium text-fg mb-1.5">Sign in as</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={cn(
                  'text-left px-3 py-2.5 rounded-xl border transition-all',
                  role === r.value
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-border text-muted hover:border-border hover:bg-surface-2',
                )}
              >
                <p className="text-sm font-medium">{r.label}</p>
                <p className="text-xs opacity-70">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full" icon={!loading ? <ArrowRight size={18} /> : undefined}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-subtle">or continue with</span></div>
        </div>
        <button onClick={handleGoogle} disabled={loading} className="mt-4 w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-fg hover:bg-surface-2 transition-colors disabled:opacity-50 disabled:pointer-events-none">
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
}
