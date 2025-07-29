import { db, hasFirebaseConfig } from '../lib/firebase'
import { ref, onValue } from 'firebase/database'
import { WeatherData } from '../types'

export class FirebaseService {
  private listeners: { [key: string]: () => void } = {}
  private isConnected: boolean = false

  // Subscribe to real-time weather data with enhanced real-time capabilities
  subscribeToWeatherData(callback: (data: WeatherData | null) => void): () => void {
    // Check if Firebase is configured
    if (!hasFirebaseConfig || !db) {
      console.log('Firebase not configured, returning null data immediately')
      // Return null immediately if Firebase is not configured
      setTimeout(() => callback(null), 100)
      return () => {} // Return empty unsubscribe function
    }

    console.log('Setting up real-time listener for sensorData...')
    const weatherRef = ref(db, 'sensorData')
    
    const unsubscribe = onValue(weatherRef, (snapshot) => {
      const data = snapshot.val()
      
      if (!this.isConnected) {
        this.isConnected = true
        console.log('🔥 Firebase real-time connection established!')
      }
      
      console.log('📊 Real-time Firebase data received:', data)
      
      if (data) {
        // Transform Firebase data to match WeatherData interface
        const weatherData: WeatherData = {
          temperature: {
            celsius: data.temperature || 0,
            fahrenheit: data.temperature ? (data.temperature * 9/5) + 32 : 0,
            feelsLike: data.temperature ? data.temperature - 2 : 0,
          },
          humidity: data.humidity || 0,
          pressure: {
            hPa: data.pressure || 1013,
            altitude: data.altitude || 0,
          },
          uvIndex: {
            value: data.uvIndex || 0,
            level: this.getUVLevel(data.uvIndex || 0),
          },
          airQuality: {
            co2: data.co2 || 0,
            gas: data.gas || 0,
            quality: data.airQuality || 0,
          },
          light: {
            lux: data.lightIntensity || 0,
            ppm: data.lightIntensity || 0,
          },
          location: {
            latitude: data.gps?.latitude || 0,
            longitude: data.gps?.longitude || 0,
            altitude: data.altitude || 0,
          },
          wind: {
            speed: data.windSpeed || 0,
            direction: data.windDirection || 0,
          },
          satellites: data.satellites || 0,
          timestamp: data.timestamp || new Date().toLocaleTimeString(),
          condition: this.getWeatherCondition(data.lightIntensity || 0),
        }
        
        console.log('🌡️ Processed weather data:', {
          temperature: weatherData.temperature.celsius,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure.hPa,
          timestamp: weatherData.timestamp
        })
        
        callback(weatherData)
      } else {
        console.log('❌ No Firebase data available')
        callback(null)
      }
    }, (error) => {
      console.error('🚨 Firebase read error:', error)
      this.isConnected = false
      callback(null)
    })

    // Store the unsubscribe function
    const listenerId = 'weather_' + Date.now()
    this.listeners[listenerId] = unsubscribe

    return () => {
      unsubscribe()
      delete this.listeners[listenerId]
      console.log('🔌 Weather data listener unsubscribed')
    }
  }

  // Subscribe to system data with enhanced real-time capabilities
  subscribeToSystemData(callback: (data: any) => void): () => void {
    // Check if Firebase is configured
    if (!hasFirebaseConfig || !db) {
      console.log('Firebase not configured, returning null system data immediately')
      // Return null immediately if Firebase is not configured
      setTimeout(() => callback(null), 100)
      return () => {} // Return empty unsubscribe function
    }

    console.log('Setting up real-time listener for systemData...')
    const systemRef = ref(db, 'systemData')
    
    const unsubscribe = onValue(systemRef, (snapshot) => {
      const data = snapshot.val()
      console.log('🔧 Real-time system data received:', data)
      
      if (data) {
        const systemData = {
          batteryVoltage: data.batteryVoltage || 11.7,
          nrfLink: data.nrfConnected || true,
          uplinkStatus: data.uplinkActive || true,
          uptime: data.uptime || '00:13:22',
          sensors: {
            mpu6050: data.sensors?.mpu6050 || true,
            bme280: data.sensors?.bme280 || true,
            uvSensor: data.sensors?.uvSensor || true,
            ccs811: data.sensors?.ccs811 || true,
            vl53l0x: data.sensors?.vl53l0x || true,
            gps: data.sensors?.gps || true,
          },
          esp32Temp: data.esp32Temperature || 39.2
        }
        
        console.log('🔋 Processed system data:', {
          batteryVoltage: systemData.batteryVoltage,
          esp32Temp: systemData.esp32Temp,
          uptime: systemData.uptime
        })
        
        callback(systemData)
      } else {
        console.log('❌ No system data available')
        callback(null)
      }
    }, (error) => {
      console.error('🚨 System data read error:', error)
      callback(null)
    })

    // Store the unsubscribe function
    const listenerId = 'system_' + Date.now()
    this.listeners[listenerId] = unsubscribe

    return () => {
      unsubscribe()
      delete this.listeners[listenerId]
      console.log('🔌 System data listener unsubscribed')
    }
  }

  // Helper function to determine UV level
  private getUVLevel(uvIndex: number): string {
    if (uvIndex <= 2) return "Low"
    if (uvIndex <= 5) return "Moderate"
    if (uvIndex <= 7) return "High"
    if (uvIndex <= 10) return "Very High"
    return "Extreme"
  }

  // Helper function to determine weather condition
  private getWeatherCondition(lightIntensity: number): string {
    if (lightIntensity > 1000) return "Sunny"
    if (lightIntensity > 500) return "Partly Cloudy"
    if (lightIntensity > 100) return "Cloudy"
    return "Dark/Night"
  }

  // Test real-time connection
  testConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!hasFirebaseConfig || !db) {
        console.log('Firebase not configured for connection test')
        resolve(false)
        return
      }

      console.log('🔍 Testing Firebase real-time connection...')
      const testRef = ref(db, '.info/connected')
      
      const unsubscribe = onValue(testRef, (snapshot) => {
        const connected = snapshot.val()
        console.log('🌐 Firebase connection status:', connected ? 'CONNECTED' : 'DISCONNECTED')
        unsubscribe()
        resolve(connected === true)
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe()
        resolve(false)
      }, 5000)
    })
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected
  }

  // Clean up all listeners
  cleanup() {
    console.log('🧹 Cleaning up Firebase listeners...')
    Object.values(this.listeners).forEach(unsubscribe => unsubscribe())
    this.listeners = {}
    this.isConnected = false
  }
}

export const firebaseService = new FirebaseService()
