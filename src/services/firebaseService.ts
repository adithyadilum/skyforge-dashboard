import { db, hasFirebaseConfig } from '../config/firebase'
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

    console.log('Setting up real-time listener for telemetry...')
    this.currentStatus = 'connecting'
    if (this.connectionStatusCallback) {
      this.connectionStatusCallback('connecting')
      console.log('📞 Called status callback: connecting')
    }

    // Listen to the latest record in telemetry
    const telemetryRef = ref(db, 'telemetry')
    const latestDataQuery = query(telemetryRef, orderByKey(), limitToLast(1))

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
              co2: latestRecord.eCO2 || 0,
              gas: latestRecord.TVOC || 0,
              quality: latestRecord.status || 0,
            },
            light: {
              lux: latestRecord.lux || 0,
              ppm: latestRecord.lux || 0,
            },
            location: {
              latitude: latestRecord.gps_latitude || 0,
              longitude: latestRecord.gps_longitude || 0,
              altitude: latestRecord.altitude || 0,
            },
            wind: {
              speed: 0, // Not available in your data structure
              direction: 0, // Not available in your data structure
            },
            satellites: latestRecord.gps_satellites || latestRecord.satellites || latestRecord.sat_count || 0,
            battery: {
              voltage: latestRecord.battery_voltage || latestRecord.batteryVoltage || 0,
              percentage: this.calculateBatteryPercentage(latestRecord.battery_voltage || latestRecord.batteryVoltage || 0),
            },
            timestamp: new Date(recordTimestamp).toLocaleTimeString(),
            condition: this.getWeatherCondition(latestRecord.lux || 0),
            isLive: isLive,
            lastUpdate: recordTimestamp
          }

          console.log('🌡️ Processed weather data:', {
            temperature: weatherData.temperature.celsius,
            humidity: weatherData.humidity,
            pressure: weatherData.pressure.hPa,
            lux: weatherData.light.lux,
            co2: weatherData.airQuality.co2,
            tvoc: weatherData.airQuality.gas,
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

  // Helper function to calculate battery percentage from voltage
  private calculateBatteryPercentage(voltage: number): number {
    if (voltage <= 0) return 0
    // Assuming 3.7V Li-ion battery: 3.2V (0%) to 4.2V (100%)
    const minVoltage = 3.2
    const maxVoltage = 4.2
    const percentage = Math.min(100, Math.max(0, ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100))
    return Math.round(percentage)
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

  // Get historical sensor data for analytics from the 'telemetry' node
  async getHistoricalData(limit: number = 50): Promise<WeatherData[]> {
    if (!hasFirebaseConfig || !db) {
      console.log('Firebase not configured, returning empty historical data')
      return []
    }

    try {
      console.log(`📈 Fetching last ${limit} historical records from 'telemetry' node...`)
      const telemetryRef = ref(db, 'telemetry')
      const historicalQuery = query(telemetryRef, orderByKey(), limitToLast(limit))

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

              if (record) {
                // Use the key as timestamp if it's a number, otherwise look for timestamp field
                let recordTimestamp: number
                if (!isNaN(Number(key))) {
                  // Key is a timestamp (like 1754380067)
                  recordTimestamp = Number(key) * 1000 // Convert to milliseconds
                } else if (record.timestamp) {
                  // Traditional timestamp field
                  recordTimestamp = record.timestamp * 1000
                } else {
                  // Fallback to current time
                  recordTimestamp = Date.now()
                }
                
                const isLive = this.isDataLive(recordTimestamp)

                console.log(`📅 Record key: ${key}, timestamp: ${recordTimestamp}, isLive: ${isLive}`)

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
                    co2: record.eCO2 || 0,
                    gas: record.TVOC || 0,
                    quality: record.status || 0,
                  },
                  light: {
                    lux: record.lux || 0,
                    ppm: record.lux || 0,
                  },
                  location: {
                    latitude: record.gps_latitude || 0,
                    longitude: record.gps_longitude || 0,
                    altitude: record.altitude || 0,
                  },
                  wind: {
                    speed: 0, // Calculate from GPS if available
                    direction: 0,
                  },
                  satellites: record.gps_satellites || record.satellites || record.sat_count || 0,
                  battery: {
                    voltage: record.battery_voltage || record.batteryVoltage || 0,
                    percentage: this.calculateBatteryPercentage(record.battery_voltage || record.batteryVoltage || 0),
                  },
                  timestamp: new Date(recordTimestamp).toLocaleTimeString(),
                  condition: this.getWeatherCondition(record.lux || 0),
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

  // Get historical data for specific time ranges (for Analytics tab)
  async getAnalyticsData(timeRange: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<WeatherData[]> {
    if (!hasFirebaseConfig || !db) {
      console.log('Firebase not configured, returning empty analytics data')
      return []
    }

    try {
      // Calculate time range limits
      const now = Date.now()
      let startTime: number
      let limit: number

      switch (timeRange) {
        case 'hour':
          startTime = now - (60 * 60 * 1000) // 1 hour ago
          limit = 60 // ~1 record per minute
          break
        case 'day':
          startTime = now - (24 * 60 * 60 * 1000) // 24 hours ago  
          limit = 144 // ~1 record per 10 minutes
          break
        case 'week':
          startTime = now - (7 * 24 * 60 * 60 * 1000) // 7 days ago
          limit = 168 // ~1 record per hour
          break
        case 'month':
          startTime = now - (30 * 24 * 60 * 60 * 1000) // 30 days ago
          limit = 720 // ~1 record per hour
          break
        default:
          startTime = now - (24 * 60 * 60 * 1000)
          limit = 144
      }

      console.log(`📊 Fetching analytics data for ${timeRange} (${limit} records max)`)
      console.log(`🕐 Time range: ${new Date(startTime).toLocaleString()} to ${new Date(now).toLocaleString()}`)

      const telemetryRef = ref(db, 'telemetry')
      const analyticsQuery = query(telemetryRef, orderByKey(), limitToLast(limit))

      return new Promise((resolve, reject) => {
        const unsubscribe = onValue(analyticsQuery, (snapshot) => {
          const data = snapshot.val()
          unsubscribe()

          console.log(`🔍 Raw analytics data from telemetry node (${timeRange}):`, data)

          if (data) {
            const analyticsData: WeatherData[] = []

            Object.entries(data).forEach(([key, record]: [string, any]) => {
              if (record) {
                // Use the key as timestamp if it's a number, otherwise look for timestamp field
                let recordTimestamp: number
                if (!isNaN(Number(key))) {
                  // Key is a timestamp (like 1754380067)
                  recordTimestamp = Number(key) * 1000 // Convert to milliseconds
                } else if (record.timestamp || record.time || record.date) {
                  let timestampValue = record.timestamp || record.time || record.date || record.created_at
                  
                  if (typeof timestampValue === 'string') {
                    recordTimestamp = new Date(timestampValue).getTime()
                  } else if (timestampValue > 1e12) {
                    recordTimestamp = timestampValue
                  } else if (timestampValue > 1e9) {
                    recordTimestamp = timestampValue * 1000
                  } else {
                    recordTimestamp = Date.now()
                  }
                } else {
                  recordTimestamp = Date.now()
                }

                // Filter by time range
                if (recordTimestamp >= startTime) {
                  const isLive = this.isDataLive(recordTimestamp)
                  
                  // Transform data with field patterns for your database structure
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
                      co2: record.eCO2 || 0,
                      gas: record.TVOC || 0,
                      quality: record.status || 0,
                    },
                    light: {
                      lux: record.lux || 0,
                      ppm: record.lux || 0,
                    },
                    location: {
                      latitude: record.gps_latitude || 0,
                      longitude: record.gps_longitude || 0,
                      altitude: record.altitude || 0,
                    },
                    wind: {
                      speed: 0,
                      direction: 0,
                    },
                    satellites: record.gps_satellites || record.satellites || record.sat_count || 0,
                    battery: {
                      voltage: record.battery_voltage || record.batteryVoltage || 0,
                      percentage: this.calculateBatteryPercentage(record.battery_voltage || record.batteryVoltage || 0),
                    },
                    timestamp: new Date(recordTimestamp).toLocaleTimeString(),
                    condition: this.getWeatherCondition(record.lux || 0),
                    isLive: isLive,
                    lastUpdate: recordTimestamp,
                    recordId: key
                  }
                  
                  analyticsData.push(weatherData)
                }
              }
            })

            // Sort by timestamp (oldest first for charts)
            analyticsData.sort((a, b) => (a.lastUpdate || 0) - (b.lastUpdate || 0))

            console.log(`📈 Analytics data ready: ${analyticsData.length} records for ${timeRange}`)
            console.log(`📊 Time span: ${analyticsData.length > 0 ? 
              `${new Date(analyticsData[0].lastUpdate || 0).toLocaleString()} to ${new Date(analyticsData[analyticsData.length - 1].lastUpdate || 0).toLocaleString()}` : 
              'No data'}`
            )
            
            resolve(analyticsData)
          } else {
            console.log(`❌ No analytics data available in telemetry node for ${timeRange}`)
            resolve([])
          }
        }, (error) => {
          console.error(`🚨 Analytics data fetch error from telemetry node (${timeRange}):`, error)
          reject(error)
        })
      })
    } catch (error) {
      console.error(`🚨 Error fetching analytics data from telemetry node (${timeRange}):`, error)
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
