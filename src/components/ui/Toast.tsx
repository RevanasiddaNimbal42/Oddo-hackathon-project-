import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const config = {
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success-soft', border: 'border-success/30' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning-soft', border: 'border-warning/30' },
  error: { icon: XCircle, color: 'text-danger', bg: 'bg-danger-soft', border: 'border-danger/30' },
  info: { icon: Info, color: 'text-info', bg: 'bg-info-soft', border: 'border-info/30' },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useData();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const c = config[toast.type];
          const Icon = c.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-surface border ${c.border} shadow-lg`}
            >
              <span className={`flex-shrink-0 h-8 w-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <Icon size={16} className={c.color} />
              </span>
              <p className="text-sm text-fg flex-1 pt-1">{toast.message}</p>
              <button onClick={() => dismissToast(toast.id)} className="text-subtle hover:text-fg transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
