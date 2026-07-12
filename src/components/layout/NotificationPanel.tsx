import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { timeAgo } from '../../utils';

const config = {
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success-soft' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning-soft' },
  error: { icon: XCircle, color: 'text-danger', bg: 'bg-danger-soft' },
  info: { icon: Info, color: 'text-info', bg: 'bg-info-soft' },
};

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-surface border-l border-border shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-fg">Notifications</h2>
                <p className="text-xs text-muted">{notifications.filter((n) => !n.read).length} unread</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-primary hover:underline px-2 py-1 rounded-lg hover:bg-primary-soft transition-colors"
                >
                  Mark all read
                </button>
                <button onClick={onClose} className="text-subtle hover:text-fg p-1 rounded-lg hover:bg-surface-2">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <span className="h-12 w-12 rounded-2xl bg-surface-2 flex items-center justify-center mb-3">
                    <Info size={20} className="text-subtle" />
                  </span>
                  <p className="text-sm text-muted">No notifications</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const c = config[n.type];
                  const Icon = c.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full text-left flex gap-3 px-5 py-4 border-b border-border-soft hover:bg-surface-2 transition-colors ${!n.read && 'bg-primary-soft/30'}`}
                    >
                      <span className={`h-9 w-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={c.color} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-fg">{n.title}</p>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{n.message}</p>
                        <p className="text-xs text-subtle mt-1">{timeAgo(n.timestamp)}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
