// Test script to verify field mapping with your database structure
const testRecord = {
  "1754249026": {
    altitude: 0,
    aqi: 0,
    battery_voltage: 0,
    control_mode: 1,
    control_pitch: 0,
    control_roll: 0,
    control_switches: 0,
    control_throttle: 0,
    control_yaw: 0,
    drone_timestamp: 0,
    esp32_temp: 25.5,
    humidity: 65.2,
    latitude: 7.2906,
    light_intensity: 750,
    longitude: 80.6337,
    timestamp: 1754249026
  }
}

// Simulate the field detection logic
function findField(record, patterns) {
  const fields = Object.keys(record)
  console.log('Available fields:', fields)
  
  for (const pattern of patterns) {
    const field = fields.find(f => f.toLowerCase().includes(pattern.toLowerCase()))
    if (field && record[field] !== undefined && record[field] !== null) {
      console.log(`✅ Found ${field} via pattern "${pattern}": ${record[field]}`)
      return record[field]
    }
  }
  console.log(`❌ No field found for patterns: ${patterns.join(', ')}`)
  return null
}

// Test with your actual record
const latestRecord = testRecord["1754249026"]
console.log('Testing field mapping with your database structure...')
console.log('Input record:', latestRecord)
console.log('\n--- Field Detection Results ---')

const temperature = findField(latestRecord, ['esp32_temp', 'temperature', 'temp']) || 0
const humidity = findField(latestRecord, ['humidity', 'humid', 'moisture']) || 0
const lightIntensity = findField(latestRecord, ['light_intensity', 'light', 'lux']) || 0
const batteryVoltage = findField(latestRecord, ['battery_voltage', 'batteryVoltage', 'battery']) || 0
const latitude = findField(latestRecord, ['latitude', 'lat']) || 0
const longitude = findField(latestRecord, ['longitude', 'lng']) || 0
const altitude = findField(latestRecord, ['altitude', 'elevation']) || 0
const airQuality = findField(latestRecord, ['aqi', 'airquality', 'air_index']) || 0

console.log('\n--- Extracted Values ---')
console.log('Temperature (ESP32):', temperature, '°C')
console.log('Humidity:', humidity, '%')
console.log('Light Intensity:', lightIntensity, 'lux')
console.log('Battery Voltage:', batteryVoltage, 'V')
console.log('Location:', `${latitude}, ${longitude}`)
console.log('Altitude:', altitude, 'm')
console.log('Air Quality (AQI):', airQuality)

console.log('\n✅ Field mapping test complete!')
console.log('Your database structure should now be properly detected!')
