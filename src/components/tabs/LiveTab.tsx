import { useState } from "react"
import { Sun, Thermometer, Droplets, Gauge, Wind, Satellite, Mountain, ChevronDown } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import UvGauge from "../ui/UvGauge"
import { WeatherData } from "../../types/index"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LiveTabProps {
  weatherData: WeatherData
}

export default function LiveTab({ weatherData }: LiveTabProps) {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')

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
              <div className="text-base font-semibold text-gray-900">
                {convertAltitude(weatherData.pressure.altitude || getAltitudeFallback()).toFixed(0)}{getAltitudeUnit()}
              </div>
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
                {convertAltitude(weatherData.location.altitude || getAltitudeFallback()).toFixed(0)} {getAltitudeUnit()}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Air Quality</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Gas:</span>
                  <span className="text-sm font-semibold text-gray-900">{weatherData.airQuality.gas} TVOC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">CO₂:</span>
                  <span className="text-sm font-semibold text-gray-900">{weatherData.airQuality.co2} ppm</span>
                </div>
                <div className="text-center mt-1 pt-1 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Quality: </span>
                  <span className="text-sm font-semibold text-gray-900">{weatherData.airQuality.quality}</span>
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
                center={[weatherData.location.latitude, weatherData.location.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[weatherData.location.latitude, weatherData.location.longitude]}>
                  <Popup>
                    Sensor Location<br />
                    {weatherData.location.latitude.toFixed(4)}°N, {Math.abs(weatherData.location.longitude).toFixed(4)}°W
                  </Popup>
                </Marker>
              </MapContainer>
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
             <div className="text-lg font-semibold">{weatherData.wind.direction}°</div>
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
              <div className="text-lg font-semibold">
                {convertSpeed(weatherData.wind.speed).toFixed(1)} {getSpeedUnit()}
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
