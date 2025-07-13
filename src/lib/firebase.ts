import { initializeApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"

// ⛔ Replace the placeholders with **your real Firebase project values**
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Avoid re-initialising during hot-reload in Vite
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const db = getDatabase(app)
