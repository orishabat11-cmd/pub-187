import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA42IZAyuAKl3D-1vcjhWp1ZrVznHFauWY",
  authDomain: "pub-187.firebaseapp.com",
  projectId: "pub-187",
  storageBucket: "pub-187.firebasestorage.app",
  messagingSenderId: "247418820459",
  appId: "1:247418820459:web:98fd9df0bf1f1cd4431e2e"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
