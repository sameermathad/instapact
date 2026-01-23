import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
  credits?: number;
  
  // Subscription Details
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | 'incomplete';
  subscriptionId?: string;
  currentPeriodStart?: any; // Firestore Timestamp
  currentPeriodEnd?: any;   // Firestore Timestamp
  
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
