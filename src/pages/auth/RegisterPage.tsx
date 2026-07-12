import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
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

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('Fleet Manager');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = password === confirm;
  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      login('google.user@transitops.com', role, 'Google User');
      navigate('/');
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) return setError('Please fill in all fields.');
    if (!passwordsMatch) return setError('Passwords do not match.');
    if (!agree) return setError('Please accept the terms to continue.');
    setLoading(true);
    setTimeout(() => {
      login(email, role, name);
      navigate('/');
    }, 600);
  };

  return (
    <AuthLayout
      side={
        <AuthShowcase
          title="Join the smart fleet revolution"
          subtitle="Get full visibility into your transport operations. Sign up in seconds — no credit card required."
          stats={[
            { label: 'Setup time', value: '< 5 min' },
            { label: 'Free trial', value: '30 days' },
            { label: 'Support', value: '24/7' },
            { label: 'Teams', value: '1,200+' },
          ]}
        />
      }
    >
      <h1 className="text-2xl font-bold text-fg tracking-tight">Create your account</h1>
      <p className="text-sm text-muted mt-1.5">Start managing your fleet smarter today</p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Input label="Full name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={16} />} placeholder="John Doe" required />
        <Input label="Work email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} placeholder="you@company.com" required />
        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            suffix={<button type="button" onClick={() => setShowPassword((v) => !v)} className="text-subtle hover:text-fg transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
            placeholder="At least 8 characters"
            required
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className={cn('h-full transition-all', passwordStrength === 'weak' ? 'w-1/3 bg-danger' : passwordStrength === 'medium' ? 'w-2/3 bg-warning' : 'w-full bg-success')} />
              </div>
              <span className="text-xs text-muted capitalize">{passwordStrength}</span>
            </div>
          )}
        </div>
        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          name="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          icon={<Lock size={16} />}
          placeholder="Re-enter password"
          error={confirm && !passwordsMatch ? 'Passwords do not match' : undefined}
          required
        />

        <div>
          <label className="block text-sm font-medium text-fg mb-1.5">Select your role</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)} className={cn('text-left px-3 py-2.5 rounded-xl border transition-all flex items-center gap-2', role === r.value ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:bg-surface-2')}>
                {role === r.value && <Check size={14} />}
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs opacity-70">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-muted cursor-pointer select-none">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="rounded border-border text-primary focus:ring-primary/20 mt-0.5" />
          I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>
        </label>

        {error && <p className="text-sm text-danger bg-danger-soft px-3 py-2 rounded-lg">{error}</p>}

        <Button type="submit" size="lg" loading={loading} className="w-full" icon={!loading ? <ArrowRight size={18} /> : undefined}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-subtle">or sign up with</span></div>
        </div>
        <button onClick={handleGoogle} disabled={loading} className="mt-4 w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-fg hover:bg-surface-2 transition-colors disabled:opacity-50 disabled:pointer-events-none">
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading ? 'Creating account...' : 'Sign up with Google'}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
