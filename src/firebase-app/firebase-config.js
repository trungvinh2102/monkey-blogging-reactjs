import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDerfgILif4sWszQG2nAARQjMHHYUOKFrE",
  authDomain: "monkey-blogging-5fc42.firebaseapp.com",
  projectId: "monkey-blogging-5fc42",
  storageBucket: "monkey-blogging-5fc42.appspot.com",
  messagingSenderId: "172197053940",
  appId: "1:172197053940:web:952a1eb560bd05614da5a1",
  measurementId: "G-BTHPWNE2NK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
