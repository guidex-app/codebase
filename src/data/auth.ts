import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, UserCredential } from 'firebase/auth';

import fireConfig from './fireConfig';

export const loginUser = async (email: string, password: string) => {
  const auth = getAuth(fireConfig);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getUser = async (): Promise<any> => {
  const auth = getAuth(fireConfig);
  return auth.currentUser || {};
};

export const logoutUser = () => {
  const auth = getAuth(fireConfig);
  signOut(auth).then(() => {
    // Sign-out successful.

  }).catch(() => {
    // An error happened.
  });
};

export const createUser = async (email: string, password: string): Promise<UserCredential> => {
  const auth = getAuth(fireConfig);
  return createUserWithEmailAndPassword(auth, email, password);
};

export const updateUserProfil = async (data: {
  displayName?: string | null;
  photoURL?: string | null;
}) => {
  const auth: any = getAuth(fireConfig);
  updateProfile(auth.currentUser, {
    ...data,
  });
};
