import { WeatherData } from '../types'

export class FirebaseService {
  private statusCallback?: (status: 'connected' | 'disconnected' | 'connecting') => void

  setConnectionStatusCallback(callback: (status: 'connected' | 'disconnected' | 'connecting') => void) {
    this.statusCallback = callback
    // Mock connection - simulate connecting then connected
    this.updateStatus('connecting')
    setTimeout(() => {
      this.updateStatus('connected')
    }, 1000)
  }

  private updateStatus(status: 'connected' | 'disconnected' | 'connecting') {
    if (this.statusCallback) {
      this.statusCallback(status)
    }
  }

  private getUvLevel(uvIndex: number): string {
    if (uvIndex <= 2) return 'Low'
    if (uvIndex <= 5) return 'Moderate'
    if (uvIndex <= 7) return 'High'
    if (uvIndex <= 10) return 'Very High'
    return 'Extreme'
  }

  private celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32
  }

  subscribeToWeatherData(callback: (data: WeatherData | null) => void): () => void {
    // Generate mock data that resembles real sensor data
    const generateMockData = (): WeatherData => {
      const now = new Date().toISOString()
      const tempC = 25.0 + (Math.random() - 0.5) * 10 // 20-30°C range
      const uvValue = Math.max(0, Math.min(11, 3 + (Math.random() - 0.5) * 4))
      const batteryVoltage = 11.8 + Math.random() * 0.8 // 11.8-12.6V (3S LiPo range)
      
      return {
        timestamp: now,
        temperature: {
          celsius: tempC,
          fahrenheit: this.celsiusToFahrenheit(tempC),
          feelsLike: tempC + (Math.random() - 0.5) * 2
        },
        humidity: 60 + (Math.random() - 0.5) * 20, // 50-70% range
        pressure: { 
          hPa: 1013 + (Math.random() - 0.5) * 20, // 1003-1023 hPa
          altitude: 100 + (Math.random() - 0.5) * 50 // 75-125m
        },
        battery: {
          voltage: batteryVoltage,
          percentage: Math.max(0, Math.min(100, ((batteryVoltage - 9.6) / (12.6 - 9.6)) * 100)),
          cellVoltage: batteryVoltage / 3 // 3S pack
        },
        uvIndex: {
          value: uvValue,
          level: this.getUvLevel(uvValue)
        },
        airQuality: {
          co2: 400 + Math.random() * 200, // 400-600 ppm
          gas: Math.random() * 1000,
          quality: Math.floor(Math.random() * 5) + 1 // 1-5 scale
        },
        light: {
          lux: 800 + (Math.random() - 0.5) * 300, // 650-950 lux
          ppm: Math.random() * 50
        },
        wind: {
          speed: Math.random() * 15, // 0-15 m/s
          direction: Math.floor(Math.random() * 360) // 0-359 degrees
        },
        satellites: Math.floor(Math.random() * 8) + 4, // 4-12 satellites
        location: { 
          latitude: 6.9271 + (Math.random() - 0.5) * 0.001, // Small GPS variation
          longitude: 79.8612 + (Math.random() - 0.5) * 0.001,
          altitude: 100 + (Math.random() - 0.5) * 10
        },
        condition: Math.random() < 0.8 ? 'Clear' : 'Cloudy',
        isLive: true
      }
    }

    // Send initial data
    setTimeout(() => {
      callback(generateMockData())
    }, 500)

    // Update data every 5 seconds with slight variations
    const interval = setInterval(() => {
      callback(generateMockData())
    }, 5000)

    // Return cleanup function
    return () => {
      clearInterval(interval)
    }
  }

  subscribeToHistoricalData(hours: number, callback: (data: WeatherData[]) => void): () => void {
    // Generate mock historical data
    const generateHistoricalData = (): WeatherData[] => {
      const data: WeatherData[] = []
      const pointCount = Math.min(hours * 2, 48) // Max 48 points, one every 30 minutes
      
      for (let i = pointCount; i >= 0; i--) {
        const timestamp = new Date(Date.now() - (i * 30 * 60 * 1000)).toISOString()
        const tempC = 25.0 + (Math.random() - 0.5) * 8
        const uvValue = Math.max(0, Math.min(11, 3 + (Math.random() - 0.5) * 3))
        const batteryVoltage = 11.8 + Math.random() * 0.8
        
        data.push({
          timestamp,
          temperature: {
            celsius: tempC,
            fahrenheit: this.celsiusToFahrenheit(tempC),
            feelsLike: tempC + (Math.random() - 0.5) * 2
          },
          humidity: 60 + (Math.random() - 0.5) * 20,
          pressure: { hPa: 1013 + (Math.random() - 0.5) * 15, altitude: 100 },
          battery: {
            voltage: batteryVoltage,
            percentage: Math.max(0, Math.min(100, ((batteryVoltage - 9.6) / (12.6 - 9.6)) * 100)),
            cellVoltage: batteryVoltage / 3
          },
          uvIndex: {
            value: uvValue,
            level: this.getUvLevel(uvValue)
          },
          airQuality: {
            co2: 400 + Math.random() * 200,
            gas: Math.random() * 1000,
            quality: Math.floor(Math.random() * 5) + 1
          },
          light: {
            lux: 800 + (Math.random() - 0.5) * 200,
            ppm: Math.random() * 50
          },
          wind: {
            speed: Math.random() * 12,
            direction: Math.floor(Math.random() * 360)
          },
          satellites: Math.floor(Math.random() * 8) + 4,
          location: { latitude: 6.9271, longitude: 79.8612, altitude: 100 },
          condition: Math.random() < 0.9 ? 'Clear' : 'Cloudy',
          isLive: false
        })
      }
      
      return data
    }

    setTimeout(() => {
      callback(generateHistoricalData())
    }, 300)

    return () => {} // No cleanup needed for one-time data
  }

  subscribeToAnalyticsData(days: number, callback: (data: WeatherData[]) => void): () => void {
    // Generate mock analytics data (daily summaries)
    const generateAnalyticsData = (): WeatherData[] => {
      const data: WeatherData[] = []
      const dayCount = Math.min(days, 30) // Max 30 days
      
      for (let i = dayCount; i >= 0; i--) {
        const timestamp = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
        const tempC = 24.0 + (Math.random() - 0.5) * 6 // Daily average temp
        const uvValue = Math.max(0, Math.min(11, 4 + (Math.random() - 0.5) * 2))
        const batteryVoltage = 12.0 + (Math.random() - 0.5) * 0.4 // Daily average battery
        
        data.push({
          timestamp,
          temperature: {
            celsius: tempC,
            fahrenheit: this.celsiusToFahrenheit(tempC),
            feelsLike: tempC + (Math.random() - 0.5) * 1
          },
          humidity: 62 + (Math.random() - 0.5) * 15,
          pressure: { hPa: 1013 + (Math.random() - 0.5) * 10, altitude: 100 },
          battery: {
            voltage: batteryVoltage,
            percentage: Math.max(0, Math.min(100, ((batteryVoltage - 9.6) / (12.6 - 9.6)) * 100)),
            cellVoltage: batteryVoltage / 3
          },
          uvIndex: {
            value: uvValue,
            level: this.getUvLevel(uvValue)
          },
          airQuality: {
            co2: 400 + Math.random() * 150,
            gas: Math.random() * 800,
            quality: Math.floor(Math.random() * 4) + 2 // 2-5 scale for daily avg
          },
          light: {
            lux: 850 + (Math.random() - 0.5) * 150,
            ppm: Math.random() * 40
          },
          wind: {
            speed: Math.random() * 8, // Daily average wind
            direction: Math.floor(Math.random() * 360)
          },
          satellites: Math.floor(Math.random() * 6) + 6, // Better average for daily
          location: { latitude: 6.9271, longitude: 79.8612, altitude: 100 },
          condition: Math.random() < 0.7 ? 'Clear' : 'Cloudy',
          isLive: false
        })
      }
      
      return data
    }

    setTimeout(() => {
      callback(generateAnalyticsData())
    }, 400)

    return () => {} // No cleanup needed for one-time data
  }

  unsubscribeAll() {
    // Mock cleanup - in real implementation would unsubscribe from Firebase
    this.updateStatus('disconnected')
  }
}

export const firebaseService = new FirebaseService()
