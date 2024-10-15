import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

// Inizializza Firestore e Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
