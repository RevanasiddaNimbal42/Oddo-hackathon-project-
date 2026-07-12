import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout, AuthShowcase } from '../../components/auth/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 600);
  };

  return (
    <AuthLayout
      side={
        <AuthShowcase
          title="Reset your password"
          subtitle="We'll send you a secure link to get back into your account in no time."
          stats={[
            { label: 'Reset link', value: '< 1 min' },
            { label: 'Security', value: '256-bit' },
            { label: 'Support', value: '24/7' },
            { label: 'Success rate', value: '100%' },
          ]}
        />
      }
    >
      {sent ? (
        <div className="text-center">
          <span className="inline-flex h-14 w-14 rounded-2xl bg-success-soft items-center justify-center mb-4">
            <CheckCircle2 size={28} className="text-success" />
          </span>
          <h1 className="text-2xl font-bold text-fg tracking-tight">Check your inbox</h1>
          <p className="text-sm text-muted mt-2">
            We've sent a password reset link to<br />
            <span className="font-medium text-fg">{email}</span>
          </p>
          <p className="text-xs text-subtle mt-4">Didn't receive it? Check your spam folder or try again in a minute.</p>
          <Link to="/login">
            <Button variant="outline" className="mt-6 w-full" icon={<ArrowLeft size={16} />}>Back to sign in</Button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-fg tracking-tight">Forgot password?</h1>
          <p className="text-sm text-muted mt-1.5">No worries — enter your email and we'll send a reset link.</p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Input label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} placeholder="you@company.com" required />
            <Button type="submit" size="lg" loading={loading} className="w-full" icon={!loading ? <ArrowRight size={18} /> : undefined}>
              {loading ? 'Sending link...' : 'Send reset link'}
            </Button>
          </form>
          <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted hover:text-fg transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </>
      )}
    </AuthLayout>
  );
}
