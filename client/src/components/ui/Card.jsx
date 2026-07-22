import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const Card = forwardRef(
  (
    {
      className = '',
      children = null,
      variant = 'default',
      interactive = false,
      header = null,
      footer = null,
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md',
      elevated:
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg',
      glass:
        'bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl',
      outline:
        'bg-transparent border-2 border-slate-300 dark:border-slate-600',
    };

    return (
      <motion.div
        ref={ref}
        className={clsx(
          'rounded-xl overflow-hidden transition-all duration-200',
          variants[variant],
          interactive && 'cursor-pointer',
          className
        )}
        whileHover={interactive ? { scale: 1.02 } : {}}
        whileTap={interactive ? { scale: 0.98 } : {}}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            {header}
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
