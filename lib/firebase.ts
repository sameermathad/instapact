// Firebase Configuration for InstaPact
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuild",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "instapact.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "instapact",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "instapact.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Determine Firestore database ID
// Default is '(default)' for dev, 'instapact-prod' for prod
const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DB_ID || 
  (process.env.NODE_ENV === 'production' ? 'instapact-prod' : '(default)');

// Firebase services
export const auth = getAuth(app);
export const db = databaseId === '(default)' ? getFirestore(app) : getFirestore(app, databaseId);

console.log(`[firebase.ts] Using Firestore database: ${databaseId}`);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
