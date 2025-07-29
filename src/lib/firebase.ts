import { initializeApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"

// Check if Firebase is properly configured
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_DB_URL &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
)

console.log('🔥 Firebase Configuration Check:')
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
console.log('Database URL:', import.meta.env.VITE_FIREBASE_DB_URL ? '✅ Set' : '❌ Missing')
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
console.log('Has Firebase Config:', hasFirebaseConfig)

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

let db: any = null

try {
  if (hasFirebaseConfig) {
    // Avoid re-initialising during hot-reload in Vite
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    db = getDatabase(app)
    console.log("Firebase initialized successfully")
  } else {
    console.warn("Firebase configuration incomplete - using mock data mode")
  }
} catch (error) {
  console.error("Firebase initialization failed:", error)
}

export { db, hasFirebaseConfig }
