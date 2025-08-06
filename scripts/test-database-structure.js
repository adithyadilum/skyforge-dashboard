// Quick test to check database structure and connectivity
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, query, orderByKey, limitToLast } from 'firebase/database'

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

console.log('🔍 Testing database connectivity...')

// Test 1: Check if sensor_data exists
console.log('\n📊 Testing sensor_data path...')
const sensorDataRef = ref(db, 'sensor_data')
const sensorDataQuery = query(sensorDataRef, orderByKey(), limitToLast(1))

onValue(sensorDataQuery, (snapshot) => {
  const data = snapshot.val()
  console.log('sensor_data result:', data)
  
  if (data) {
    const latestKey = Object.keys(data)[0]
    const latestRecord = data[latestKey]
    console.log('Latest sensor_data record:', latestRecord)
    console.log('Fields found:', Object.keys(latestRecord))
  } else {
    console.log('❌ No data found in sensor_data')
  }
}, (error) => {
  console.error('❌ Error reading sensor_data:', error)
})

// Test 2: Check if telemetry exists (based on your timestamp format)
console.log('\n📊 Testing telemetry path...')
const telemetryRef = ref(db, 'telemetry')
const telemetryQuery = query(telemetryRef, orderByKey(), limitToLast(1))

onValue(telemetryQuery, (snapshot) => {
  const data = snapshot.val()
  console.log('telemetry result:', data)
  
  if (data) {
    const latestKey = Object.keys(data)[0]
    const latestRecord = data[latestKey]
    console.log('Latest telemetry record:', latestRecord)
    console.log('Fields found:', Object.keys(latestRecord))
  } else {
    console.log('❌ No data found in telemetry')
  }
}, (error) => {
  console.error('❌ Error reading telemetry:', error)
})

// Test 3: Check root level to see what nodes exist
console.log('\n📊 Testing root level...')
const rootRef = ref(db, '/')

onValue(rootRef, (snapshot) => {
  const data = snapshot.val()
  if (data) {
    console.log('Root level nodes found:', Object.keys(data))
  } else {
    console.log('❌ No data found at root level')
  }
}, (error) => {
  console.error('❌ Error reading root level:', error)
})
