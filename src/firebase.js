import { initializeApp } from 'firebase/app';
//SDK´s
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDSR1Mv4rULG9uxrIXgVA2IOMW5QWz8Buc",
    authDomain: "rock-paper-scissors-7b9ab.firebaseapp.com",
    projectId: "rock-paper-scissors-7b9ab",
    storageBucket: "rock-paper-scissors-7b9ab.appspot.com",
    messagingSenderId: "559934691382",
    appId: "1:559934691382:web:8d935b7df53ca27736e097",
    measurementId: "G-ZJTJWS6GGD"
  };

//Iniciando Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);