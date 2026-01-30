// Contract Firestore Operations
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Contract, ContractMeta, TemplateType, AuditTrail } from '@/types';
import { generateShortId, getExpirationDate } from './utils';
import { incrementUserContractCount } from './user';

const CONTRACTS_COLLECTION = 'contracts';

// Create a new contract
export async function createContract(
  creatorId: string,
  creatorName: string,
  creatorEmail: string,
  template: TemplateType,
  meta: ContractMeta,
  legalText?: string,
  branding?: { logo?: string; color?: string }
): Promise<Contract> {
  const contractId = generateShortId(6);
  const now = new Date();
  
  console.log(`[contracts.ts] Creating contract ${contractId} for ${creatorId}`)

  const contract: Contract = {
    id: contractId,
    creatorId,
    creatorName,
    creatorEmail,
    template,
    status: 'pending',
    meta,
    auditTrail: null,
    createdAt: now,
    expiresAt: getExpirationDate(now),
    legalText,
    creatorBranding: branding,
  };

  // Convert dates to Firestore Timestamps and filter out undefined
  const firestoreData: any = {
    ...contract,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(contract.expiresAt),
  };

  // Remove any undefined values as Firestore setDoc fails on them
  Object.keys(firestoreData).forEach(key => 
    firestoreData[key] === undefined && delete firestoreData[key]
  );

  try {
    await setDoc(doc(db, CONTRACTS_COLLECTION, contractId), firestoreData);
    console.log(`[contracts.ts] Contract ${contractId} created successfully`)
    
    // Increment User Usage Count (Fire & Forget)
    incrementUserContractCount(creatorId).catch(err => console.error("Failed to increment usage", err));

  } catch (e) {
    console.error(`[contracts.ts] Failed to create contract ${contractId}`, e)
    throw e
  }

  return contract;
}

// Get a contract by ID (public - for signing page)
export async function getContract(contractId: string): Promise<Contract | null> {
  const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: data.createdAt?.toDate() || new Date(),
    expiresAt: data.expiresAt?.toDate() || new Date(),
    auditTrail: data.auditTrail
      ? {
          ...data.auditTrail,
          signedAt: data.auditTrail.signedAt?.toDate() || new Date(),
        }
      : null,
  } as Contract;
}

// Note: In a production app, you'd add where('archived', '!=', true) and create an index.
// For MVP simplicity and to avoid index errors, we'll filter in memory.
export async function getCreatorContracts(creatorId: string, status: 'active' | 'archived' = 'active'): Promise<Contract[]> {
  console.log(`[contracts.ts] Fetching contracts for ${creatorId} (status: ${status})`)
  
  // Simplified query to avoid missing index errors in prod
  // Composite indexes are required for where + orderBy on different fields
  const q = query(
    collection(db, CONTRACTS_COLLECTION),
    where('creatorId', '==', creatorId)
  );

  try {
    const querySnapshot = await getDocs(q);
    console.log(`[contracts.ts] Found ${querySnapshot.size} total contracts in DB`);
    
    const contracts: Contract[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Filter in memory for archive status
      if (status === 'active' && data.archived) return;
      if (status === 'archived' && !data.archived) return;

      contracts.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate() || new Date(),
        auditTrail: data.auditTrail
          ? {
              ...data.auditTrail,
              signedAt: data.auditTrail.signedAt?.toDate() || new Date(),
            }
          : null,
      } as Contract);
    });

    // Sort in-memory instead of on Firestore to bypass missing index bottleneck
    return contracts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (e) {
    console.error(`[contracts.ts] Failed to fetch contracts for ${creatorId}`, e)
    throw e
  }
}

// Note: signContract moved to /api/sign-contract

// Get agreement count for a user, optionally filtered by date range
export async function getAgreementCount(creatorId: string, period?: { start: Date; end: Date }): Promise<number> {
  const q = query(
    collection(db, CONTRACTS_COLLECTION),
    where('creatorId', '==', creatorId)
  );

  try {
    const querySnapshot = await getDocs(q);
    let count = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.archived) return;

      if (period) {
        const createdAt = data.createdAt?.toDate();
        if (createdAt >= period.start && createdAt <= period.end) {
          count++;
        }
      } else {
        count++;
      }
    });
    return count;
  } catch (e) {
    console.error(`[contracts.ts] Failed to get agreement count for ${creatorId}`, e);
    return 0;
  }
}
// Check if a contract exists
export async function contractExists(contractId: string): Promise<boolean> {
  const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

// Delete a contract
export async function deleteContract(contractId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CONTRACTS_COLLECTION, contractId));
    console.log(`[contracts.ts] Contract ${contractId} deleted`);
  } catch (e) {
    console.error(`[contracts.ts] Failed to delete contract ${contractId}`, e);
    throw e;
  }
}

// Archive a contract (soft delete)
export async function archiveContract(contractId: string): Promise<void> {
  try {
    await updateDoc(doc(db, CONTRACTS_COLLECTION, contractId), { archived: true });
    console.log(`[contracts.ts] Contract ${contractId} archived`);
  } catch (e) {
    console.error(`[contracts.ts] Failed to archive contract ${contractId}`, e);
    throw e;
  }
}

// Unarchive a contract
export async function unarchiveContract(contractId: string): Promise<void> {
  try {
    await updateDoc(doc(db, CONTRACTS_COLLECTION, contractId), { archived: false });
    console.log(`[contracts.ts] Contract ${contractId} unarchived`);
  } catch (e) {
    console.error(`[contracts.ts] Failed to unarchive contract ${contractId}`, e);
    throw e;
  }
}
// Note: requestContractRevision moved to /api/request-revision

// Update a contract's metadata or legal text
export async function updateContractFields(
  contractId: string,
  meta: ContractMeta,
  legalText: string
): Promise<void> {
  try {
    const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
    await updateDoc(docRef, {
      meta,
      legalText,
      status: 'pending', // Reset status when creator updates
      clientFeedback: null, // Clear feedback
      updatedAt: Timestamp.now(),
    });
    console.log(`[contracts.ts] Contract ${contractId} updated successfully`);
  } catch (e) {
    console.error(`[contracts.ts] Failed to update contract ${contractId}`, e);
    throw e;
  }
}
