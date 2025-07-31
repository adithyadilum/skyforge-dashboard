import { db, hasFirebaseConfig } from '../lib/firebase'
import { ref, onValue, query, orderByKey, limitToLast } from 'firebase/database'
import { WeatherData } from '../types'

export class FirebaseService {
  private listeners: { [key: string]: () => void } = {}
  private isConnected: boolean = false
  private lastDataTimestamp: number = 0
  private connectionStatusCallback: ((status: 'connected' | 'disconnected' | 'connecting') => void) | null = null
  private currentStatus: 'connected' | 'disconnected' | 'connecting' = 'connecting'
  private statusCheckInterval: NodeJS.Timeout | null = null

  // Set connection status callback
  setConnectionStatusCallback(callback: (status: 'connected' | 'disconnected' | 'connecting') => void) {
    this.connectionStatusCallback = callback
    console.log('✅ Connection status callback has been set')
    
    // Immediately call with current status if we have one
    if (this.currentStatus) {
      console.log(`📡 Immediately calling callback with current status: ${this.currentStatus}`)
      callback(this.currentStatus)
    }
  }

  // Check if data is live (updated within last 10 seconds)
  private isDataLive(timestamp: number): boolean {
    const currentTime = Date.now()
    const timeDiff = currentTime - timestamp
    return timeDiff <= 10000 // 10 seconds threshold as requested
  }

