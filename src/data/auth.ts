import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, UserCredential } from 'firebase/auth';

import fireConfig from './fireConfig';

export const loginUser = async (email: string, password: string) => {
  const auth = await getAuth(fireConfig);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getUser = async (): Promise<any> => {
  const auth = await getAuth(fireConfig);
  return auth.currentUser || {};
};

export const logoutUser = async () => {
  const auth = await getAuth(fireConfig);
  signOut(auth).then(() => {
    // Sign-out successful.

  }).catch(() => {
    // An error happened.
  });
};

export const createUser = async (email: string, password: string): Promise<UserCredential> => {
  const auth = await getAuth(fireConfig);
  return createUserWithEmailAndPassword(auth, email, password);
};

export const updateUserProfil = async (data: {
  displayName?: string | null;
  photoURL?: string | null;
}) => {
  const auth: any = await getAuth(fireConfig);
  updateProfile(auth.currentUser, {
    ...data,
  });
};
