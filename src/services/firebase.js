import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

/**
 * Toplantı Merkezi Firebase Yapılandırması
 * Ortam değişkenleri (VITE_FIREBASE_*) mevcutsa onları kullanır,
 * yoksa güvenli varsayılan proje kimliğiyle başlatır.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForInitialBuildCheckToplantiMerkezi",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "toplantimerkezi.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "adanahizlisatis",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "adanahizlisatis.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

// Uygulama tekilleştirme (Singleton instance)
let app;
let db = null;
let auth = null;
let isFirebaseInitialized = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseInitialized = true;
  console.log('[Firebase] Toplantı Merkezi Firebase servisi başarıyla başlatıldı.');
} catch (error) {
  console.warn('[Firebase] Başlatma uyarısı (Offline/Mock moda geçiliyor):', error);
}

export { 
  app, 
  db, 
  auth, 
  isFirebaseInitialized,
  // Firestore Helper exports
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  // Auth Helper exports
  signInWithEmailAndPassword, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged 
};
