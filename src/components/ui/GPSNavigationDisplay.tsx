import { Card, CardContent } from './card'
import { Navigation, MapPin, Clock, Gauge } from 'lucide-react'
import { useGPSTracking } from '../../hooks/useGPSTracking'

interface GPSNavigationDisplayProps {
  gpsTracking: ReturnType<typeof useGPSTracking>
  className?: string
}

export default function GPSNavigationDisplay({ gpsTracking, className = '' }: GPSNavigationDisplayProps) {
  const { navigation, isTracking, error, getFormattedNavigation, getCurrentPosition, getTrackingStats } = gpsTracking

  const formattedNav = getFormattedNavigation()
  const currentPos = getCurrentPosition()
  const stats = getTrackingStats()

  if (!isTracking) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Navigation className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-600">GPS Navigation</h3>
          </div>
          <div className="text-center py-4">
            <div className="text-gray-500">No GPS tracking data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">GPS Navigation</h3>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {error && !navigation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="text-yellow-800 text-sm">{error}</div>
          </div>
        )}

        {/* Current Position */}
        {currentPos && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-medium text-gray-900">Current Position</span>
            </div>
            <div className="text-sm text-gray-600">
              <div>Lat: {currentPos.latitude.toFixed(6)}°</div>
              <div>Lon: {currentPos.longitude.toFixed(6)}°</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(currentPos.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Data */}
        {formattedNav && (
          <div className="space-y-4">
            {/* Speed Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-900">Speed</span>
                </div>
                <div className="text-lg font-bold text-blue-900">{formattedNav.speed.kmh}</div>
                <div className="text-xs text-blue-600">
                  {formattedNav.speed.ms} | {formattedNav.speed.knots}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-900">Course</span>
                </div>
                <div className="text-lg font-bold text-green-900">{formattedNav.course.cardinal}</div>
                <div className="text-xs text-green-600">{formattedNav.course.degrees}</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-900">Distance</span>
                </div>
                <div className="text-lg font-bold text-purple-900">{formattedNav.distance}</div>
                <div className="text-xs text-purple-600">in {formattedNav.timeElapsed}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Statistics */}
        {stats.totalPoints > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Tracking Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Points</div>
                <div className="font-semibold">{stats.totalPoints}</div>
              </div>
              <div>
                <div className="text-gray-500">Total Distance</div>
                <div className="font-semibold">{stats.totalDistance} m</div>
              </div>
              <div>
                <div className="text-gray-500">Avg Speed</div>
                <div className="font-semibold">{stats.averageSpeed} m/s</div>
              </div>
              <div>
                <div className="text-gray-500">Max Speed</div>
                <div className="font-semibold">{stats.maxSpeed} m/s</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && navigation && (
          <div className="mt-3 text-xs text-yellow-600 bg-yellow-50 rounded p-2">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
