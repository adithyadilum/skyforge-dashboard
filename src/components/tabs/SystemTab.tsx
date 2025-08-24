import { Battery, CheckCircle, AlertCircle, Clock, Flame } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { WeatherData } from "../../types/index"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

// Custom component to auto-center map when GPS coordinates change
function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, 15) // Auto-center with zoom level 15
  }, [center, map])
  
  return null
}

interface SystemTabProps {
  currentDateTime: Date
  weatherData?: WeatherData | null
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  uptimeSeconds: number
}

export default function SystemTab({ currentDateTime, weatherData, connectionStatus, uptimeSeconds }: SystemTabProps) {
  // Default location (landmark) when GPS coordinates are zero
  const defaultLocation: [number, number] = [6.7973, 79.9021]
  
  // Check if current GPS readings are zero or invalid
  const hasValidGPS = weatherData?.location?.latitude && 
                      weatherData?.location?.longitude && 
                      weatherData.location.latitude !== 0 && 
                      weatherData.location.longitude !== 0

  // Determine current position - use GPS if valid, otherwise use default landmark
  const currentPosition: [number, number] = hasValidGPS 
    ? [weatherData!.location!.latitude, weatherData!.location!.longitude]
    : defaultLocation

  // Get realistic altitude fallback based on GPS location
  const getAltitudeFallback = () => {
    // If we have valid GPS coordinates, use a location-based estimate
    const lat = weatherData?.location?.latitude
    const lng = weatherData?.location?.longitude
    
    // Sri Lanka typical elevation (your GPS coordinates suggest this region)
    if (lat && lng && lat >= 6 && lat <= 10 && lng >= 79 && lng <= 82) {
      return 150 // Typical elevation for Sri Lanka coastal/inland areas
    }
    
    return 142 // Default fallback
  }

  // Format uptime as HH:MM:SS
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get battery voltage with enhanced detection
  const getBatteryVoltage = (): { pack: string, cell: string, raw: number } => {
    let voltage = weatherData?.battery?.voltage || 0
    const raw = voltage
    // Voltage is already corrected in Firebase service (700mV offset applied)
    const cell = voltage > 0 ? (voltage / 3).toFixed(2) : '0.00'
    return { pack: voltage > 0 ? voltage.toFixed(2) : '0.00', cell, raw }
  }

  // Get battery percentage with color coding
  const getBatteryPercentage = (): number => {
    return weatherData?.battery?.percentage || 0
  }

  const getDataAge = () => {
    if (!weatherData?.lastUpdate) return 'Unknown'
    const ageMs = currentDateTime.getTime() - weatherData.lastUpdate
    const ageSeconds = Math.floor(ageMs / 1000)
    if (ageSeconds < 60) return `${ageSeconds}s ago`
    const ageMinutes = Math.floor(ageSeconds / 60)
    return `${ageMinutes}m ago`
  }

  const isDataFresh = () => {
    if (!weatherData?.lastUpdate) return false
    const ageMs = currentDateTime.getTime() - weatherData.lastUpdate
    return ageMs <= 15000 // Fresh if less than 15 seconds old
  }

  return (
    <div className="space-y-6">
      {/* System Header */}
      <Card className="shadow-lg shadow-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">System</h2>
        
          </div>
        </CardContent>
      </Card>

      {/* Firebase Connection Status */}
      <Card className="shadow-md shadow-gray-200/40">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
               Firebase Connection Status
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Connection Status:</span>
              <span className={`font-semibold flex items-center gap-1 ${connectionStatus === 'connected' ? 'text-green-600' :
                  connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                {connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> LIVE
                  </>
                ) : connectionStatus === 'connecting' ? (
                  <>
                    <Clock className="w-4 h-4 animate-pulse" /> Connecting
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> OFFLINE
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Data Source:</span>
              <span className="font-semibold text-gray-900">telemetry</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Last Data Update:</span>
              <span className={`font-semibold ${isDataFresh() ? 'text-green-600' : 'text-red-600'}`}>
                {getDataAge()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Update Interval:</span>
              <span className="font-semibold text-gray-900">~1 seconds</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">ESP32 Status:</span>
              <span className={`font-semibold flex items-center gap-1 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                {connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Transmitting
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> Not Responding
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Data Freshness:</span>
              <span className={`font-semibold ${isDataFresh() ? 'text-green-600' : 'text-red-600'}`}>
                {isDataFresh() ? 'Fresh' : 'Stale'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Telemetry Panel */}
      <Card className="shadow-md shadow-gray-200/40">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Telemetry Panel (Live Data)</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section - Left Side */}
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-700 mb-3">Current Position</h4>
              <div className="h-48 rounded-lg relative overflow-hidden">
                <MapContainer
                  center={currentPosition}
                  zoom={15}
                  style={{ height: '12rem', width: '100%' }}
                  className="rounded-lg"
                >
                  <MapController center={currentPosition} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={currentPosition}>
                    <Popup>
                      {hasValidGPS ? (
                        <>
                          <div className="text-green-600 font-semibold">Live GPS Position</div>
                          Current Location: {currentPosition[0].toFixed(4)}°N, {currentPosition[1].toFixed(4)}°E
                          <br />
                          <span className="text-sm text-gray-500">Real-time drone position</span>
                        </>
                      ) : (
                        <>
                          <div className="text-blue-600 font-semibold">Default Landmark</div>
                          Location: {currentPosition[0].toFixed(4)}°N, {currentPosition[1].toFixed(4)}°E
                          <br />
                          <span className="text-sm text-gray-500">Waiting for GPS signal...</span>
                        </>
                      )}
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded z-[1000] ${hasValidGPS && connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {hasValidGPS && connectionStatus === 'connected' ? 'Live GPS' : 'GPS Offline'}
                </div>
              </div>
            </div>

            {/* Telemetry Data - Right Side */}
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-700 mb-3">Flight Data</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">GPS Location:</span>
                  <span className="font-semibold text-gray-900">
                    {weatherData?.location?.latitude?.toFixed(4) || '7.2901'}, {weatherData?.location?.longitude?.toFixed(4) || '80.6337'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">GPS Altitude:</span>
                  <span className="font-semibold text-gray-900">{weatherData?.location?.altitude || getAltitudeFallback()} m</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Satellites:</span>
                  <span className="font-semibold text-gray-900">{weatherData?.satellites !== undefined ? weatherData.satellites : 8} connected</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`font-semibold ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {connectionStatus === 'connected' ? 'Active' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Power & Signal Monitoring */}
      <Card className="shadow-md shadow-gray-200/40">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Battery className="w-5 h-5 text-green-500" />
              Power & Signal Monitoring
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Battery Voltage + Gauge */}
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Battery (3S LiPo)</div>
                {(() => {
                  const { pack, cell } = getBatteryVoltage()
                  const percentage = getBatteryPercentage()
                  return (
                    <div className="mb-2">
                      <div className="text-lg font-bold text-gray-900 text-center">{pack}V · {percentage}%</div>
                      <div className="text-xs text-gray-500 text-center">Cell: {cell}V · Range: 9.5V-12.6V</div>
                    </div>
                  )
                })()}
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getBatteryPercentage() > 50 ? 'bg-green-500' : getBatteryPercentage() > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${getBatteryPercentage()}%` }}
                  />
                </div>
              </div>
            </div>

            {/* NRF Link */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">NRF Link</div>
              <div className={`text-sm font-semibold flex items-center justify-center gap-1 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Disconnected
                  </>
                )}
              </div>
            </div>

            {/* Control Channel */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Control Channel</div>
              <div className="text-sm font-semibold text-gray-900">NRF24L01</div>
              <div className="text-xs text-gray-500">(2.4GHz)</div>
            </div>

            {/* Uplink Status */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Uplink Status</div>
              <div className={`text-sm font-semibold flex items-center justify-center gap-1 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                {connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Inactive
                  </>
                )}
              </div>
            </div>

            {/* Smart Uptime */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Uptime</div>
              <div className="text-lg font-bold text-gray-900">
                {formatUptime(uptimeSeconds)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {connectionStatus === 'connected' ? 'Online' : 'Last Session'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
