import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCcLSYnEJbmIdXAYyCOdGEewsXSTCprlH8",
  authDomain: "instagram-855bb.firebaseapp.com",
  projectId: "instagram-855bb",
  storageBucket: "instagram-855bb.appspot.com",
  messagingSenderId: "697567017750",
  appId: "1:697567017750:web:621dd1237bb86e2faa2e37"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
