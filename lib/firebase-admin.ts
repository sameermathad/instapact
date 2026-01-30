import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DB_ID || 
  (process.env.NODE_ENV === 'production' ? 'instapact-prod' : '(default)');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    console.log(`[firebase-admin] Initialized successfully (DB: ${databaseId})`);
  } catch (error) {
    console.error('[firebase-admin] Initialization error:', error);
  }
}

const app = admin.app();

export const adminDb = databaseId === '(default)' 
  ? getFirestore(app) 
  : getFirestore(app, databaseId);
export const adminStorage = getStorage(app);
export const adminAuth = getAuth(app);

export default admin;
