import { useEffect, useRef, useState } from 'preact/hooks';
import { cn } from '@/lib/utils';

type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

interface DrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
}

export const Drawer = ({
  isOpen,
  onClose,
  children,
  className,
  backdrop = true,
  closeOnBackdropClick = true,
}: DrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<AnimationState>('exited');
  const timeoutRef = useRef<number>();

  // Handle backdrop click
  const handleBackdropClick = (e: Event) => {
    if (closeOnBackdropClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Animation state management
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isOpen) {
      // Opening sequence
      setAnimationState('entering');
      timeoutRef.current = window.setTimeout(() => {
        setAnimationState('entered');
      }, 50); // Small delay to ensure entering state is applied
    } else if (animationState !== 'exited') {
      // Closing sequence
      setAnimationState('exiting');
      timeoutRef.current = window.setTimeout(() => {
        setAnimationState('exited');
      }, 250); // Exit animation duration
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (animationState === 'entered' && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [animationState]);

  // Don't render if completely closed
  if (animationState === 'exited') return null;

  const backdropOpacity = animationState === 'entered' ? 'opacity-100' : 'opacity-0';
  const contentTransform = animationState === 'entered' 
    ? 'transform translate-y-0 opacity-100' 
    : 'transform translate-y-full opacity-0';
  const contentDuration = animationState === 'exiting' ? 'transition-duration-250' : '';

  const backdropClasses = cn(
    'absolute inset-0 bg-neutral-50/80 transition-opacity duration-300 ease-out',
    backdropOpacity
  );

  const contentClasses = cn(
    'w-full bg-white transition-all duration-300 ease-out',
    'rounded-t-3xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_10px_10px_-5px_rgba(0,0,0,0.04),0px_0px_0px_1px_rgba(0,0,0,0.1)]',
    contentTransform,
    contentDuration,
    className
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Backdrop */}
      {backdrop && <div className={backdropClasses} onClick={handleBackdropClick} />}

      {/* Drawer Content */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div ref={drawerRef} className={contentClasses}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
