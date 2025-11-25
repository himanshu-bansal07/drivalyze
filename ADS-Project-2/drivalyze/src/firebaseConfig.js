// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-DdwRy4Eq5dADJCh1aFNiSz-jQDUWFlc",
  authDomain: "drivalyze-74273.firebaseapp.com",
  projectId: "drivalyze-74273",
  storageBucket: "drivalyze-74273.firebasestorage.app",
  messagingSenderId: "799171169347",
  appId: "1:799171169347:web:000715a647bab7feef18f6",
  measurementId: "G-88M487NRFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export the services
// eslint-disable-next-line import/no-anonymous-default-export
export { app, auth, db, storage, analytics };