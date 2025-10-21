// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrSB3RGXGTgM_tKmdHrIbGMHAaJNyhkiw",
  authDomain: "calculadora-electronica.firebaseapp.com",
  projectId: "calculadora-electronica",
  storageBucket: "calculadora-electronica.firebasestorage.app",
  messagingSenderId: "378815449603",
  appId: "1:378815449603:web:a2f6a2d199680a63935c36"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;