import { initializeApp, getApps } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Check if Firebase is properly configured
const hasFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_DATABASE_URL &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
)

console.log('🔥 Firebase Configuration Check:')
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
console.log('Database URL:', import.meta.env.VITE_FIREBASE_DATABASE_URL ? '✅ Set' : '❌ Missing')
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
console.log('Has Firebase Config:', hasFirebaseConfig)

// ⛔ Replace the placeholders with **your real Firebase project values**
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let db: any = null
let auth: any = null
let googleProvider: GoogleAuthProvider | null = null

try {
  if (hasFirebaseConfig) {
    // Avoid re-initialising during hot-reload in Vite
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    db = getDatabase(app)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    
    // Configure Google provider with necessary scopes
    googleProvider.addScope('profile')
    googleProvider.addScope('email')
    googleProvider.addScope('openid')
    
    // Set custom parameters for high-quality profile pictures
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      include_granted_scopes: 'true'
    })
    
    console.log("Firebase initialized successfully with authentication")
    console.log("Google Provider configured with scopes:", ['profile', 'email', 'openid'])
  } else {
    console.warn("Firebase configuration incomplete - using mock data mode")
  }
} catch (error) {
  console.error("Firebase initialization failed:", error)
}

export { db, auth, googleProvider, hasFirebaseConfig }
