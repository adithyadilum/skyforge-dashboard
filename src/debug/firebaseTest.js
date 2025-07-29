// Firebase Connection Test - Run this to debug connection issues
import { firebaseService } from '../services/firebaseService.js'

console.log('🔥 Testing Firebase Connection...')

// Test 1: Check if Firebase is configured
console.log('Environment Variables:')
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
console.log('Database URL:', import.meta.env.VITE_FIREBASE_DB_URL ? '✅ Set' : '❌ Missing')
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')

// Test 2: Test Firebase connection
firebaseService.testConnection().then(connected => {
  if (connected) {
    console.log('🟢 Firebase Connection: SUCCESS')
  } else {
    console.log('🔴 Firebase Connection: FAILED')
    console.log('Possible issues:')
    console.log('- Check Firebase Realtime Database rules')
    console.log('- Ensure database exists in asia-southeast1 region')
    console.log('- Check network connectivity')
    console.log('- Verify environment variables are loaded correctly')
  }
})

// Test 3: Subscribe to data and see what happens
console.log('🔍 Testing data subscription...')
const unsubscribe = firebaseService.subscribeToWeatherData((data) => {
  if (data) {
    console.log('✅ Received data from Firebase:', data)
  } else {
    console.log('❌ No data received - check Firebase database content')
  }
})

// Clean up after 10 seconds
setTimeout(() => {
  unsubscribe()
  console.log('🧹 Test completed')
}, 10000)
