// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAnalytics} from 'firebase/analytics'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-4OvbKHIgSkRt7Hsooo8EVf19I8ybpzI",
  authDomain: "pantry-app-db35e.firebaseapp.com",
  projectId: "pantry-app-db35e",
  storageBucket: "pantry-app-db35e.appspot.com",
  messagingSenderId: "1065562145540",
  appId: "1:1065562145540:web:0776a02b741376fb474651"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const firestore = getFirestore(app);
export {firestore}

