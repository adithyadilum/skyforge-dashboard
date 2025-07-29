import { useState, useEffect } from "react"
import { Card, CardContent } from "./components/ui/card"
import LiveTab from "./components/LiveTab"
import SystemTab from "./components/SystemTab"
import AnalyticsTab from "./components/AnalyticsTab"
import { WeatherData } from "./types"
import { firebaseService } from "./services/firebaseService"

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [systemData, setSystemData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Live")
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')

  useEffect(() => {
    // Update date/time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    console.log("Initializing dashboard...")
    setConnectionStatus('connecting')

    // Set up connection status monitoring
    firebaseService.setConnectionStatusCallback((status) => {
      setConnectionStatus(status)
    })

    // Set a timeout to ensure loading is set to false even if Firebase fails
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, using mock data")
        setWeatherData(getMockData())
        setConnectionStatus('disconnected')
        setLoading(false)
      }
    }, 5000) // 5 second timeout

    // Subscribe to real-time Firebase data
    console.log("Connecting to Firebase...")
    const weatherUnsubscribe = firebaseService.subscribeToWeatherData((data) => {
      clearTimeout(loadingTimeout) // Clear timeout since we got a response
      if (data) {
        console.log("Received Firebase weather data:", data)
        setWeatherData(data)
        // Connection status is now handled by the service itself
      } else {
        console.log("No Firebase weather data, using fallback mock data")
        setWeatherData(getMockData())
        setConnectionStatus('disconnected')
      }
      setLoading(false)
    })

    // Subscribe to system data
    const systemUnsubscribe = firebaseService.subscribeToSystemData((data) => {
      if (data) {
        console.log("Received Firebase system data:", data)
        setSystemData(data)
      }
    })

    // Cleanup subscriptions on unmount
    return () => {
      clearTimeout(loadingTimeout)
      weatherUnsubscribe()
      systemUnsubscribe()
    }
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
      value: 2,
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
        <div className="text-center">
          <div className="text-xl mb-2">
            {connectionStatus === 'connecting' ? 'Connecting to Firebase...' : 'Loading weather data...'}
          </div>
          <div className="text-sm text-gray-600">
            {connectionStatus === 'connecting' && 'Attempting to fetch live sensor data'}
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-4 shadow-lg shadow-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">SkyForge</h1>

                {/* Connection Status Indicator */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${connectionStatus === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : connectionStatus === 'connecting'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected'
                    ? 'bg-green-500'
                    : connectionStatus === 'connecting'
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-red-500'
                    }`}></div>
                  {connectionStatus === 'connected' ? 'LIVE' : connectionStatus === 'connecting' ? 'Connecting...' : 'OFFLINE'}
                </div>

                {/* Data Freshness Indicator */}
                {weatherData?.lastUpdate && (
                  <div className="text-xs text-gray-500">
                    Last Update: {new Date(weatherData.lastUpdate).toLocaleTimeString()}
                  </div>
                )}
              </div>

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
        {activeTab === "Live" && <LiveTab weatherData={weatherData} />}
        {activeTab === "System" && (
          <SystemTab
            currentDateTime={currentDateTime}
            systemData={systemData}
            weatherData={weatherData}
            connectionStatus={connectionStatus}
          />
        )}
        {activeTab === "Analytics" && <AnalyticsTab weatherData={weatherData} />}
      </div>
    </div>
  )
}

export default App
