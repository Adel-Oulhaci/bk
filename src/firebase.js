import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBN9Mitu2uUbYscNE0hNHXHDLODlEXdzYQ",
  authDomain: "bkweb-630de.firebaseapp.com",
  projectId: "bkweb-630de",
  storageBucket: "bkweb-630de.firebasestorage.app",
  messagingSenderId: "439322467395",
  appId: "1:439322467395:web:c3b04eae424c525ab648f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Utility function for image conversion
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Export the app instance as well
export default app;
