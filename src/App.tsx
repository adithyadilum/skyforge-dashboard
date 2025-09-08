import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "./components/ui/card"
import { LiveTab, SystemTab, AnalyticsTab } from "./components/tabs"
import { LoginPage, UserProfile } from "./components/auth"
import { WeatherData } from "./types/index"
import { firebaseService } from "./services/firebaseService"
import { authService } from "./services/auth.service"
import { useGPSTracking } from "./hooks/useGPSTracking"
import ShinyText from "./components/ui/ShinyText"

function App() {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Live")
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting')

  // Uptime timer state - proper session management
  const [uptimeSeconds, setUptimeSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const uptimeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataReceivedRef = useRef<number>(0)
  const sessionStartTimeRef = useRef<number>(0)

  // Initialize GPS tracking
  const gpsTracking = useGPSTracking({
    maxHistorySize: 200,
    minTimeInterval: 5, // 5 seconds minimum between calculations
    minDistance: 2 // 2 meters minimum for valid movement
  })

  // Auth state monitoring
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setAuthLoading(false)
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

  // Uptime timer logic - based on connection status changes
  useEffect(() => {
    if (connectionStatus === 'connected' && !isTimerRunning) {
      // Start timer only when going from not-running to connected
      console.log('🚀 Data session started - starting uptime timer')
      setIsTimerRunning(true)
      setUptimeSeconds(0) // Reset to 0 for new session
      sessionStartTimeRef.current = Date.now()
      
      // Clear any existing timer
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current)
      }
      
      // Start new timer
      uptimeIntervalRef.current = setInterval(() => {
        setUptimeSeconds(prev => prev + 1)
      }, 1000)
      
    } else if (connectionStatus === 'disconnected' && isTimerRunning) {
      // Pause timer only when going from running to disconnected
      console.log('⏸️ Data session paused - stopping timer at', uptimeSeconds + 's')
      setIsTimerRunning(false)
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current)
        uptimeIntervalRef.current = null
      }
    }
    // 'connecting' state: do nothing, keep current state
  }, [connectionStatus, isTimerRunning, uptimeSeconds])

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current)
      }
    }
  }, [])

  // Debug effect
  useEffect(() => {
    console.log(`🔍 Uptime: ${uptimeSeconds}s, Timer running: ${isTimerRunning}, Status: ${connectionStatus}`)
  }, [uptimeSeconds, isTimerRunning, connectionStatus])

  useEffect(() => {
    // Only initialize Firebase data subscription when user is authenticated
    if (!user) {
      setWeatherData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setConnectionStatus('connecting')

    // Set up connection status monitoring
    firebaseService.setConnectionStatusCallback((status) => {
      setConnectionStatus(status)
    })

    // Subscribe to real-time Firebase data
    const weatherUnsubscribe = firebaseService.subscribeToWeatherData((data) => {
      if (data) {
        setWeatherData(data)
        // Update GPS tracking with new data
        gpsTracking.updateGPSTracking(data)
        
        // Track last data received time
        lastDataReceivedRef.current = Date.now()
        
        // Connection status will handle timer logic
        // Just log that we received data
        console.log('📡 Data received')
      } else {
        setWeatherData(null)
        console.log('❌ No data received')
      }
      setLoading(false)
    })

    // Set loading to false after timeout
    const initialLoadTimeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    // Cleanup subscriptions on unmount
    return () => {
      clearTimeout(initialLoadTimeout)
      weatherUnsubscribe()
      firebaseService.cleanup()
      // Clean up uptime timer
      if (uptimeIntervalRef.current) {
        clearInterval(uptimeIntervalRef.current)
        uptimeIntervalRef.current = null
      }
    }
  }, [user])

  const handleLoginSuccess = () => {
    // Login successful, start data subscription
  }

  const handleSignOut = () => {
    setUser(null)
    setWeatherData(null)
    setConnectionStatus('connecting')
    setActiveTab('Live')
    // Reset GPS tracking
    gpsTracking.resetTracking()
    // Reset uptime timer
    if (uptimeIntervalRef.current) {
      clearInterval(uptimeIntervalRef.current)
      uptimeIntervalRef.current = null
    }
    setUptimeSeconds(0)
    setIsTimerRunning(false)
    lastDataReceivedRef.current = 0
    sessionStartTimeRef.current = 0
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
        {/* Header - Responsive Design */}
        <Card className="mb-4 shadow-lg shadow-gray-200/50">
          <CardContent className="p-3 sm:p-4">
            {/* Mobile-First Header Layout */}
            <div className="space-y-3 lg:space-y-0">
              {/* Top Row - Logo and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    <ShinyText text="SKYFORGE" disabled={false} speed={20} className="" />
                  </h1>

                  {/* Connection Status Indicator */}
                  <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${connectionStatus === 'connected'
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
                    <span className="hidden sm:inline">
                      {connectionStatus === 'connected' ? 'LIVE' : connectionStatus === 'connecting' ? 'Connecting...' : 'OFFLINE'}
                    </span>
                    <span className="sm:hidden">
                      {connectionStatus === 'connected' ? 'LIVE' : connectionStatus === 'connecting' ? 'CONN' : 'OFF'}
                    </span>
                  </div>
                </div>

                {/* User Profile - Always visible on right */}
                <div className="lg:hidden">
                  <UserProfile user={user} onSignOut={handleSignOut} />
                </div>
              </div>

              {/* Middle Row - Data Freshness (Mobile/Tablet) and Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Data Freshness Indicator */}
                {weatherData?.lastUpdate && (
                  <div className="text-xs text-gray-500 lg:order-1">
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <span>Last Update: {new Date(weatherData.lastUpdate).toLocaleTimeString()}</span>
                      <span className="hidden sm:inline text-gray-400">
                        {new Date(weatherData.lastUpdate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Tabs - Responsive */}
                <div className="flex justify-center lg:justify-start lg:order-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                    {["Live", "System", "Analytics"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors min-w-0 ${activeTab === tab
                          ? "bg-white text-gray-900 shadow-md shadow-gray-200/30"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        <span className="truncate">{tab}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Right Side - Date/Time and User Profile */}
                <div className="hidden lg:flex lg:items-center lg:gap-4 lg:order-3">
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

              {/* Mobile Date/Time Row */}
              <div className="lg:hidden text-center text-sm text-gray-600">
                <div className="flex justify-center gap-4 text-xs">
                  <span>
                    {currentDateTime.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    {currentDateTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === "Live" && <LiveTab weatherData={weatherData} gpsTracking={gpsTracking} />}
        {activeTab === "System" && (
          <SystemTab
            currentDateTime={currentDateTime}
            weatherData={weatherData}
            connectionStatus={connectionStatus}
            uptimeSeconds={uptimeSeconds}
          />
        )}
        {activeTab === "Analytics" && <AnalyticsTab weatherData={weatherData} />}
      </div>
    </div>
  )
}

export default App
