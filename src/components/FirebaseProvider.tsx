'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBaTFm4maWQ9QjgzNptJ_yatGS6rpgKtLM',
  authDomain: 'bunch-e4e24.firebaseapp.com',
  projectId: 'bunch-e4e24',
  storageBucket: 'bunch-e4e24.appspot.com',
  messagingSenderId: '436376815826',
  appId: '1:436376815826:web:7eb0267f32e6a33468850b',
  measurementId: 'G-H5BGDX05YY',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const FirebaseContext = createContext<null | {
  auth: Auth;
  analytics: Analytics | null;
}>({
  auth,
  analytics: null,
});

export function FirebaseProvider({ children }: PropsWithChildren) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  useEffect(() => {
    async function initAnalytics() {
      if (await isSupported()) {
        setAnalytics(getAnalytics(app));
      }
    }

    initAnalytics();
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, analytics }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
