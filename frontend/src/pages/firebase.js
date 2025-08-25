import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwOelMAyf_gyY-QcB2xf3cTTUBHmF54DU",
  authDomain: "quiz-project-80f51.firebaseapp.com",
  projectId: "quiz-project-80f51",
  storageBucket: "quiz-project-80f51.firebasestorage.app",
  messagingSenderId: "519584152083",
  appId: "1:519584152083:web:dab193a539a1a1a0141de6",
  measurementId: "G-Z4RW6GVZR2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };