import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const functions = getFunctions(app, 'europe-west1');

// Configure Storage with custom settings
const storage = getStorage(app);
const storageRef = ref(storage);

// Set custom metadata for all uploads
storageRef.constructor.prototype.customMetadata = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Cache-Control': 'public, max-age=31536000'
};

let analytics = null;

// Initialize Analytics only on client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, firestore, database, analytics, storage, functions }; 