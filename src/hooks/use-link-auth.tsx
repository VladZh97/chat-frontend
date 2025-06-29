import account from '@/api/account';
import auth from '@/api/auth';
import user from '@/api/user';
import { getCustomClaims, isLoggedIn, refreshAuthToken } from '@/utils/auth';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

const useLinkAuth = () => {
  const authFirebase = getAuth();
  const navigate = useNavigate();
  const [isLinkAuthLoading, setIsLinkAuthLoading] = useState(false);

  const handleLinkAuth = useCallback(async () => {
    // Early return if not a sign-in link
    if (!isSignInWithEmailLink(authFirebase, window.location.href)) return;

    // Redirect if already logged in
    if (await isLoggedIn()) {
      navigate('/');
      return;
    }

    setIsLinkAuthLoading(true);
    // Get email from storage or prompt
    const email =
      window.localStorage.getItem('emailForSignIn') ||
      window.prompt('Please provide your email for confirmation');

    if (!email) return;

    try {
      await signInWithEmailLink(authFirebase, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      const claims = await getCustomClaims();
      if (!claims.accountId) {
        await auth.create();
        await refreshAuthToken();
      } else {
        await Promise.all([account.get(), user.get()]);
      }
      navigate('/');
    } catch (error) {
      console.error('Link authentication failed:', error);
      navigate('/login');
    } finally {
      setIsLinkAuthLoading(false);
    }
  }, [auth, navigate]);

  useEffect(() => {
    handleLinkAuth();
  }, [handleLinkAuth]);

  return { isLinkAuthLoading };
};

export default useLinkAuth;
