import { useState, useRef } from 'react'
import { GPSReading, DroneNavigation, calculateDroneNavigation, weatherDataToGPSReading, isValidGPSCoordinate } from '../lib/gpsUtils'
import { WeatherData } from '../types'

export interface GPSTrackingState {
  currentReading: GPSReading | null
  previousReading: GPSReading | null
  navigation: DroneNavigation | null
  isTracking: boolean
  trackingHistory: GPSReading[]
  error: string | null
}

export interface UseGPSTrackingOptions {
  maxHistorySize?: number
  minTimeInterval?: number // Minimum time between readings in seconds
  minDistance?: number // Minimum distance for valid movement in meters
}

/**
 * React hook for GPS tracking and navigation calculations
 */
export function useGPSTracking(options: UseGPSTrackingOptions = {}) {
  const {
    maxHistorySize = 100,
    minTimeInterval = 5, // 5 seconds minimum
    minDistance = 1 // 1 meter minimum
  } = options

  const [state, setState] = useState<GPSTrackingState>({
    currentReading: null,
    previousReading: null,
    navigation: null,
    isTracking: false,
    trackingHistory: [],
    error: null
  })

  const lastValidReading = useRef<GPSReading | null>(null)

  /**
   * Update GPS tracking with new weather data
   */
  const updateGPSTracking = (weatherData: WeatherData | null) => {
    if (!weatherData || !weatherData.location) {
      setState(prev => ({
        ...prev,
        error: 'No GPS data available'
      }))
      return
    }

    const { latitude, longitude } = weatherData.location

    // Validate GPS coordinates
    if (!isValidGPSCoordinate(latitude, longitude)) {
      setState(prev => ({
        ...prev,
        error: `Invalid GPS coordinates: ${latitude}, ${longitude}`
      }))
      return
    }

    try {
      const newReading = weatherDataToGPSReading(weatherData)

      setState(prev => {
        const prevReading = lastValidReading.current

        // Check if we have a previous reading to calculate navigation
        let navigation: DroneNavigation | null = null
        let error: string | null = null

        if (prevReading) {
          // Check minimum time interval
          const timeElapsed = (newReading.timestamp - prevReading.timestamp) / 1000
          
          if (timeElapsed >= minTimeInterval) {
            try {
              const calculatedNav = calculateDroneNavigation(prevReading, newReading)
              
              // Check minimum distance for valid movement
              if (calculatedNav.distance >= minDistance) {
                navigation = calculatedNav
                lastValidReading.current = newReading // Update reference only for valid movements
              } else {
                // Keep previous navigation data for short distances
                navigation = prev.navigation
                error = `Movement too small: ${calculatedNav.distance.toFixed(2)}m`
              }
            } catch (navError) {
              error = `Navigation calculation error: ${navError instanceof Error ? navError.message : 'Unknown error'}`
              navigation = prev.navigation // Keep previous navigation
            }
          } else {
            // Keep previous navigation data for frequent updates
            navigation = prev.navigation
            error = `Update too frequent: ${timeElapsed.toFixed(1)}s`
          }
        } else {
          // First reading - no navigation data yet
          lastValidReading.current = newReading
          error = 'Waiting for second GPS reading to calculate navigation'
        }

        // Update history
        const newHistory = [...prev.trackingHistory, newReading]
        if (newHistory.length > maxHistorySize) {
          newHistory.shift() // Remove oldest entry
        }

        return {
          currentReading: newReading,
          previousReading: prevReading,
          navigation,
          isTracking: true,
          trackingHistory: newHistory,
          error
        }
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `GPS processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }))
    }
  }

  /**
   * Reset GPS tracking
   */
  const resetTracking = () => {
    setState({
      currentReading: null,
      previousReading: null,
      navigation: null,
      isTracking: false,
      trackingHistory: [],
      error: null
    })
    lastValidReading.current = null
  }

  /**
   * Get formatted navigation data for display
   */
  const getFormattedNavigation = () => {
    if (!state.navigation) return null

    return {
      speed: {
        ms: `${state.navigation.speed} m/s`,
        kmh: `${state.navigation.speedKmh} km/h`,
        knots: `${state.navigation.speedKnots} knots`
      },
      course: {
        degrees: `${state.navigation.course}°`,
        cardinal: state.navigation.courseCardinal,
        formatted: `${state.navigation.course}° ${state.navigation.courseCardinal}`
      },
      distance: `${state.navigation.distance} m`,
      timeElapsed: `${state.navigation.timeElapsed} s`
    }
  }

  /**
   * Get current GPS position
   */
  const getCurrentPosition = () => {
    if (!state.currentReading) return null

    return {
      latitude: state.currentReading.latitude,
      longitude: state.currentReading.longitude,
      timestamp: new Date(state.currentReading.timestamp).toISOString()
    }
  }

  /**
   * Get tracking statistics
   */
  const getTrackingStats = () => {
    const { trackingHistory } = state

    if (trackingHistory.length < 2) {
      return {
        totalPoints: trackingHistory.length,
        totalDistance: 0,
        totalTime: 0,
        averageSpeed: 0,
        maxSpeed: 0
      }
    }

    let totalDistance = 0
    let maxSpeed = 0
    const speeds: number[] = []

    for (let i = 1; i < trackingHistory.length; i++) {
      try {
        const nav = calculateDroneNavigation(trackingHistory[i - 1], trackingHistory[i])
        totalDistance += nav.distance
        speeds.push(nav.speed)
        maxSpeed = Math.max(maxSpeed, nav.speed)
      } catch (error) {
        // Skip invalid calculations
      }
    }

    const totalTime = (trackingHistory[trackingHistory.length - 1].timestamp - trackingHistory[0].timestamp) / 1000
    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0

    return {
      totalPoints: trackingHistory.length,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalTime: Math.round(totalTime * 10) / 10,
      averageSpeed: Math.round(averageSpeed * 100) / 100,
      maxSpeed: Math.round(maxSpeed * 100) / 100
    }
  }

  return {
    ...state,
    updateGPSTracking,
    resetTracking,
    getFormattedNavigation,
    getCurrentPosition,
    getTrackingStats
  }
}
