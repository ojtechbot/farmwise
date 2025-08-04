
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebase } from '../lib/firebase';
import { Loader2, Leaf } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, userData: { [key: string]: any }) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth, db } = getFirebase();

  useEffect(() => {
    if (!auth || !db) {
      const checkFirebase = setInterval(() => {
        const { auth: updatedAuth } = getFirebase();
        if (updatedAuth) {
          setLoading(false); 
          clearInterval(checkFirebase);
        }
      }, 100);
      return () => clearInterval(checkFirebase);
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const enrichedUser = {
            ...user,
            ...userData,
            displayName: userData.displayName || user.displayName,
            photoURL: userData.photoURL || user.photoURL,
          };
          setUser(enrichedUser as User);
        } else {
           const displayName = user.displayName || 'New User';
           const photoURL = user.photoURL || '';
           await setDoc(userDocRef, {
             email: user.email,
             displayName: displayName,
             photoURL: photoURL,
           }, { merge: true });
           const newUserDoc = await getDoc(userDocRef);
           setUser({ ...user, ...newUserDoc.data() } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const signUpWithEmail = async (email: string, password: string, userData: { [key:string]: any }) => {
    if (!auth || !db) throw new Error("Firebase not initialized");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const displayName = `${userData.firstName} ${userData.lastName}`;
    
    await updateProfile(user, { displayName });

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    const userDoc = await getDoc(userDocRef);
    setUser({ ...user, ...userDoc.data() } as User);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth || !db) throw new Error("Firebase not initialized");
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }, { merge: true });
    }
  };

  const signOut = async () => {
    if (!auth) throw new Error("Firebase not initialized");
    await firebaseSignOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="relative flex items-center justify-center h-24 w-24">
          <Leaf className="h-12 w-12 text-primary animate-pulse" />
          <Loader2 className="absolute h-24 w-24 text-primary/20 animate-spin" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading FarmWise...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
