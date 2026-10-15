import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

/**
 * Toplantı Merkezi Firebase Yapılandırması
 * Ortam değişkenlerinden (VITE_FIREBASE_*) yüklenir.
 * Kaynak kodda sabit API anahtarı veya sahte yedek anahtar tutulmaz.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

let app = null;
let db = null;
let auth = null;
let isFirebaseInitialized = false;
let initializationError = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseInitialized = true;
  } else {
    initializationError = 'Firebase ortam değişkenleri (VITE_FIREBASE_*) eksik.';
  }
} catch (error) {
  initializationError = error?.message || 'Firebase başlatma hatası';
}

/**
 * Gerçek Firestore sunucu bağlantı kontrolü (önbelleği atlayarak doğrudan sunucudan okur)
 */
export async function verifyFirestoreConnection() {
  if (!isFirebaseInitialized || !db) {
    return {
      connected: false,
      latencyMs: null,
      checkedAt: new Date().toISOString(),
      error: initializationError || 'Firebase başlatılamadı.'
    };
  }
  const start = performance.now();
  try {
    await getDocFromServer(doc(db, 'settings', 'general_config'));
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: true,
      latencyMs,
      checkedAt: new Date().toISOString(),
      error: null
    };
  } catch (err) {
    return {
      connected: false,
      latencyMs: null,
      checkedAt: new Date().toISOString(),
      error: err?.code ? `${err.code}: ${err.message}` : (err?.message || 'Sunucuya ulaşılamadı')
    };
  }
}

export {
  app,
  db,
  auth,
  isFirebaseInitialized,
  initializationError,
  // Firestore Helpers
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  // Auth Helpers
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
};
