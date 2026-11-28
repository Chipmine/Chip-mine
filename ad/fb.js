// Firebase SDK wrapper for the admin panel (same project as the main site)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import * as A from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import * as F from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import * as S from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const app = initializeApp({
  apiKey: "AIzaSyAlhd_KZ0mDCLTqdTPTQOcAldZd2hgI2YI",
  authDomain: "chipmain.firebaseapp.com",
  projectId: "chipmain",
  storageBucket: "chipmain.firebasestorage.app",
  messagingSenderId: "407318397626",
  appId: "1:407318397626:web:8fd760fd806358819b7883"
});
export const auth = A.getAuth(app), db = F.getFirestore(app), storage = S.getStorage(app);
export const { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail } = A;
export const { doc, collection, query, where, orderBy, limit, getDoc, getDocs, setDoc, updateDoc, addDoc, deleteDoc, onSnapshot, runTransaction, increment, serverTimestamp, getAggregateFromServer, count, sum } = F;
export const { ref, getDownloadURL } = S;
