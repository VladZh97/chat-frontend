import { motion } from 'motion/react';
import { createPortal } from 'preact/compat';

const SmallScreenOverlay = () => {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] grid place-items-center bg-stone-900/95 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="mx-4 max-w-md rounded-2xl bg-white p-8 text-center shadow-md dark:bg-stone-800 dark:outline-gray-300"
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-stone-600 dark:text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-xl font-semibold text-stone-900 dark:text-white">
          Large Screen Required
        </h2>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-400">
          For the best experience, please access this application on a larger screen with a minimum
          width of 1200px.
        </p>
        <div className="text-xs text-stone-500 dark:text-stone-500">
          Current screen size is too small for optimal viewing
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default SmallScreenOverlay;
