// Firebase Test Data Script
// Run this to add test data to your Firebase Realtime Database

import { initializeApp } from "firebase/app"
import { getDatabase, ref, set } from "firebase/database"
import dotenv from "dotenv"

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Test data to insert
const testSensorData = {
  temperature: 25.6,
  humidity: 60.2,
  pressure: 1013.25,
  uvIndex: 3.2,
  co2: 420,
  gas: 150,
  airQuality: 85,
  lightIntensity: 750,
  gps: {
    latitude: 7.2906,
    longitude: 80.6337
  },
  altitude: 1200,
  windSpeed: 5.2,
  windDirection: 180,
  satellites: 8,
  timestamp: new Date().toISOString()
}

const testSystemData = {
  batteryVoltage: 12.4,
  nrfConnected: true,
  uplinkActive: true,
  uptime: "02:15:30",
  esp32Temperature: 38.5,
  sensors: {
    mpu6050: true,
    bme280: true,
    uvSensor: true,
    ccs811: true,
    vl53l0x: true,
    gps: true
  }
}

async function insertTestData() {
  try {
    console.log('🔥 Inserting test data into Firebase...')

    // Insert sensor data
    await set(ref(database, 'sensorData'), testSensorData)
    console.log('✅ Sensor data inserted successfully')

    // Insert system data
    await set(ref(database, 'systemData'), testSystemData)
    console.log('✅ System data inserted successfully')

    console.log('🎉 Test data insertion complete!')
    console.log('Your dashboard should now show live data!')

  } catch (error) {
    console.error('❌ Error inserting test data:', error)
    console.log('Check your Firebase Realtime Database rules and permissions')
  }
}

// Run the test
insertTestData()

// To use this script:
// 1. Save as testData.js
// 2. Run: node testData.js
// 3. Check your Firebase console to see if data was inserted
// 4. Refresh your dashboard to see live data
