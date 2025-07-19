import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';

const Counter = ({ value = 0, className }: { value: number; className?: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: 'easeOut' });
    return () => controls.stop();
  }, [value]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default Counter;
