// Status Change Test Script
// This script tests the automatic status switching functionality

import { initializeApp } from "firebase/app"
import { getDatabase, ref, set } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyA5IRjwAdvgSQ8K9sTkfdjEgFO_P1K-PdM",
  authDomain: "skyforge-4606b.firebaseapp.com",
  databaseURL: "https://skyforge-4606b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "skyforge-4606b",
  storageBucket: "skyforge-4606b.firebasestorage.app",
  messagingSenderId: "113983013806",
  appId: "1:113983013806:web:b37570450de08e7a147e3f"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Function to add a new sensor reading with current timestamp
async function addSensorReading() {
  const currentTimestamp = Math.floor(Date.now() / 1000) // Current time in seconds
  const recordKey = `record_${currentTimestamp}`
  
  const sensorData = {
    temperature: 25.6 + (Math.random() * 10 - 5), // Random temp ±5°C
    humidity: 60.2 + (Math.random() * 20 - 10),   // Random humidity ±10%
    pressure: 1013.25 + (Math.random() * 20 - 10), // Random pressure
    uvIndex: 3.2 + (Math.random() * 2 - 1),       // Random UV
    co2: 420 + (Math.random() * 100 - 50),        // Random CO2
    gas: 150 + (Math.random() * 50 - 25),         // Random gas
    airQuality: 85 + (Math.random() * 30 - 15),   // Random air quality
    lightIntensity: 750 + (Math.random() * 500 - 250), // Random light
    latitude: 7.2906 + (Math.random() * 0.01 - 0.005), // Random GPS
    longitude: 80.6337 + (Math.random() * 0.01 - 0.005),
    altitude: 1200 + (Math.random() * 100 - 50),
    satellites: 8 + Math.floor(Math.random() * 4 - 2), // 6-10 satellites
    timestamp: currentTimestamp
  }

  try {
    await set(ref(database, `sensor_data/${recordKey}`), sensorData)
    console.log(`✅ Added sensor reading at ${new Date().toLocaleTimeString()}`)
    console.log(`📊 Data:`, {
      temperature: sensorData.temperature.toFixed(1),
      humidity: sensorData.humidity.toFixed(1),
      co2: sensorData.co2.toFixed(0),
      timestamp: currentTimestamp
    })
    return true
  } catch (error) {
    console.error('❌ Error adding sensor reading:', error)
    return false
  }
}

console.log('🧪 Firebase Status Change Test')
console.log('===============================')
console.log('This will:')
console.log('1. Add a fresh sensor reading (status should go to LIVE)')
console.log('2. Wait 5 seconds (status should go to OFFLINE after 3s)')
console.log('3. Add another reading (status should go back to LIVE)')
console.log('')

// Test sequence
async function runStatusTest() {
  console.log('🔥 Step 1: Adding fresh sensor reading...')
  await addSensorReading()
  
  console.log('⏳ Step 2: Waiting 5 seconds to test timeout...')
  console.log('   (Watch your dashboard - status should change to OFFLINE after 3 seconds)')
  
  let countdown = 5
  const countdownInterval = setInterval(() => {
    console.log(`   Countdown: ${countdown}s`)
    countdown--
    
    if (countdown < 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
  
  setTimeout(async () => {
    console.log('🔥 Step 3: Adding another sensor reading to test reconnection...')
    await addSensorReading()
    console.log('✅ Test complete! Check your dashboard status changes.')
    process.exit(0)
  }, 5000)
}

// Run the test
runStatusTest()
