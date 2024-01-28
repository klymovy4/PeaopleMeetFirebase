import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const app = firebase.initializeApp({
  apiKey: "AIzaSyB-xIlpc20YynJ9K5qLSlgI4CAapl2NJ3Q",
  authDomain: "people-meet-f4c72.firebaseapp.com",
  databaseURL: "https://people-meet-f4c72-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "people-meet-f4c72",
  storageBucket: "people-meet-f4c72.appspot.com",
  messagingSenderId: "47530059784",
  appId: "1:47530059784:web:54c7f2257fd46f04f5c9bd"
});


export const auth = app.auth()
export const db = app.firestore()
export const storage = app.storage()
export const database = app.database()

console.log(1, db, 2, storage, 3, database);