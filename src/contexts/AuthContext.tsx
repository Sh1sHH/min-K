import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Send verification email right after sign up
      if (result.user) {
        await sendEmailVerification(result.user);
      }
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (currentUser && !currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Token'ı al ve custom claims'i kontrol et
      const idTokenResult = await user.getIdTokenResult();
      setIsAdmin(!!idTokenResult.claims.admin || !!idTokenResult.claims.superAdmin);
      setIsPremium(!!idTokenResult.claims.premium);

      // Google kullanıcı bilgilerini Firestore'a kaydet
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerData: user.providerData,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true }); // merge: true ile mevcut verileri koruyoruz
      
    } catch (error) {
      console.error('Google ile giriş hatası:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Kullanıcı oturum açtığında custom claims'i kontrol et
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin || !!idTokenResult.claims.superAdmin);
        setIsPremium(!!idTokenResult.claims.premium);
      } else {
        setIsAdmin(false);
        setIsPremium(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    isAdmin,
    isPremium,
    signUp,
    login,
    logout,
    googleSignIn,
    resetPassword,
    sendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 