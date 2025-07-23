import { useState, useEffect } from "react"
import { Card, CardContent } from "./components/ui/card"
import LiveTab from "./components/LiveTab"
import SystemTab from "./components/SystemTab"
import AnalyticsTab from "./components/AnalyticsTab"
import { WeatherData } from "./types"

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
      value: 10,
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
        {activeTab === "Live" && <LiveTab weatherData={weatherData} />}
        {activeTab === "System" && <SystemTab currentDateTime={currentDateTime} />}
        {activeTab === "Analytics" && <AnalyticsTab />}
      </div>
    </div>
  )
}

export default App
