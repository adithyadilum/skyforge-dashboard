import { useState, useEffect } from "react"
import { Sun, Thermometer, Droplets, Gauge, Eye, Wind, MapPin, Clock, Satellite, Battery, Signal, Cpu, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"

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
      value: 3,
      level: "Moderate",
    },
    airQuality: {
      co2: 450,
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

  const getUVColor = (value: number) => {
    if (value <= 2) return "bg-green-200 text-green-800"
    if (value <= 5) return "bg-yellow-200 text-yellow-800"
    if (value <= 7) return "bg-orange-200 text-orange-800"
    return "bg-red-200 text-red-800"
  }

  const renderSystemTab = () => (
    <div className="space-y-6">
      {/* System Header */}
      <Card className="shadow-lg shadow-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">System</h2>
            <div className="text-sm text-gray-600">
              Last Updated: {currentDateTime.toLocaleTimeString('en-US', {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Weather Display */}
      <div className="lg:col-span-2">
        <Card className="mb-6 shadow-lg shadow-gray-200/50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-8xl font-light text-gray-900">{weatherData.temperature.fahrenheit}°F</span>
                  <Sun className="w-16 h-16 text-yellow-500" />
                </div>
                <div className="text-2xl font-medium text-gray-700 mb-1">{weatherData.condition}</div>
                <div className="text-lg text-gray-600">Feels like {weatherData.temperature.feelsLike}°</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Thermometer className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Temperature</span>
              </div>
              <div className="text-3xl font-semibold text-gray-900">{weatherData.temperature.celsius}°C</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Humidity</span>
              </div>
              <div className="text-3xl font-semibold text-gray-900">{weatherData.humidity}%</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Gauge className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Pressure</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{weatherData.pressure.altitude}m</div>
              <div className="text-2xl font-semibold text-gray-900">{weatherData.pressure.hPa} hPa</div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sun className="w-5 h-5 text-orange-500" />
                <span className="text-gray-600">UV Index</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`text-lg px-3 py-1 ${getUVColor(weatherData.uvIndex.value)}`}>
                  {weatherData.uvIndex.value}
                </Badge>
                <span className="text-gray-600">{weatherData.uvIndex.level}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">550 lx</span>
              </div>
              <div className="text-3xl font-semibold text-gray-900">{weatherData.light.ppm} ppm</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Wind className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">CO₂ Air Quality</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{weatherData.airQuality.quality}</div>
              <div className="text-2xl font-semibold text-gray-900">{weatherData.airQuality.co2} ppm</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4">
        <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Humidity</span>
              <span className="text-2xl font-semibold">{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">UV Index</span>
              <Badge className={`${getUVColor(weatherData.uvIndex.value)}`}>{weatherData.uvIndex.value}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Altitude</span>
              <span className="text-xl font-semibold">{weatherData.location.altitude} m</span>
            </div>
          </CardContent>
        </Card>

        {/* Map Card */}
        <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-50"></div>
              <MapPin className="w-8 h-8 text-gray-600 z-10" />
              <div className="absolute bottom-4 left-4 text-sm font-medium text-gray-700">
                {weatherData.location.latitude.toFixed(4)}° N, {Math.abs(weatherData.location.longitude).toFixed(4)}
                ° W
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation & Status */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">Course</span>
              </div>
              <div className="text-2xl font-semibold">{weatherData.wind.direction}°</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <div className="w-3 h-1 bg-gray-600 rounded"></div>
                </div>
                <span className="text-sm text-gray-600">Speed</span>
              </div>
              <div className="text-xl font-semibold">{weatherData.wind.speed} km/h</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Satellite className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Satellites</span>
              </div>
              <div className="text-2xl font-semibold">{weatherData.satellites}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md shadow-gray-200/40 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Time</span>
              </div>
              <div className="text-xl font-semibold">{weatherData.timestamp}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
        <p className="text-gray-600">Analytics dashboard coming soon...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg shadow-gray-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">SkyForge</h1>

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
