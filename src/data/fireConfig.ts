import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBGmpf9zQNILywJIqDY9o8fuVarhbMOaKY',
  authDomain: 'guidex-95302.firebaseapp.com',
  databaseURL: 'https://guidex-95302.firebaseio.com',
  projectId: 'guidex-95302',
  storageBucket: 'guidex-95302.appspot.com',
  messagingSenderId: '288641972414',
  appId: '1:288641972414:web:ed199cea78ac8eb30b86ef',
  measurementId: 'G-1BS4WXWPHT',
};

const fireConfig = initializeApp(firebaseConfig);

export default fireConfig;
