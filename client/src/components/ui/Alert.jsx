import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({
  variant = 'info',
  title = '',
  message = '',
  onClose = null,
  className = '',
}) => {
  const variantStyles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-200',
      message: 'text-blue-800 dark:text-blue-300',
      Icon: Info,
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-200',
      message: 'text-green-800 dark:text-green-300',
      Icon: CheckCircle2,
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-900 dark:text-yellow-200',
      message: 'text-yellow-800 dark:text-yellow-300',
      Icon: AlertTriangle,
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-900 dark:text-red-200',
      message: 'text-red-800 dark:text-red-300',
      Icon: AlertCircle,
    },
  };

  const styles = variantStyles[variant];
  const { Icon } = styles;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={clsx(
          'flex gap-3 p-4 rounded-lg',
          styles.container,
          className
        )}
      >
        <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', styles.icon)} />
        <div className="flex-1">
          {title && <p className={clsx('font-semibold', styles.title)}>{title}</p>}
          {message && <p className={clsx('text-sm', styles.message)}>{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
