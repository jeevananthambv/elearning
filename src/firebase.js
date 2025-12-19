// Firebase configuration for Faculty E-Content Website
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnP1X_R_Kstcvh4BT55ikpu5wFH1ziSEk",
    authDomain: "econtent-7d7d5.firebaseapp.com",
    projectId: "econtent-7d7d5",
    storageBucket: "econtent-7d7d5.firebasestorage.app",
    messagingSenderId: "789474158958",
    appId: "1:789474158958:web:c10ef3c266555db584f97f",
    measurementId: "G-TPVV2749S0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
