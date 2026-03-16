import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Estos datos los copias de la configuración de tu proyecto en Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-app.firebaseapp.com",
  databaseURL: "https://tu-app-default-rtdb.firebaseio.com",
  projectId: "tu-app",
  storageBucket: "tu-app.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);