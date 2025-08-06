// Quick Database Structure Test
// This will help identify your actual table names and data structure

import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"

// Add your Firebase config here (you can copy from your .env or firebase.ts)
const firebaseConfig = {
  // Add your config values here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

async function checkDatabaseStructure() {
  console.log('🔍 Checking your Firebase database structure...')
  
  try {
    // Check what tables exist at the root level
    const rootRef = ref(database, '/')
    
    onValue(rootRef, (snapshot) => {
      const data = snapshot.val()
      
      if (!data) {
        console.log('❌ Database is empty or no permission to read')
        return
      }
      
      console.log('🌲 Tables found in your database:')
      const tableNames = Object.keys(data)
      tableNames.forEach((tableName, index) => {
        console.log(`  ${index + 1}. ${tableName}`)
        
        // Show sample record from each table
        const tableData = data[tableName]
        if (typeof tableData === 'object' && tableData !== null) {
          const recordKeys = Object.keys(tableData)
          console.log(`     📊 Records: ${recordKeys.length}`)
          
          if (recordKeys.length > 0) {
            const latestKey = recordKeys[recordKeys.length - 1]
            const latestRecord = tableData[latestKey]
            console.log(`     📄 Latest record (${latestKey}):`)
            console.log(`        Fields: ${Object.keys(latestRecord || {}).join(', ')}`)
            
            // Show specific fields we're looking for
            if (latestRecord) {
              const checkFields = ['timestamp', 'esp32_temp', 'humidity', 'light_intensity', 'battery_voltage', 'latitude', 'longitude']
              const foundFields = checkFields.filter(field => latestRecord.hasOwnProperty(field))
              if (foundFields.length > 0) {
                console.log(`     ✅ Expected fields found: ${foundFields.join(', ')}`)
                console.log(`     📋 Sample values:`)
                foundFields.forEach(field => {
                  console.log(`        ${field}: ${latestRecord[field]}`)
                })
              } else {
                console.log(`     ❌ No expected fields found in this table`)
              }
            }
          }
        }
        console.log('')
      })
      
      // Recommendation
      console.log('💡 Recommendations:')
      const sensorTables = tableNames.filter(name => 
        name.toLowerCase().includes('sensor') || 
        name.toLowerCase().includes('data') ||
        name.toLowerCase().includes('reading')
      )
      
      if (sensorTables.length > 0) {
        console.log(`✅ Potential sensor data tables: ${sensorTables.join(', ')}`)
        console.log(`📝 Update your app to use: "${sensorTables[0]}" instead of "sensor_data"`)
      } else {
        console.log(`🔄 Try using one of these table names: ${tableNames.join(', ')}`)
      }
      
    }, { onlyOnce: true })
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
    console.log('Make sure your Firebase config is correct and you have read permissions')
  }
}

// Run the check
checkDatabaseStructure()

console.log('\n🚀 Instructions:')
console.log('1. Replace the firebaseConfig above with your actual config')
console.log('2. Run: node check-database.js')
console.log('3. Look for the table name that contains your sensor data')
console.log('4. Tell me the correct table name to update the app')
