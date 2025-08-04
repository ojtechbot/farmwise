
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// This variable will hold the initialized Firebase services.
// It's declared here to be accessible within this module.
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This function ensures Firebase is initialized only on the client-side.
const initializeFirebase = () => {
    if (typeof window !== 'undefined') {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApp();
        }
        auth = getAuth(app);
        db = getFirestore(app);
    }
};

// We call the initialization function right away. 
// The check `typeof window !== 'undefined'` ensures it only runs on the client.
initializeFirebase();

// We export the initialized services. 
// On the server, these will be undefined, preventing any Firebase calls.
export { app, auth, db };
