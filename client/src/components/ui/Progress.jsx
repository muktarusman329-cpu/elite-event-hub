import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Progress = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  className = '',
  showLabel = false,
}) => {
  const percentage = (value / max) * 100;

  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      <div className={clsx('w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={clsx('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
};

export default Progress;
