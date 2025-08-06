// Test analytics data fetching
console.log('🧪 Testing analytics data...')

// Import the firebase service
import { firebaseService } from './src/services/firebaseService.js'

async function testAnalytics() {
  try {
    console.log('📊 Testing analytics data for different time ranges...')
    
    const ranges = ['hour', 'day', 'week', 'month']
    
    for (const range of ranges) {
      console.log(`\n🔍 Testing ${range} range...`)
      const data = await firebaseService.getAnalyticsData(range)
      console.log(`✅ ${range}: ${data.length} records`)
      
      if (data.length > 0) {
        const sample = data[0]
        console.log(`   Sample: temp=${sample.temperature.celsius}°C, humidity=${sample.humidity}%, co2=${sample.airQuality.co2}ppm`)
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testAnalytics()
