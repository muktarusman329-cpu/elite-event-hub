import { motion } from 'framer-motion';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <motion.div
      className={`border-3 border-slate-200 dark:border-slate-700 border-t-blue-600 rounded-full ${sizes[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, easing: 'linear' }}
    />
  );
};

export default Spinner;
