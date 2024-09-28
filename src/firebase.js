import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3Eik79yW_IOj0o1NhebYXXTCHNNX_klg",
  authDomain: "visit-scheduler-963d5.firebaseapp.com",
  projectId: "visit-scheduler-963d5",
  storageBucket: "visit-scheduler-963d5.appspot.com",
  messagingSenderId: "43338714768",
  appId: "1:43338714768:web:25575adb0fe53f74bb9215",
  measurementId: "G-T5X06FML48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};