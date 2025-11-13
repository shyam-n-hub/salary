// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDsszxiUTv4EN6euFZDyIF6kgi3I6w3Y0M",
  authDomain: "salary-e40d3.firebaseapp.com",
  databaseURL: "https://salary-e40d3-default-rtdb.firebaseio.com",
  projectId: "salary-e40d3",
  storageBucket: "salary-e40d3.firebasestorage.app",
  messagingSenderId: "428448960469",
  appId: "1:428448960469:web:46027d11cdd87de28fb75c",
  measurementId: "G-G24GQDMSX3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
