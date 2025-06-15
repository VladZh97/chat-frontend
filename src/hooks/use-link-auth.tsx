import api from '@/api/api';
import { getCustomClaims, isLoggedIn, refreshAuthToken } from '@/utils/auth';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

const useLinkAuth = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLinkAuthLoading, setIsLinkAuthLoading] = useState(false);

  const handleLinkAuth = useCallback(async () => {
    // Early return if not a sign-in link
    if (!isSignInWithEmailLink(auth, window.location.href)) return;
    const claims = await getCustomClaims();
    if (!claims.accountId) {
      await api.post('/auth');
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
      await signInWithEmailLink(auth, email, window.location.href);
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
