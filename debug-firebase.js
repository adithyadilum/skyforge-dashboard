import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue, query, orderByKey, limitToLast } from "firebase/database"

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5IRjwAdvgSQ8K9sTkfdjEgFO_P1K-PdM",
  authDomain: "skyforge-4606b.firebaseapp.com",
  databaseURL: "https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skyforge-4606b",
  storageBucket: "skyforge-4606b.firebasestorage.app",
  messagingSenderId: "113983013806",
  appId: "1:113983013806:web:b37570450de08e7a147e3f",
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

console.log("🔍 Testing Firebase connection...")

// Test connection
const connectedRef = ref(db, '.info/connected')
onValue(connectedRef, (snapshot) => {
  const connected = snapshot.val()
  console.log('🌐 Firebase connected:', connected)
})

// Check what's in the telemetry node
const telemetryRef = ref(db, 'telemetry')
const latestQuery = query(telemetryRef, orderByKey(), limitToLast(5))

onValue(latestQuery, (snapshot) => {
  const data = snapshot.val()
  console.log('📊 Latest telemetry data (last 5 records):', data)
  
  if (data) {
    const keys = Object.keys(data)
    console.log('📊 Available keys:', keys)
    
    // Check the latest record structure
    const latestKey = keys[keys.length - 1]
    const latestRecord = data[latestKey]
    console.log('📊 Latest record structure:', latestRecord)
    
    // Check for battery field specifically
    console.log('🔋 Battery fields:', {
      battery: latestRecord?.battery,
      battery_voltage: latestRecord?.battery_voltage,
      batteryVoltage: latestRecord?.batteryVoltage
    })
  } else {
    console.log('❌ No telemetry data found')
  }
}, (error) => {
  console.error('🚨 Error reading telemetry:', error)
})

// Also check if there are other nodes
const rootRef = ref(db)
onValue(rootRef, (snapshot) => {
  const data = snapshot.val()
  if (data) {
    console.log('🏗️ Root database structure:', Object.keys(data))
  }
}, {
  onlyOnce: true
})
