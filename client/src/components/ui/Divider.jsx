import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  className = '',
  label = '',
}) => {
  const variants = {
    solid: 'bg-slate-200 dark:bg-slate-700',
    dashed: 'border-t-2 border-dashed border-slate-200 dark:border-slate-700',
    dotted: 'border-t-2 border-dotted border-slate-200 dark:border-slate-700',
  };

  if (orientation === 'horizontal') {
    return label ? (
      <div className={clsx('flex items-center gap-3', className)}>
        <div className={clsx('flex-1 h-px', variants[variant])} />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2">
          {label}
        </span>
        <div className={clsx('flex-1 h-px', variants[variant])} />
      </div>
    ) : (
      <div className={clsx('h-px', variants[variant], className)} />
    );
  }

  return (
    <div className={clsx('w-px', variants[variant], className)} />
  );
};

export default Divider;
