import { useState } from 'preact/compat';
import { cn } from '@/lib/utils';
import { useConfigStoreShallow } from '../store';
import { X, Check } from 'lucide-react';
import { useTextOnAccent } from '@/hooks/use-accent-colors';
import { Drawer } from './drawer';
import { Input } from '@/components/ui/input';

interface LeadCollectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

export const LeadCollectionDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: LeadCollectionDrawerProps) => {
  const [email, setEmail] = useState('');
  const [hasConsented, setHasConsented] = useState(false);

  const { accentColor } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  const textOnAccent = useTextOnAccent(accentColor);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = email.trim() && validateEmail(email) && hasConsented;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit(email);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} className="mx-auto w-[calc(100%-8px)]">
      <div className="relative p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-md p-1 transition-colors hover:bg-gray-100 focus:ring-0 focus:outline-none"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Content */}
        <div className="space-y-10">
          {/* Header */}
          <h2 className="text-xl font-bold text-neutral-900">
            Leave your email address <br /> so we can get back to you
          </h2>

          {/* Form */}
          <div className="space-y-6">
            {/* Email input */}
            <div>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail((e.target as HTMLInputElement).value)}
                placeholder="Your email address"
                className="h-11 w-full rounded-xl border-none bg-neutral-100 px-4"
                disabled={isSubmitting}
              />
            </div>

            {/* Consent checkbox */}
            <div
              className="flex items-start gap-3"
              style={
                {
                  '--accent-color': accentColor,
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                onClick={() => setHasConsented(!hasConsented)}
                className={cn(
                  'flex size-4 flex-shrink-0 translate-y-0.5 items-center justify-center rounded-sm border-1 border-neutral-400 transition-all duration-200',
                  hasConsented && `border-[var(--accent-color)] bg-[var(--accent-color)]`
                )}
                disabled={isSubmitting}
              >
                {hasConsented && (
                  <Check
                    className="animate-in zoom-in-50 h-3 w-3 stroke-[2.5] duration-150"
                    style={{ color: textOnAccent.color }}
                  />
                )}
              </button>
              <label
                className="cursor-pointer text-xs font-normal text-neutral-800 select-none"
                onClick={e => {
                  // Don't toggle if clicking on the link
                  const target = e.target as HTMLElement;
                  if (target.tagName !== 'A') {
                    setHasConsented(!hasConsented);
                  }
                }}
              >
                I consent to the processing of my personal data for the purpose of being contacted
                by Heyway. See our{' '}
                <a
                  href="https://heyway.chat/privacy-policy/"
                  className="text-neutral-800 underline transition-colors hover:text-neutral-600"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid}
            className={cn(
              'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
              'disabled:cursor-not-allowed disabled:!bg-neutral-200 disabled:!text-neutral-500'
            )}
            style={{
              backgroundColor: accentColor,
              color: textOnAccent.color,
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </Drawer>
  );
};
