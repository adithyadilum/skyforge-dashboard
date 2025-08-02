import { Battery, Cpu, CheckCircle, AlertCircle, Clock, Flame } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { WeatherData } from "../types"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface SystemTabProps {
  currentDateTime: Date
  systemData?: any
  weatherData?: WeatherData | null
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
}

export default function SystemTab({ currentDateTime, systemData, weatherData, connectionStatus }: SystemTabProps) {
  const getDataAge = () => {
    if (!weatherData?.lastUpdate) return 'Unknown'
    const ageMs = Date.now() - weatherData.lastUpdate
    const ageSeconds = Math.floor(ageMs / 1000)
    if (ageSeconds < 60) return `${ageSeconds}s ago`
    const ageMinutes = Math.floor(ageSeconds / 60)
    return `${ageMinutes}m ago`
  }

  const isDataFresh = () => {
    if (!weatherData?.lastUpdate) return false
    const ageMs = Date.now() - weatherData.lastUpdate
    return ageMs <= 15000 // Fresh if less than 15 seconds old
  }

  // Helper functions to check sensor status
  const isAHT21Working = () => {
    // Log all weatherData for debugging
    console.log('Full weatherData object:', weatherData)
    
    // Check if we have valid temperature and humidity data
    const hasTemp = weatherData?.temperature?.celsius !== undefined && 
                   weatherData?.temperature?.celsius !== null &&
                   weatherData.temperature.celsius !== 0 && 
                   !isNaN(weatherData.temperature.celsius) &&
                   weatherData.temperature.celsius > -50 && 
                   weatherData.temperature.celsius < 100
    const hasHumidity = weatherData?.humidity !== undefined &&
                       weatherData?.humidity !== null &&
                       weatherData.humidity !== 0 && 
                       !isNaN(weatherData.humidity) &&
                       weatherData.humidity >= 0 &&
                       weatherData.humidity <= 100
    
    console.log('AHT21 Status Check:', { 
      connectionStatus,
      temp: weatherData?.temperature?.celsius, 
      humidity: weatherData?.humidity, 
      hasTemp, 
      hasHumidity,
      finalStatus: hasTemp && hasHumidity
    })
    
    return hasTemp && hasHumidity
  }

  const isENS160Working = () => {
    // Check if we have valid CO2 data
    const hasCO2 = weatherData?.airQuality?.co2 !== undefined &&
                   weatherData?.airQuality?.co2 !== null &&
                   weatherData.airQuality.co2 !== 0 && 
                   !isNaN(weatherData.airQuality.co2) &&
                   weatherData.airQuality.co2 > 0 &&
                   weatherData.airQuality.co2 < 10000
    
    console.log('ENS160 Status Check:', { 
      connectionStatus,
      airQuality: weatherData?.airQuality,
      co2: weatherData?.airQuality?.co2, 
      hasCO2,
      finalStatus: hasCO2
    })
    
    return hasCO2
  }

  // Additional sensor status functions
  const isMPU6050Working = () => {
    // Check if we have valid accelerometer/gyroscope data (assuming these would be in systemData)
    const hasAccel = systemData?.accelerometer || systemData?.accel || 
                    (systemData?.ax !== undefined && systemData?.ay !== undefined && systemData?.az !== undefined)
    const hasGyro = systemData?.gyroscope || systemData?.gyro ||
                   (systemData?.gx !== undefined && systemData?.gy !== undefined && systemData?.gz !== undefined)
    
    console.log('MPU6050 Status Check:', { systemData, hasAccel, hasGyro })
    return !!(hasAccel || hasGyro)
  }

  const isBME280Working = () => {
    // Check if we have valid pressure data
    const hasPressure = weatherData?.pressure?.hPa !== undefined &&
                       weatherData?.pressure?.hPa !== null &&
                       weatherData.pressure.hPa !== 0 &&
                       !isNaN(weatherData.pressure.hPa) &&
                       weatherData.pressure.hPa > 800 &&
                       weatherData.pressure.hPa < 1200
    
    console.log('BME280 Status Check:', { pressure: weatherData?.pressure?.hPa, hasPressure })
    return hasPressure
  }

  const isUVSensorWorking = () => {
    // Check if we have valid UV index data
    const hasUV = weatherData?.uvIndex?.value !== undefined &&
                  weatherData?.uvIndex?.value !== null &&
                  weatherData.uvIndex.value !== 0 &&
                  !isNaN(weatherData.uvIndex.value) &&
                  weatherData.uvIndex.value >= 0 &&
                  weatherData.uvIndex.value <= 15
    
    console.log('UV Sensor Status Check:', { uv: weatherData?.uvIndex?.value, hasUV })
    return hasUV
  }

  const isBH1750Working = () => {
    // Check if we have valid light data
    const hasLight = weatherData?.light?.lux !== undefined &&
                    weatherData?.light?.lux !== null &&
                    weatherData.light.lux !== 0 &&
                    !isNaN(weatherData.light.lux) &&
                    weatherData.light.lux >= 0
    
    console.log('BH1750 Status Check:', { light: weatherData?.light?.lux, hasLight })
    return hasLight
  }

  const isVL53L0XWorking = () => {
    // Check if we have valid distance sensor data
    const hasDistance = systemData?.distance || systemData?.distances ||
                       (systemData?.dist1 !== undefined || systemData?.dist2 !== undefined ||
                        systemData?.dist3 !== undefined || systemData?.dist4 !== undefined)
    
    console.log('VL53L0X Status Check:', { systemData, hasDistance })
    return !!hasDistance
  }

  const isGPSWorking = () => {
    // Check if we have valid GPS coordinates
    const hasGPS = weatherData?.location?.latitude !== undefined &&
                   weatherData?.location?.longitude !== undefined &&
                   weatherData.location.latitude !== 0 &&
                   weatherData.location.longitude !== 0 &&
                   !isNaN(weatherData.location.latitude) &&
                   !isNaN(weatherData.location.longitude) &&
                   Math.abs(weatherData.location.latitude) <= 90 &&
                   Math.abs(weatherData.location.longitude) <= 180
    
    console.log('GPS Status Check:', { 
      lat: weatherData?.location?.latitude, 
      lon: weatherData?.location?.longitude, 
      satellites: weatherData?.satellites,
      hasGPS 
    })
    return hasGPS
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
              <span className="font-semibold text-gray-900">sensor_data</span>
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
                  center={[weatherData?.location?.latitude || 7.2901, weatherData?.location?.longitude || -80.6337]}
                  zoom={13}
                  style={{ height: '12rem', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[weatherData?.location?.latitude || 7.2901, weatherData?.location?.longitude || -80.6337]}>
                    <Popup>
                      Current Location: {weatherData?.location?.latitude?.toFixed(4) || '7.2901'}°N, {Math.abs(weatherData?.location?.longitude || -80.6337).toFixed(4)}°E
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded z-[1000] ${connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {connectionStatus === 'connected' ? 'Live GPS' : 'GPS Offline'}
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
                  <span className="font-semibold text-gray-900">{weatherData?.location?.altitude || 142} m</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Satellites:</span>
                  <span className="font-semibold text-gray-900">{weatherData?.satellites || 8} connected</span>
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
            {/* Battery Voltage */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Battery Voltage</div>
              <div className="text-lg font-bold text-gray-900">
                {systemData?.batteryVoltage?.toFixed(1) || '11.7'} V
              </div>
            </div>

            {/* NRF Link */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">NRF Link</div>
              <div className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Connected
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
              <div className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Active
              </div>
            </div>

            {/* Uptime */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Uptime</div>
              <div className="text-lg font-bold text-gray-900">
                {systemData?.uptime || '00:13:22'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor & System Health */}
      <Card className="shadow-md shadow-gray-200/40">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              Sensor & System Health
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">MPU6050:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isMPU6050Working() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isMPU6050Working() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> OK
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> NO
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">BME280:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isBME280Working() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isBME280Working() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> OK
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> NO
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">UV Sensor:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isUVSensorWorking() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isUVSensorWorking() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> OK
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> NO
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">BH1750:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isBH1750Working() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isBH1750Working() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> OK
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> NO
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">VL53L0X Array:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isVL53L0XWorking() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isVL53L0XWorking() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> All 4 Online
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> Offline
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">GPS Module:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isGPSWorking() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isGPSWorking() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Lock Acquired
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> No Lock
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">AHT21:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isAHT21Working() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isAHT21Working() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> OK
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> NO
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">ENS160:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                isENS160Working() ? 'text-green-600' : 'text-red-600'
              }`}>
                {isENS160Working() ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> OK
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" /> NO
                  </>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
