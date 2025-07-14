import { useState, useEffect } from "react"
import { Sun, Thermometer, Droplets, Gauge, Wind, MapPin, Satellite, Battery, Cpu, CheckCircle, BarChart3, TrendingUp, Download, FileText, RefreshCw, ChevronDown, Mountain } from "lucide-react"
import { Card, CardContent } from "./components/ui/card"
import UvGauge from "./components/ui/UvGauge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface WeatherData {
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
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Live")
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    // Update date/time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // For demo purposes, use mock data directly
    // To enable Firebase, add your Firebase config to .env file
    console.log("Using mock data for demo")
    setWeatherData(getMockData())
    setLoading(false)
  }, [])

  const getMockData = (): WeatherData => ({
    temperature: {
      celsius: 22,
      fahrenheit: 72,
      feelsLike: 70,
    },
    humidity: 51,
    pressure: {
      hPa: 1015,
      altitude: 105,
    },
    uvIndex: {
      value: 5,
      level: "Moderate",
    },
    airQuality: {
      co2: 450,
      gas: 285,
      quality: 78,
    },
    light: {
      lux: 550,
      ppm: 550,
    },
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 1200,
    },
    wind: {
      speed: 5.2,
      direction: 238,
    },
    satellites: 8,
    timestamp: "3:27 PM",
    condition: "Sunny",
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading weather data...</div>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">No weather data available</div>
      </div>
    )
  }

  const renderSystemTab = () => (
    <div className="space-y-6">
      {/* System Header */}
      <Card className="shadow-lg shadow-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">System</h2>
            <div className="text-sm text-gray-600">
              Last Updated: {currentDateTime.toLocaleTimeString('en-US', {//This should not be current time
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">GPS Location:</span>
              <span className="font-semibold text-gray-900">7.2901, 80.6337</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">GPS Altitude:</span>
              <span className="font-semibold text-gray-900">142 m</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Ground Speed:</span>
              <span className="font-semibold text-gray-900">3.6 m/s</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-blue-600">Hovering</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Battery Voltage:</span>
              <span className="font-semibold text-gray-900">11.7 V</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">NRF Link:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Connected
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Control Channel:</span>
              <span className="font-semibold text-gray-900">NRF24L01 (2.4GHz)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Uplink Status:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Active
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-semibold text-gray-900">00:13:22</span>
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
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> OK
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">BME280:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> OK
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">UV Sensor:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> OK
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">CCS811:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> OK
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">VL53L0X Array:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> All 4 Online
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">GPS Module:</span>
              <span className="font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Lock Acquired
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">ESP32 Temp:</span>
              <span className="font-semibold text-gray-900">39.2°C</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderLiveTab = () => (
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
              <div className="text-4xl font-semibold text-gray-900">{weatherData.temperature.celsius}°C</div>
              <div className="text-base font-light text-gray-600 mb-1">Feels like {weatherData.temperature.feelsLike}°</div>
                  
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
              <div className="text-base font-semibold text-gray-900">{weatherData.pressure.altitude}m</div>
              <div className="text-xl font-semibold text-gray-900">{weatherData.pressure.hPa} hPa</div>
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
              <div className="text-2xl font-semibold text-gray-900">{weatherData.location.altitude} m</div>
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
                  <span className="text-sm font-semibold text-gray-900">{weatherData.airQuality.gas} ppm</span>
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
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-50"></div>
              <MapPin className="w-6 h-6 text-gray-600 z-10" />
              <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-700">
                {weatherData.location.latitude.toFixed(4)}° N, {Math.abs(weatherData.location.longitude).toFixed(4)}
                ° W
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
              <div className="text-lg font-semibold">{weatherData.wind.speed} km/h</div>
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
  )

  const renderAnalyticsTab = () => {
    // Mock data for charts
    const temperatureData = [
      { time: '00:00', value: 18.5 },
      { time: '03:00', value: 16.2 },
      { time: '06:00', value: 19.8 },
      { time: '09:00', value: 23.4 },
      { time: '12:00', value: 27.6 },
      { time: '15:00', value: 29.1 },
      { time: '18:00', value: 26.3 },
      { time: '21:00', value: 22.8 }
    ]

    const environmentalData = [
      { time: '00:00', temperature: 18.5, humidity: 65, pressure: 1013, uv: 0 },
      { time: '03:00', temperature: 16.2, humidity: 72, pressure: 1014, uv: 0 },
      { time: '06:00', temperature: 19.8, humidity: 68, pressure: 1015, uv: 1.2 },
      { time: '09:00', temperature: 23.4, humidity: 58, pressure: 1016, uv: 3.8 },
      { time: '12:00', temperature: 27.6, humidity: 45, pressure: 1015, uv: 5.3 },
      { time: '15:00', temperature: 29.1, humidity: 42, pressure: 1014, uv: 4.9 },
      { time: '18:00', temperature: 26.3, humidity: 48, pressure: 1013, uv: 2.1 },
      { time: '21:00', temperature: 22.8, humidity: 55, pressure: 1012, uv: 0 }
    ]

    const flightData = [
      { time: '10:00', speed: 0, altitude: 0 },
      { time: '10:05', speed: 3.2, altitude: 45 },
      { time: '10:10', speed: 5.8, altitude: 120 },
      { time: '10:15', speed: 4.1, altitude: 142 },
      { time: '10:20', speed: 3.6, altitude: 142 },
      { time: '10:25', speed: 2.8, altitude: 98 },
      { time: '10:30', speed: 0, altitude: 0 }
    ]

    const gpsTrail: [number, number][] = [
      [7.2901, 80.6337],
      [7.2905, 80.6340],
      [7.2910, 80.6345],
      [7.2915, 80.6342],
      [7.2920, 80.6338],
      [7.2918, 80.6335]
    ]

    return (
      <div className="space-y-6">
        {/* Analytics Header */}
        <Card className="shadow-lg shadow-gray-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                Analytics
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* Time Range Selector */}
        <Card className="shadow-md shadow-gray-200/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                📅 Time Range Selector
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>Last 1h</option>
                  <option>Last 6h</option>
                  <option>Last 24h</option>
                  <option>Last 7d</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Trends */}
        <Card className="shadow-md shadow-gray-200/40">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Environmental Trends (Charts Section)
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temperature Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Temperature (°C)
                </h4>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Humidity Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  Humidity (%)
                </h4>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={environmentalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pressure Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-500" />
                  Pressure (hPa)
                </h4>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={environmentalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* UV Index Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  UV Index
                </h4>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={environmentalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="uv" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight History Visualizations */}
        <Card className="shadow-md shadow-gray-200/40">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                ✈️ Flight History Visualizations
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GPS Trail Map Placeholder */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  GPS Trail
                </h4>
                <div className="h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">GPS Trail: {gpsTrail.length} points</p>
                  </div>
                </div>
              </div>

              {/* Speed over Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-cyan-500" />
                  Speed over Time (m/s)
                </h4>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={flightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="speed" stroke="#06b6d4" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Altitude vs Time */}
              <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Altitude vs Time (m)
                </h4>
                <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={flightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="altitude" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights & Aggregates */}
        <Card className="shadow-md shadow-gray-200/40">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                🧠 Insights & Aggregates
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Average Temperature</div>
                <div className="text-2xl font-bold text-blue-900">27.6°C</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-yellow-600 font-medium">Max UV Today</div>
                <div className="text-2xl font-bold text-yellow-900">5.3</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">CO₂ Trend</div>
                <div className="text-lg font-bold text-green-900 flex items-center gap-1">
                  Steady → Rising
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium">Light Peak Time</div>
                <div className="text-2xl font-bold text-purple-900">11:50 AM</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export / Download Options */}
        <Card className="shadow-md shadow-gray-200/40">
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                📁 Export / Download Options
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                <FileText className="w-4 h-4" />
                View Report PDF
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-4 shadow-lg shadow-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">SkyForge</h1>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {["Live", "System", "Analytics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab
                      ? "bg-white text-gray-900 shadow-md shadow-gray-200/30"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Right Side - Date/Time and User Profile */}
              <div className="flex items-center gap-4">
                {/* Real-time Date/Time */}
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {currentDateTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {currentDateTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                    <div className="text-xs text-gray-600">Administrator</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === "Live" && renderLiveTab()}
        {activeTab === "System" && renderSystemTab()}
        {activeTab === "Analytics" && renderAnalyticsTab()}
      </div>
    </div>
  )
}

export default App
