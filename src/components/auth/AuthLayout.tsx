import { type ReactNode } from 'react';
import { Truck } from 'lucide-react';

export function AuthLayout({ children, side }: { children: ReactNode; side: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left: form */}
      <div className="flex-1 flex flex-col px-6 py-8 sm:px-12 lg:px-16 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Truck size={22} className="text-primary-fg" />
          </span>
          <span className="font-bold text-xl text-fg tracking-tight">
            Transit<span className="text-primary">Ops</span>
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-subtle text-center">© 2024 TransitOps. Smart Transport Operations.</p>
      </div>
      {/* Right: showcase */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {side}
      </div>
    </div>
  );
}

export function AuthShowcase({ title, subtitle, stats }: { title: string; subtitle: string; stats: { label: string; value: string }[] }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent flex flex-col justify-between p-12 text-white">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative" />
      <div className="relative">
        <h2 className="text-3xl font-bold leading-tight">{title}</h2>
        <p className="text-white/80 mt-3 max-w-md">{subtitle}</p>
        <div className="grid grid-cols-2 gap-4 mt-10 max-w-md">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-white/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
