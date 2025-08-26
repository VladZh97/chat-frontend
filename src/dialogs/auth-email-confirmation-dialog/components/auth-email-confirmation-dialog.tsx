import Icon from '@/assets/icon.svg?react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useMemo } from 'preact/hooks';

const ID = 'auth-email-confirmation-dialog';

const AuthEmailConfirmationDialog = ({ onConfirm }: { onConfirm: (email: string) => void }) => {
  const [email, setEmail] = useState('');

  const isValidEmail = useMemo(() => {
    return email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const handleCreate = useCallback(() => {
    if (!isValidEmail) return;
    onConfirm(email);
  }, [email, onConfirm]);

  const handleEmailChange = useCallback((e: Event) => {
    setEmail((e.target as HTMLInputElement).value);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleCreate();
    },
    [handleCreate]
  );

  return (
    <div className="w-[448px]">
      <div className="p-6 pb-8">
        <Icon className="mb-4" />
        <p className="mb-[6px] cursor-pointer text-base font-semibold text-stone-900">
          Email confirmation
        </p>
        <p className="mb-9 text-sm text-stone-500">Please provide your email for confirmation</p>
        <div className="mb-6">
          <span className="mb-2 block text-sm font-medium text-stone-900">Email</span>
          <Input
            className="h-10"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div className="rounded-b-2xl border-t border-stone-200 bg-stone-50 p-6">
        <Button className="h-10 w-full" disabled={!isValidEmail} onClick={handleCreate}>
          Confirm email
        </Button>
      </div>
    </div>
  );
};

AuthEmailConfirmationDialog.id = ID;
export default AuthEmailConfirmationDialog;
