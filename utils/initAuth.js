import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { enableIndexedDbPersistence } from "firebase/firestore";

const clientCredential = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(clientCredential);
export const db = getFirestore(app);

// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code == "failed-precondition") {
//     // Multiple tabs open, persistence can only be enabled
//     // in one tab at a a time.
//     // ...
//   } else if (err.code == "unimplemented") {
//     // The current browser does not support all of the
//     // features required to enable persistence
//     // ...
//   }
// });
// // Subsequent queries will use persistence, if it was enabled successfully

export const addNewUnit = async () => {
  if (user) {
    await setDoc(doc(db, "unit_data", "test"), {
      test1: "test1",
    });
  } else {
    console.log("user need to login");
  }
};

export default app;
