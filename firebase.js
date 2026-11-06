import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBg-AiFOL-T2BYOr8B5bIRcLm5kxoT6MW4",
  authDomain: "smart-business-52c61.firebaseapp.com",
  projectId: "smart-business-52c61",
  storageBucket: "smart-business-52c61.firebasestorage.app",
  messagingSenderId: "128836448322",
  appId: "1:128836448322:web:2b8035be2b6385769b7ddb"
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export * from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
export * from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
