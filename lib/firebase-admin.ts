import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DB_ID || 
  (process.env.NODE_ENV === 'production' ? 'instapact-prod' : '(default)');

const projectID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

// Clean up private key (remove quotes and fix newlines)
if (privateKey) {
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  if (!projectID || !clientEmail || !privateKey) {
    console.error('[firebase-admin] Missing required environment variables for Admin SDK');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectID,
          clientEmail: clientEmail,
          privateKey: privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      console.log(`[firebase-admin] Initialized successfully (DB: ${databaseId})`);
    } catch (error) {
      console.error('[firebase-admin] Initialization error:', error);
    }
  }
}

// Safely get the app and its services
const getAdminApp = () => {
  if (admin.apps.length > 0) return admin.app();
  return null;
};

const app = getAdminApp();

export const adminDb = app 
  ? (databaseId === '(default)' ? getFirestore(app) : getFirestore(app, databaseId))
  : null as any;
export const adminStorage = app ? getStorage(app) : null as any;
export const adminAuth = app ? getAuth(app) : null as any;

export default admin;
