export interface WeatherData {
  temperature: {
    celsius: number
    fahrenheit: number
    feelsLike: number
  }
  humidity: number
  pressure: {
    hPa: number
    altitude: number
  }
  uvIndex: {
    value: number
    level: string
  }
  airQuality: {
    co2: number
    gas: number
    quality: number
  }
  light: {
    lux: number
    ppm: number
  }
  location: {
    latitude: number
    longitude: number
    altitude: number
  }
  wind: {
    speed: number
    direction: number
  }
  satellites: number
  timestamp: string
  condition: string
  isLive?: boolean
  lastUpdate?: number
  recordId?: string
}
