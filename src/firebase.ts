import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  getDocFromServer
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWKuuayRYLIZgV1gu_i509nKq5LUCuSy4",
  authDomain: "coolcottage-77b83.firebaseapp.com",
  projectId: "coolcottage-77b83",
  storageBucket: "coolcottage-77b83.firebasestorage.app",
  messagingSenderId: "1089094249108",
  appId: "1:1089094249108:web:dd89a59b16207bae662281",
  measurementId: "G-4NSEGDHSKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Error conversion guidelines implementation
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error Payload: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Synchronous and initial connectivity check
async function testConnection() {
  try {
    // Attempt block check
    await getDocFromServer(doc(db, 'system_test', 'connectivity'));
    console.log("Firebase Connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}
testConnection();

// Auto-seed admin credentials "coolcootage" & "coolcottage" with password "12345"
export async function seedAdminCredentials() {
  const pathForWrite = 'admins';
  try {
    const adminRef1 = doc(db, pathForWrite, 'coolcootage');
    const doc1 = await getDoc(adminRef1);
    if (!doc1.exists()) {
      await setDoc(adminRef1, {
        username: "coolcootage",
        password: "12345",
        createdAt: new Date().toISOString()
      });
      console.log("Admin account (coolcootage) seeded successfully in Firestore.");
    }

    const adminRef2 = doc(db, pathForWrite, 'coolcottage');
    const doc2 = await getDoc(adminRef2);
    if (!doc2.exists()) {
      await setDoc(adminRef2, {
        username: "coolcottage",
        password: "12345",
        createdAt: new Date().toISOString()
      });
      console.log("Admin account (coolcottage) seeded successfully in Firestore.");
    }
  } catch (error) {
    console.error("Seeding error (this is safe if rules prevent unauthenticated seed writes):", error);
  }
}
// Run seeding instantly
seedAdminCredentials();
