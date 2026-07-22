import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Skeleton = ({ variant = 'text', width = 'w-full', height = 'h-4', className = '' }) => {
  const variants = {
    text: 'rounded',
    avatar: 'rounded-full',
    card: 'rounded-lg',
    button: 'rounded-lg',
  };

  return (
    <motion.div
      className={clsx(
        'bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700',
        variants[variant],
        width,
        height,
        className
      )}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ backgroundSize: '200% 100%' }}
    />
  );
};

export default Skeleton;
