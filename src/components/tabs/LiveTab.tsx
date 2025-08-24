import { useState } from "react"
import { Sun, Thermometer, Droplets, Gauge, Wind, Satellite, Mountain, ChevronDown } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import UvGauge from "../ui/UvGauge"
import { WeatherData } from "../../types/index"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom component to auto-center map when GPS coordinates change
function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, 15) // Auto-center with zoom level 15
  }, [center, map])
  
  return null
}

interface LiveTabProps {
  weatherData: WeatherData
  gpsTracking?: any // GPS tracking data from useGPSTracking hook
}

export default function LiveTab({ weatherData, gpsTracking }: LiveTabProps) {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

  // Default location (landmark) when GPS coordinates are zero
  const defaultLocation: [number, number] = [6.7973, 79.9021]
  
  // Check if current GPS readings are zero or invalid
  const hasValidGPS = weatherData?.location?.latitude && 
                      weatherData?.location?.longitude && 
                      weatherData.location.latitude !== 0 && 
                      weatherData.location.longitude !== 0

  // Determine current position - use GPS if valid, otherwise use default landmark
  const currentPosition: [number, number] = hasValidGPS 
    ? [weatherData.location.latitude, weatherData.location.longitude]
    : defaultLocation

  // Unit conversion functions
  // Get realistic altitude fallback based on GPS location
  const getAltitudeFallback = () => {
    // If we have valid GPS coordinates, use a location-based estimate
    const lat = weatherData.location.latitude
    const lng = weatherData.location.longitude
    
    // Sri Lanka typical elevation (your GPS coordinates suggest this region)
    if (lat >= 6 && lat <= 10 && lng >= 79 && lng <= 82) {
      return 150 // Typical elevation for Sri Lanka coastal/inland areas
    }
    
    return 142 // Default fallback
  }

  const convertTemperature = (celsius: number) => {
    return units === 'metric' ? celsius : (celsius * 9/5) + 32
  }

  const convertSpeed = (kmh: number) => {
    return units === 'metric' ? kmh : kmh * 0.621371
  }

  const convertAltitude = (meters: number) => {
    return units === 'metric' ? meters : meters * 3.28084
  }

  // Format altitude with sensible precision (show 1 decimal for smaller values)
  const formatAltitude = (rawMeters: number) => {
    const converted = convertAltitude(rawMeters)
    // Decide precision: finer detail for low altitude
    const precision = converted < (units === 'metric' ? 100 : 300) ? 1 : 0
    return converted.toFixed(precision)
  }

  const convertPressure = (hPa: number) => {
    return units === 'metric' ? hPa : hPa * 0.02953
  }

  const getTemperatureUnit = () => units === 'metric' ? '°C' : '°F'
  const getSpeedUnit = () => units === 'metric' ? 'km/h' : 'mph'
  const getAltitudeUnit = () => units === 'metric' ? 'm' : 'ft'
  const getPressureUnit = () => units === 'metric' ? 'hPa' : 'inHg'

  return (
    <div className="space-y-4">
      {/* Live Tab Header */}
      <Card className="shadow-lg shadow-gray-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Live</h2>
            {/* Units Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Units:</span>
              <div className="relative">
                <select 
                  value={units}
                  onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main Weather Display */}
      <div className="lg:col-span-2">
        <Card className="mb-4 shadow-lg shadow-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Thermometer className="w-12 h-12 text-blue-500" />
                <span className="text-3xl text-gray-600">Temperature</span>
              </div>
              <div className="text-4xl font-semibold text-gray-900">
                {convertTemperature(weatherData.temperature.celsius).toFixed(1)}{getTemperatureUnit()}
              </div>
              <div className="text-base font-light text-gray-600 mb-1">
                Feels like {convertTemperature(weatherData.temperature.feelsLike).toFixed(1)}{getTemperatureUnit()}
              </div>
                  
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600">Light intensity</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{weatherData.light.lux} lx</div>
                <div className="text-sm text-gray-600">{weatherData.condition}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Humidity</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">{weatherData.humidity}%</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Gauge className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Pressure</span>
              </div>
              {/*<div className="text-base font-semibold text-gray-900">
                {formatAltitude(weatherData.pressure.altitude || getAltitudeFallback())}{getAltitudeUnit()}
              </div>*/}
              <div className="text-xl font-semibold text-gray-900">
                {convertPressure(weatherData.pressure.hPa).toFixed(units === 'metric' ? 0 : 2)} {getPressureUnit()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="w-5 h-5 text-orange-500" />
                <span className="text-gray-600">UV Index</span>
              </div>
              <div className="flex flex-col items-center">
                <UvGauge value={weatherData.uvIndex.value} />
                <span className="mt-1 text-gray-600 text-xs">
                   {weatherData.uvIndex.level}
                </span>
              </div>
             </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mountain className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Altitude</span>
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {formatAltitude(weatherData.location.altitude || getAltitudeFallback())} {getAltitudeUnit()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Air Quality</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">Gas</div>
                  <div className="text-sm font-semibold text-gray-900">{weatherData.airQuality.gas}</div>
                  <div className="text-xs text-gray-500">TVOC</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">CO₂</div>
                  <div className="text-sm font-semibold text-gray-900">{weatherData.airQuality.co2}</div>
                  <div className="text-xs text-gray-500">ppm</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-3">
        {/* Map Card */}
        <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="h-48 rounded-lg overflow-hidden relative">
              <MapContainer
                center={currentPosition}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <MapController center={currentPosition} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={currentPosition}>
                  <Popup>
                    {hasValidGPS ? (
                      <>
                        <div className="text-green-600 font-semibold">Live Drone Position</div>
                        Sensor Location: {currentPosition[0].toFixed(4)}°N, {Math.abs(currentPosition[1]).toFixed(4)}°E
                        <br />
                        <span className="text-sm text-gray-500">Real-time GPS tracking</span>
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
              {/* GPS Status Indicator */}
              <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded z-[1000] ${hasValidGPS ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                {hasValidGPS ? 'Live GPS' : 'Default Location'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation & Status */}
        <div className="flex flex-col gap-2">
          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
           <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                </div>
               <span className="text-sm text-gray-600">Course</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {gpsTracking?.navigation?.course ? `${gpsTracking.navigation.course.toFixed(1)}°` : `${weatherData.wind.direction}°`}
                </div>
                {gpsTracking?.navigation?.courseCardinal && (
                  <div className="text-xs text-gray-500">{gpsTracking.navigation.courseCardinal}</div>
                )}
              </div>
           </div>
         </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-3">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
               <div className="w-2.5 h-0.5 bg-gray-600 rounded"></div>
               </div>
                <span className="text-sm text-gray-600">Speed</span>
               </div>
               <div className="text-right">
                <div className="text-lg font-semibold">
                  {gpsTracking?.navigation?.speedKmh ? 
                    `${gpsTracking.navigation.speedKmh.toFixed(1)} ${units === 'metric' ? 'km/h' : 'mph'}` : 
                    `${convertSpeed(weatherData.wind.speed).toFixed(1)} ${getSpeedUnit()}`
                  }
                </div>
                {gpsTracking?.navigation?.speed && (
                  <div className="text-xs text-gray-500">{gpsTracking.navigation.speed.toFixed(1)} m/s</div>
                )}
               </div>
             </div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-3">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                <Satellite className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Satellites</span>
                  </div>
               <div className="text-lg font-semibold">{weatherData.satellites}</div>
               </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
    </div>
  )
}
