import { type ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils';

interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode; content: ReactNode }[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <div className={className}>
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
              active === tab.id ? 'text-primary' : 'text-muted hover:text-fg',
            )}
          >
            {tab.icon}
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="pt-5"
        >
          {activeTab?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
