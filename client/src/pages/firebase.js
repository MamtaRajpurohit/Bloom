import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJv0WkSV-JXefMFt9OeZ5jfun_A-uKyTs",
  authDomain: "skill-barter-ed0b1.firebaseapp.com",
  projectId: "skill-barter-ed0b1",
  storageBucket: "skill-barter-ed0b1.firebasestorage.app",
  messagingSenderId: "793789029570",
  appId: "1:793789029570:web:8dd6e9dd35f7ca5038af5b",
  measurementId: "G-XP8F4TM30W",
  databaseURL: "https://skill-barter-ed0b1-default-rtdb.firebaseio.com", // Enable Realtime DB URL in Firebase console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const provider = new GoogleAuthProvider();

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Realtime Database for user status tracking
export const rtdb = getDatabase(app);
