import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils';

interface StepperProps {
  steps: { id: string; label: string; icon?: ReactNode }[];
  current: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, current, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const isComplete = i < current;
        const isCurrent = i === current;
        const isClickable = i <= current && onStepClick;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={cn('flex items-center gap-2.5 group', isClickable && 'cursor-pointer')}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.05 : 1,
                  backgroundColor: isComplete || isCurrent ? 'rgb(var(--color-primary))' : 'rgb(var(--color-surface-2))',
                }}
                className={cn(
                  'h-9 w-9 rounded-xl flex items-center justify-center transition-colors border',
                  isComplete || isCurrent ? 'border-primary text-primary-fg' : 'border-border text-subtle',
                )}
              >
                {isComplete ? <Check size={16} /> : step.icon ?? <span className="text-sm font-semibold">{i + 1}</span>}
              </motion.div>
              <span className={cn('text-sm font-medium hidden sm:block', isCurrent ? 'text-fg' : isComplete ? 'text-muted' : 'text-subtle')}>
                {step.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-3 rounded-full bg-surface-2 overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: isComplete ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
