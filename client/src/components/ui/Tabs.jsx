import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Tabs = ({
  tabs = [],
  defaultTab = 0,
  onChange = null,
  variant = 'default',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  const variantStyles = {
    default: {
      button: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100',
      activeButton: 'text-blue-600 dark:text-blue-400 font-semibold',
      indicator: 'bg-blue-600 dark:bg-blue-400',
    },
    pills: {
      button: 'text-slate-600 dark:text-slate-400',
      activeButton: 'text-white bg-blue-600 dark:bg-blue-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={clsx(
              'px-4 py-3 text-sm font-medium transition-colors relative',
              activeTab === index ? styles.activeButton : styles.button
            )}
          >
            {tab.label}
            {activeTab === index && variant === 'default' && (
              <motion.div
                className={clsx('absolute bottom-0 left-0 right-0 h-0.5', styles.indicator)}
                layoutId="activeTab"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4"
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
