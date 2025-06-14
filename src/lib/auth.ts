// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDOV3G563pGb9Njn5nZpn4lIkhkA40Z6oo',
  authDomain: 'chat-ea80f.firebaseapp.com',
  projectId: 'chat-ea80f',
  storageBucket: 'chat-ea80f.firebasestorage.app',
  messagingSenderId: '828639820308',
  appId: '1:828639820308:web:7522f8edc94c8d0d548501',
  measurementId: 'G-62PV6XCNKX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