  // Update connection status based on data freshness
  private updateConnectionStatus() {
    if (this.lastDataTimestamp === 0) {
      // No data received yet - if we've been connecting for more than 10 seconds, consider it disconnected
      return
    }

    const currentTime = Date.now()
    const timeDiff = currentTime - this.lastDataTimestamp
    const isLive = timeDiff <= 3000 // 3 seconds threshold for real-time data
    const newStatus = isLive ? 'connected' : 'disconnected'
    
    // Always update status if it's different
    if (newStatus !== this.currentStatus) {
      const oldStatus = this.currentStatus
      this.currentStatus = newStatus
      
      // Call the callback
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback(newStatus)
        console.log(`📞 Called status callback: ${newStatus}`)
      } else {
        console.warn('⚠️ Connection status callback not set! Current status:', newStatus)
      }
      
      // Log status change with data age
      const ageSeconds = Math.floor(timeDiff / 1000)
      console.log(`🔄 Status changed from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}: Data age is ${ageSeconds}s (threshold: 3s)`)
    }
  }

  // Start monitoring data freshness
  private startStatusMonitoring() {
    // Clear any existing interval
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval)
    }
    
    // Check status every 1 second
    this.statusCheckInterval = setInterval(() => {
      this.updateConnectionStatus()
    }, 1000)
    
    console.log('� Started status monitoring (checking every 1 second)')
  }

  // Stop monitoring data freshness
  private stopStatusMonitoring() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval)
      this.statusCheckInterval = null
      console.log('⏹️ Stopped status monitoring')
    }
  }

  // Subscribe to real-time weather data from sensor_data node
  subscribeToWeatherData(callback: (data: WeatherData | null) => void): () => void {
    // Debug: Check if callback is set
    if (!this.connectionStatusCallback) {
      console.warn('⚠️ WARNING: Connection status callback not set! Call setConnectionStatusCallback() first.')
    } else {
      console.log('✅ Connection status callback is properly set')
    }

    // Check if Firebase is configured
    if (!hasFirebaseConfig || !db) {
      console.log('Firebase not configured, returning null data immediately')
      this.currentStatus = 'disconnected'
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback('disconnected')
        console.log('📞 Called status callback: disconnected (Firebase not configured)')
      }
      setTimeout(() => callback(null), 100)
      return () => { } // Return empty unsubscribe function
    }

    console.log('Setting up real-time listener for sensor_data...')
    this.currentStatus = 'connecting'
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback('connecting')
      console.log('📞 Called status callback: connecting')
    }

    // Listen to the latest record in sensor_data
    const sensorDataRef = ref(db, 'sensor_data')
    const latestDataQuery = query(sensorDataRef, orderByKey(), limitToLast(1))

    // Start status monitoring ONCE - not on every data update
    this.startStatusMonitoring()

    const unsubscribe = onValue(latestDataQuery, (snapshot) => {
      const data = snapshot.val()

      console.log('📊 Real-time Firebase data received:', data)

      if (data) {
        // Get the latest record (there should only be one due to limitToLast(1))
        const latestKey = Object.keys(data)[0]
        const latestRecord = data[latestKey]

        if (latestRecord && latestRecord.timestamp) {
          // Robust timestamp handling: support both seconds and milliseconds
          let recordTimestamp = latestRecord.timestamp
          if (recordTimestamp > 1e12) {
            // Already in milliseconds
          } else if (recordTimestamp > 1e9) {
            // In seconds, convert to milliseconds
            recordTimestamp = recordTimestamp * 1000
          } else {
            // Invalid timestamp, use current time
            recordTimestamp = Date.now()
          }
          
          this.lastDataTimestamp = recordTimestamp

          console.log(`📊 New data received - timestamp: ${recordTimestamp}, current time: ${Date.now()}`)

          // Immediately check if data is live and update status
          const currentTime = Date.now()
          const timeDiff = currentTime - recordTimestamp
          const isLive = timeDiff <= 3000 // 3 seconds threshold for real-time data
          
          console.log(`⏱️ Data age: ${Math.floor(timeDiff / 1000)}s, isLive: ${isLive}`)
          
          // Update status immediately when new data arrives
          const newStatus = isLive ? 'connected' : 'disconnected'
          if (newStatus !== this.currentStatus) {
            const oldStatus = this.currentStatus
            this.currentStatus = newStatus
            
            if (this.connectionStatusCallback) {
              this.connectionStatusCallback(newStatus)
              console.log(`⚡ Immediate status change: ${oldStatus.toUpperCase()} → ${newStatus.toUpperCase()}`)
            } else {
              console.warn('⚠️ Connection status callback not set during immediate status change!')
            }
          }

          if (!this.isConnected) {
            this.isConnected = true
            console.log('🔥 Firebase real-time connection established!')
          }

          // Transform Firebase data to match WeatherData interface
          const weatherData: WeatherData = {
            temperature: {
              celsius: latestRecord.temperature || 0,
              fahrenheit: latestRecord.temperature ? (latestRecord.temperature * 9 / 5) + 32 : 0,
              feelsLike: latestRecord.temperature ? latestRecord.temperature - 2 : 0,
            },
            humidity: latestRecord.humidity || 0,
            pressure: {
              hPa: latestRecord.pressure || 1013,
              altitude: latestRecord.altitude || 0,
            },
            uvIndex: {
              value: latestRecord.uvIndex || 0,
              level: this.getUVLevel(latestRecord.uvIndex || 0),
            },
            airQuality: {
              co2: latestRecord.co2 || 0,
              gas: latestRecord.gas || 0,
              quality: latestRecord.airQuality || 0,
            },
            light: {
              lux: latestRecord.lightIntensity || 0,
              ppm: latestRecord.lightIntensity || 0,
            },
            location: {
              latitude: latestRecord.latitude || 0,
              longitude: latestRecord.longitude || 0,
              altitude: latestRecord.altitude || 0,
            },
            wind: {
              speed: 0, // Not available in your data structure
              direction: 0, // Not available in your data structure
            },
            satellites: latestRecord.satellites || 0,
            timestamp: new Date(recordTimestamp).toLocaleTimeString(),
            condition: this.getWeatherCondition(latestRecord.lightIntensity || 0),
            isLive: isLive,
            lastUpdate: recordTimestamp
          }

          console.log('🌡️ Processed weather data:', {
            temperature: weatherData.temperature.celsius,
            humidity: weatherData.humidity,
            pressure: weatherData.pressure.hPa,
            timestamp: weatherData.timestamp,
            isLive: isLive,
            recordKey: latestKey
          })

          callback(weatherData)
        } else {
          // No valid record or missing timestamp
          console.log('❌ No valid sensor record found or missing timestamp')
          this.currentStatus = 'disconnected'
          if (this.connectionStatusCallback) {
            this.connectionStatusCallback('disconnected')
            console.log('📞 Called status callback: disconnected (no valid sensor record)')
          }
          callback(null)
        }
      } else {
        console.log('❌ No Firebase data available')
        this.currentStatus = 'disconnected'
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback('disconnected')
          console.log('📞 Called status callback: disconnected (no Firebase data)')
        }
        callback(null)
      }
    }, (error) => {
      console.error('🚨 Firebase read error:', error)
      this.isConnected = false
      this.currentStatus = 'disconnected'
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback('disconnected')
        console.log('📞 Called status callback: disconnected (Firebase error)')
      }
      callback(null)
    })

    // Store the unsubscribe function
    const listenerId = 'weather_' + Date.now()
    this.listeners[listenerId] = unsubscribe

    return () => {
      unsubscribe()
      this.stopStatusMonitoring()
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
      return () => { } // Return empty unsubscribe function
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

  // Get current status string for debugging
  getCurrentStatus(): 'connected' | 'disconnected' | 'connecting' {
    return this.currentStatus
  }

  // Debug method to check callback state
  isCallbackSet(): boolean {
    return this.connectionStatusCallback !== null
  }

  // Get historical sensor data for analytics
  async getHistoricalData(limit: number = 50): Promise<WeatherData[]> {
    if (!hasFirebaseConfig || !db) {
      console.log('Firebase not configured, returning empty historical data')
      return []
    }

    try {
      console.log(`📈 Fetching last ${limit} historical records...`)
      const sensorDataRef = ref(db, 'sensor_data')
      const historicalQuery = query(sensorDataRef, orderByKey(), limitToLast(limit))

      return new Promise((resolve, reject) => {
        const unsubscribe = onValue(historicalQuery, (snapshot) => {
          const data = snapshot.val()
          unsubscribe() // Unsubscribe immediately as this is a one-time fetch

          console.log('🔍 Raw Firebase data received:', data)

          if (data) {
            const historicalData: WeatherData[] = []

            // Process each record
            Object.entries(data).forEach(([key, record]: [string, any]) => {
              console.log(`🔍 Processing record ${key}:`, record)

              if (record && record.timestamp) {
                const recordTimestamp = record.timestamp * 1000 // Convert to milliseconds
                const isLive = this.isDataLive(recordTimestamp)

                console.log(`📅 Record timestamp: ${record.timestamp}, converted: ${recordTimestamp}, isLive: ${isLive}`)

                const weatherData: WeatherData = {
                  temperature: {
                    celsius: record.temperature || 0,
                    fahrenheit: record.temperature ? (record.temperature * 9 / 5) + 32 : 0,
                    feelsLike: record.temperature ? record.temperature - 2 : 0,
                  },
                  humidity: record.humidity || 0,
                  pressure: {
                    hPa: record.pressure || 1013,
                    altitude: record.altitude || 0,
                  },
                  uvIndex: {
                    value: record.uvIndex || 0,
                    level: this.getUVLevel(record.uvIndex || 0),
                  },
                  airQuality: {
                    co2: record.co2 || 0,
                    gas: record.gas || 0,
                    quality: record.airQuality || 0,
                  },
                  light: {
                    lux: record.lightIntensity || 0,
                    ppm: record.lightIntensity || 0,
                  },
                  location: {
                    latitude: record.latitude || 0,
                    longitude: record.longitude || 0,
                    altitude: record.altitude || 0,
                  },
                  wind: {
                    speed: 0, // Calculate from GPS if available
                    direction: 0,
                  },
                  satellites: record.satellites || 0,
                  timestamp: new Date(recordTimestamp).toLocaleTimeString(),
                  condition: this.getWeatherCondition(record.lightIntensity || 0),
                  isLive: isLive,
                  lastUpdate: recordTimestamp,
                  recordId: key
                }

                console.log(`✅ Processed weather data:`, {
                  key,
                  temperature: weatherData.temperature.celsius,
                  humidity: weatherData.humidity,
                  co2: weatherData.airQuality.co2,
                  timestamp: weatherData.timestamp,
                  lastUpdate: weatherData.lastUpdate
                })

                historicalData.push(weatherData)
              } else {
                console.log(`❌ Skipping invalid record ${key}:`, record)
              }
            })

            // Sort by timestamp (oldest first for analytics)
            historicalData.sort((a, b) => (a.lastUpdate || 0) - (b.lastUpdate || 0))

            console.log(`📊 Fetched ${historicalData.length} historical records`)
            console.log('📊 First record:', historicalData[0])
            console.log('📊 Last record:', historicalData[historicalData.length - 1])
            resolve(historicalData)
          } else {
            console.log('❌ No historical data available')
            resolve([])
          }
        }, (error) => {
          console.error('🚨 Historical data fetch error:', error)
          reject(error)
        })
      })
    } catch (error) {
      console.error('🚨 Error fetching historical data:', error)
      return []
    }
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
