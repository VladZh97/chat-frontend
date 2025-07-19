import signupImage from '@/assets/signup.jpg';
import Logo from '@/assets/logo-light.svg';
import AuthForm from './auth-form';
import { useNavigate } from 'react-router-dom';
import { useLinkAuth } from '@/hooks';

const Auth = ({ login }: { login?: boolean }) => {
  const navigate = useNavigate();
  const { isLinkAuthLoading } = useLinkAuth();
  return (
    <div className="grid min-h-screen w-screen grid-cols-2 bg-neutral-50">
      <div className="relative flex h-full flex-col items-center justify-between p-10">
        <div className="relative z-10 mx-auto w-full max-w-[586px]">
          <a href="/">
            <img src={Logo} alt="Logo" className="h-auto w-[121px]" width="121" height="26" />
          </a>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[586px]">
          <p className="mb-2 text-lg text-white">
            Heyway.chat has completely transformed how we handle support. It’s like having an extra
            team member working 24/7 — fast, reliable, and always on point.
          </p>
          <span className="text-sm text-white">Jordan Lee</span>
        </div>
        <div className="absolute inset-0 size-full">
          <img src={signupImage} alt="Signup illustration" className="size-full object-cover" />
          <span
            className="absolute inset-0 size-full"
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.90) 100%)',
            }}
          ></span>
        </div>
      </div>
      <div className="relative grid place-items-center p-10">
        <div className="absolute top-10 left-1/2 mx-auto flex w-full max-w-[586px] -translate-x-1/2 items-center justify-end">
          <a
            onClick={() => {
              navigate(login ? '/signup' : '/login');
            }}
            className="cursor-pointer px-4 py-2 text-sm text-neutral-950 transition-opacity hover:opacity-70"
          >
            {login ? 'Sign up' : 'Login'}
          </a>
        </div>
        <AuthForm isLinkAuthLoading={isLinkAuthLoading} login={login} />
      </div>
    </div>
  );
};

export default Auth;
