import Icon from '@/assets/icon.svg';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Mail } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getCustomClaims,
  loginWithEmailLink,
  loginWithGoogle,
  refreshAuthToken,
} from '@/utils/auth';
import { toast } from 'sonner';
import { useState } from 'preact/compat';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import auth from '@/api/auth';

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
});
const AuthForm = ({
  isLinkAuthLoading,
  login,
}: {
  isLinkAuthLoading: boolean;
  login?: boolean;
}) => {
  const navigate = useNavigate();
  const [type, setType] = useState<'email' | 'google'>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (type || isLinkAuthLoading) return;
    setType('email');
    try {
      await loginWithEmailLink(values.email);
      window.localStorage.setItem('emailForSignIn', values.email);
      form.reset();
      toast('Check your email for a link to sign in.');
    } catch (error) {
      console.error(error);
    } finally {
      setType(undefined);
    }
  };

  const handleLoginWithGoogle = async () => {
    if (type || isLinkAuthLoading) return;
    setType('google');
    try {
      await loginWithGoogle();
      const claims = await getCustomClaims();
      if (!claims.accountId) {
        await auth.create();
        await refreshAuthToken();
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to login with Google');
    } finally {
      setType(undefined);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col items-center">
      <img src={Icon} alt="icon" className="mb-6 size-8" width="32" height="32" />
      <h1 className="mb-2 text-2xl font-semibold text-neutral-950">
        {login ? 'Login to your account' : 'Create an account'}
      </h1>
      <p className="mb-6 text-sm text-neutral-500">
        {login
          ? 'Enter your email below to login to your account'
          : 'Enter your email below to create your account'}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormControl>
                  <Input placeholder="name@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={cn('w-full cursor-pointer', type === 'email' && 'cursor-default')}
          >
            {type === 'email' || isLinkAuthLoading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Mail />
            )}
            {login ? 'Sign In with Email' : 'Sign Up with Email'}
          </Button>
        </form>
      </Form>
      <span className="relative flex w-full items-center justify-center gap-2 py-6">
        <span className="relative z-10 bg-neutral-50 px-3 text-sm text-neutral-500 uppercase">
          OR CONTINUE WITH
        </span>
        <span className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-neutral-200"></span>
      </span>
      <Button
        variant="secondary"
        className="mb-6 w-full cursor-pointer border border-neutral-200 bg-white"
        onClick={handleLoginWithGoogle}
      >
        {type === 'google' ? (
          <>
            <LoaderCircle className="animate-spin" />
            Loading...
          </>
        ) : (
          'Continue with Google'
        )}
      </Button>
      <p className="text-center text-sm text-neutral-500">
        By clicking continue, you agree to our <br />{' '}
        <a href="" className="underline transition-opacity hover:opacity-70">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="" className="underline transition-opacity hover:opacity-70">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default AuthForm;
