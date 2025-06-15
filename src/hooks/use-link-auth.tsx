import auth from '@/api/auth';
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
    const claims = await getCustomClaims();
    if (!claims.accountId) {
      await auth.create();
      await refreshAuthToken();
    }

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
