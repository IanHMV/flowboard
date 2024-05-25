import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDIWGMy56dSVZfOkDwI3FWAPzWd0uO-49I",
  authDomain: "flowboard-773e7.firebaseapp.com",
  projectId: "flowboard-773e7",
  storageBucket: "flowboard-773e7.appspot.com",
  messagingSenderId: "208934782842",
  appId: "1:208934782842:web:556785e2b0da43d2a9f8c3"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const fbFunctions = getFunctions(app);

// if (process.env.NODE_ENV === "development") {
//   connectAuthEmulator(auth, "http://localhost:9098");
//   connectFirestoreEmulator(db, "localhost", 8082);
//   connectFunctionsEmulator(fbFunctions, "localhost", 5002);
// }
