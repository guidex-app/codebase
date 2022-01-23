import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, UserCredential } from 'firebase/auth';
import fireConfig from './fireConfig';

export const loginUser = (email: string, password: string) => {
  const auth = getAuth(fireConfig);
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => userCredential.user)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.message);
    });
};

export const logoutUser = () => {
  const auth = getAuth(fireConfig);
  signOut(auth).then(() => {
    // Sign-out successful.

  }).catch((error) => {
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
