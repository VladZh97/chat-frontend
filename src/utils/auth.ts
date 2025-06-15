import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/auth';

/**
 * Checks if a user is currently logged in
 * @returns boolean indicating if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Get the ID token to check for custom claims
    const token = await user.getIdTokenResult();
    // Check if the user has an accountId claim
    // return token.claims.accountId !== undefined;
    return !!token;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Signs in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Promise resolving to the User object
 */
export const loginWithEmailPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Signs in a user with email and password
 * @param email User's email
 * @returns void
 */
export const loginWithEmailLink = async (email: string): Promise<void> => {
  const allowedPaths = ['/login', '/signup'];
  const path = allowedPaths.includes(window.location.pathname)
    ? window.location.pathname
    : '/login';
  try {
    const actionCodeSettings = {
      url: window.location.origin + path,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Creates a new user with email and password
 * @param email User's email
 * @param password User's password
 * @returns Promise resolving to the User object
 */
export const signupWithEmailPassword = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Signs in a user with Google
 * @returns Promise resolving to the User object
 */
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

/**
 * Refreshes the authentication token for the current user
 * @returns Promise resolving to an object with the refreshed token and claims, or null if no user is logged in
 */
export const refreshAuthToken = async (): Promise<{
  token: string;
  claims: any;
} | null> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log('No user is currently logged in');
      return null;
    }

    // Force token refresh
    const token = await currentUser.getIdToken(true);

    // Retrieve the claims
    const decodedToken = await currentUser.getIdTokenResult();
    const claims = decodedToken.claims;

    return { token, claims };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const getCustomClaims = async (): Promise<any> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return {};
  const token = await currentUser.getIdTokenResult();
  return token.claims;
};
