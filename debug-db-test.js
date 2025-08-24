// Quick Firebase Database Test
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, limitToLast, query, orderByKey } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyA5IRjwAdvgSQ8K9sTkfdjEgFO_P1K-PdM",
  authDomain: "skyforge-4606b.firebaseapp.com", 
  databaseURL: "https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skyforge-4606b",
  storageBucket: "skyforge-4606b.firebasestorage.app",
  messagingSenderId: "113983013806",
  appId: "1:113983013806:web:b37570450de08e7a147e3f"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

console.log('🔍 Testing Firebase database connection...')

// Test telemetry node
const telemetryRef = ref(db, 'telemetry')
const latestQuery = query(telemetryRef, orderByKey(), limitToLast(3))

onValue(latestQuery, (snapshot) => {
  const data = snapshot.val()
  console.log('📊 Telemetry data:', data)
  
  if (data) {
    Object.entries(data).forEach(([key, record]) => {
      console.log(`🔑 Record ${key}:`, record)
    })
  } else {
    console.log('❌ No telemetry data found')
  }
}, (error) => {
  console.error('🚨 Database error:', error)
})

// Also test root to see what nodes exist
const rootRef = ref(db, '/')
onValue(rootRef, (snapshot) => {
  const data = snapshot.val()
  console.log('📁 Database root nodes:', Object.keys(data || {}))
}, { onlyOnce: true })
