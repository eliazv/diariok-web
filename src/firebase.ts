// firebase.ts
// import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcJ2wNDWJhmGtKD6OM3Ynzd5Rl-xb3gJw",
  authDomain: "diariok-9098b.firebaseapp.com",
  projectId: "diariok-9098b",
  storageBucket: "diariok-9098b.appspot.com",
  messagingSenderId: "774610317405",
  appId: "1:774610317405:web:97b9f9c0a75f42146cddb4",
  measurementId: "G-RE52TFDWQN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inizializza Firebase
// const app = initializeApp(firebaseConfig);

// Inizializza Firestore e Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
