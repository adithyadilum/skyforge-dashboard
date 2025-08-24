/**
 * GPS Utility Functions for calculating speed and course from GPS readings
 */

export interface GPSReading {
  latitude: number
  longitude: number
  timestamp: number // Unix timestamp in milliseconds
}

export interface DroneNavigation {
  speed: number // Speed in m/s
  speedKmh: number // Speed in km/h
  speedKnots: number // Speed in knots
  course: number // Course in degrees (0-360, where 0/360 is North)
  courseCardinal: string // Cardinal direction (N, NE, E, SE, S, SW, W, NW)
  distance: number // Distance traveled in meters
  timeElapsed: number // Time elapsed in seconds
}

/**
 * Calculate the distance between two GPS coordinates using the Haversine formula
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Distance in meters
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180 // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Calculate the initial bearing (course) from one GPS coordinate to another
 * @param lat1 Latitude of first point in decimal degrees
 * @param lon1 Longitude of first point in decimal degrees
 * @param lat2 Latitude of second point in decimal degrees
 * @param lon2 Longitude of second point in decimal degrees
 * @returns Bearing in degrees (0-360, where 0/360 is North)
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

  const θ = Math.atan2(y, x)

  // Convert to degrees and normalize to 0-360
  return (θ * 180 / Math.PI + 360) % 360
}

/**
 * Convert degrees to cardinal direction
 * @param degrees Bearing in degrees (0-360)
 * @returns Cardinal direction string
 */
export function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Calculate speed and course from two GPS readings
 * @param reading1 First GPS reading (older)
 * @param reading2 Second GPS reading (newer)
 * @returns DroneNavigation object with speed and course data
 */
export function calculateDroneNavigation(reading1: GPSReading, reading2: GPSReading): DroneNavigation {
  // Validate inputs
  if (!reading1 || !reading2) {
    throw new Error('Both GPS readings are required')
  }

  if (reading2.timestamp <= reading1.timestamp) {
    throw new Error('Second reading must be newer than first reading')
  }

  // Calculate time difference in seconds
  const timeElapsed = (reading2.timestamp - reading1.timestamp) / 1000

  if (timeElapsed <= 0) {
    throw new Error('Time elapsed must be positive')
  }

  // Calculate distance between points
  const distance = calculateDistance(
    reading1.latitude, reading1.longitude,
    reading2.latitude, reading2.longitude
  )

  // Calculate speed in m/s
  const speed = distance / timeElapsed

  // Convert speed to different units
  const speedKmh = speed * 3.6 // m/s to km/h
  const speedKnots = speed * 1.94384 // m/s to knots

  // Calculate course (bearing)
  const course = calculateBearing(
    reading1.latitude, reading1.longitude,
    reading2.latitude, reading2.longitude
  )

  // Get cardinal direction
  const courseCardinal = degreesToCardinal(course)

  return {
    speed: Math.round(speed * 100) / 100, // Round to 2 decimal places
    speedKmh: Math.round(speedKmh * 100) / 100,
    speedKnots: Math.round(speedKnots * 100) / 100,
    course: Math.round(course * 10) / 10, // Round to 1 decimal place
    courseCardinal,
    distance: Math.round(distance * 100) / 100,
    timeElapsed: Math.round(timeElapsed * 10) / 10
  }
}

/**
 * Convert WeatherData to GPSReading format
 * @param weatherData WeatherData object containing GPS information
 * @returns GPSReading object
 */
export function weatherDataToGPSReading(weatherData: any): GPSReading {
  const timestamp = weatherData.lastUpdate || new Date(weatherData.timestamp).getTime()
  
  return {
    latitude: weatherData.location.latitude,
    longitude: weatherData.location.longitude,
    timestamp: timestamp
  }
}

/**
 * Calculate average speed over multiple GPS readings
 * @param readings Array of GPS readings (must be sorted by timestamp)
 * @returns Average speed in m/s
 */
export function calculateAverageSpeed(readings: GPSReading[]): number {
  if (readings.length < 2) {
    return 0
  }

  let totalDistance = 0
  let totalTime = 0

  for (let i = 1; i < readings.length; i++) {
    const distance = calculateDistance(
      readings[i - 1].latitude, readings[i - 1].longitude,
      readings[i].latitude, readings[i].longitude
    )
    const time = (readings[i].timestamp - readings[i - 1].timestamp) / 1000

    if (time > 0) {
      totalDistance += distance
      totalTime += time
    }
  }

  return totalTime > 0 ? totalDistance / totalTime : 0
}

/**
 * Validate GPS coordinates
 * @param latitude Latitude in decimal degrees
 * @param longitude Longitude in decimal degrees
 * @returns True if coordinates are valid
 */
export function isValidGPSCoordinate(latitude: number, longitude: number): boolean {
  return (
    !isNaN(latitude) && !isNaN(longitude) &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    latitude !== 0 && longitude !== 0 // Exclude null island
  )
}
