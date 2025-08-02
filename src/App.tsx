import { useState, useEffect } from "react"
import { Card, CardContent } from "./components/ui/card"
import LiveTab from "./components/LiveTab"
import SystemTab from "./components/SystemTab"
import AnalyticsTab from "./components/AnalyticsTab"
import LoginPage from "./components/LoginPage"
import UserProfile from "./components/UserProfile"
import { WeatherData } from "./types"
import { firebaseService } from "./services/firebaseService"
import { authService } from "./services/authService"

function App() {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [systemData, setSystemData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Live")
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')

  // Auth state monitoring
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setAuthLoading(false)
      console.log('Auth state changed:', user ? `Signed in as ${user.displayName}` : 'Signed out')
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    // Update date/time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Only initialize Firebase data subscription when user is authenticated
    if (!user) {
      setWeatherData(null)
      setSystemData(null)
      setLoading(false)
      return
    }

    console.log("Initializing dashboard for authenticated user...")
    setLoading(true)
    setConnectionStatus('connecting')

    // Set up connection status monitoring
    firebaseService.setConnectionStatusCallback((status) => {
      setConnectionStatus(status)
      console.log(`📡 Connection status changed to: ${status}`)
    })

    // Subscribe to real-time Firebase data
    console.log("Connecting to Firebase...")
    const weatherUnsubscribe = firebaseService.subscribeToWeatherData((data) => {
      if (data) {
        console.log("Received Firebase weather data:", data)
        setWeatherData(data)
      } else {
        console.log("No Firebase weather data available")
        setWeatherData(null)
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

    // Set loading to false after timeout
    const initialLoadTimeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    // Cleanup subscriptions on unmount
    return () => {
      clearTimeout(initialLoadTimeout)
      weatherUnsubscribe()
      systemUnsubscribe()
      firebaseService.cleanup()
    }
  }, [user])

  const handleLoginSuccess = () => {
    console.log('Login successful, starting data subscription...')
  }

  const handleSignOut = () => {
    setUser(null)
    setWeatherData(null)
    setSystemData(null)
    setConnectionStatus('connecting')
    setActiveTab('Live')
  }

  // Show loading screen while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Loading...</div>
          <div className="text-sm text-gray-600">Checking authentication</div>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">
            {connectionStatus === 'connecting' ? 'Connecting to Firebase...' : 'Loading sensor data...'}
          </div>
          <div className="text-sm text-gray-600">
            {connectionStatus === 'connecting' && 'Establishing real-time connection'}
          </div>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">No Live Data Available</div>
          <div className="text-sm text-gray-600">
            {connectionStatus === 'connecting' 
              ? 'Establishing connection to Firebase...' 
              : connectionStatus === 'disconnected'
              ? 'Database not receiving data. Check your sensors and Firebase connection.'
              : 'Waiting for sensor data...'}
          </div>
          <div className="mt-4">
            <UserProfile user={user} onSignOut={handleSignOut} />
          </div>
        </div>
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
                    {/*{connectionStatus === 'disconnected' && (
                      <span className="text-red-600 ml-1">
                        (Data timeout - no updates in 10+ seconds)
                      </span>
                    )}*/}
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
                <UserProfile user={user} onSignOut={handleSignOut} />
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
