import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  // Legal
  legalName?: string;
  businessAddress?: string;
  taxId?: string;
  // Branding
  jobTitle?: string;
  brandLogo?: string;
  brandColor?: string;
  // Payments
  defaultCurrency?: 'INR' | 'USD';
  paymentInstructions?: string;
  // Signature
  savedSignature?: string; // Data URL
  // Notifications
  notifyOnView?: boolean;
  notifyOnSign?: boolean;
  // Billing
  plan?: 'free' | 'single' | 'standard' | 'agency';
  credits?: number; // Extra credits purchased
  
  // Usage tracking
  lifetimeCount?: number; // Total docs created ever (for non-monthly plans)

  // Subscription Details
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | 'incomplete';
  subscriptionId?: string;
  currentPeriodStart?: any; // Firestore Timestamp
  currentPeriodEnd?: any;   // Firestore Timestamp
  
  createdAt: Date;
  updatedAt: Date;
}

const USERS_COLLECTION = 'users';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, updateData);
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function syncUserToFirestore(uid: string, data: { email: string; displayName?: string; photoURL?: string }): Promise<void> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    const now = new Date();

    if (!docSnap.exists()) {
      // New User
      const newProfile: UserProfile = {
        uid,
        email: data.email,
        displayName: data.displayName || data.email.split('@')[0],
        brandLogo: data.photoURL || '',
        plan: 'free',
        credits: 0,
        lifetimeCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(docRef, newProfile);
      console.log(`[user.ts] Created new profile for ${uid}`);
    } else {
      // Existing User - Update basic info if changed
      await updateDoc(docRef, {
        email: data.email,
        displayName: data.displayName || docSnap.data().displayName,
        updatedAt: now,
      });
      console.log(`[user.ts] Updated profile for ${uid}`);
    }
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
    // Don't throw, we don't want to block login/signup if DB sync fails
  }
}

export async function incrementUserContractCount(uid: string): Promise<void> {
    try {
        const docRef = doc(db, USERS_COLLECTION, uid);
        await updateDoc(docRef, {
            lifetimeCount: increment(1),
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error("Error incrementing contract count:", error);
    }
}
