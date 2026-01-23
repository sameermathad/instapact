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
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Contract, ContractMeta, TemplateType, AuditTrail } from '@/types';
import { generateShortId, getExpirationDate } from './utils';

const CONTRACTS_COLLECTION = 'contracts';

// Create a new contract
export async function createContract(
  creatorId: string,
  creatorName: string,
  creatorEmail: string,
  template: TemplateType,
  meta: ContractMeta
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
  };

  // Convert dates to Firestore Timestamps
  const firestoreData = {
    ...contract,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(contract.expiresAt),
  };

  try {
    await setDoc(doc(db, CONTRACTS_COLLECTION, contractId), firestoreData);
    console.log(`[contracts.ts] Contract ${contractId} created successfully`)
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

// Get all contracts for a creator
export async function getCreatorContracts(creatorId: string): Promise<Contract[]> {
  console.log(`[contracts.ts] Fetching contracts for ${creatorId}`)
  const q = query(
    collection(db, CONTRACTS_COLLECTION),
    where('creatorId', '==', creatorId),
    orderBy('createdAt', 'desc')
  );

  try {
    const querySnapshot = await getDocs(q);
    console.log(`[contracts.ts] Found ${querySnapshot.size} contracts`)
    
    const contracts: Contract[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
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

    return contracts;
  } catch (e) {
    console.error(`[contracts.ts] Failed to fetch contracts for ${creatorId}`, e)
    throw e
  }
}

// Sign a contract
export async function signContract(
  contractId: string,
  signerName: string,
  signerEmail: string,
  signerIp: string,
  userAgent: string
): Promise<boolean> {
  try {
    const docRef = doc(db, CONTRACTS_COLLECTION, contractId);

    const auditTrail: AuditTrail = {
      signedAt: new Date(),
      signerIp,
      signerEmail,
      signerName,
      userAgent,
    };

    await updateDoc(docRef, {
      status: 'signed',
      auditTrail: {
        ...auditTrail,
        signedAt: Timestamp.fromDate(auditTrail.signedAt),
      },
    });

    return true;
  } catch (error) {
    console.error('Error signing contract:', error);
    return false;
  }
}

// Check if a contract exists
export async function contractExists(contractId: string): Promise<boolean> {
  const docRef = doc(db, CONTRACTS_COLLECTION, contractId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}
