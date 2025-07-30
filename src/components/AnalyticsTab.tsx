import React, { useMemo, useCallback, useEffect, useState, useRef } from "react"
import { Sun, Thermometer, Droplets, Gauge, Wind, MapPin, BarChart3, TrendingUp, Download, FileText, RefreshCw, ChevronDown, Mountain } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { WeatherData } from '../types'
import { firebaseService } from '../services/firebaseService'

interface AnalyticsTabProps {
  weatherData?: WeatherData | null
}

// Memoized chart components to prevent unnecessary re-renders
const TemperatureChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
))

const HumidityChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
    </AreaChart>
  </ResponsiveContainer>
))

const PressureChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
))

const UVChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="uv" stroke="#eab308" fill="#eab308" fillOpacity={0.3} />
    </AreaChart>
  </ResponsiveContainer>
))

const SpeedChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="speed" stroke="#06b6d4" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
))

const AltitudeChart = React.memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="altitude" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
    </AreaChart>
  </ResponsiveContainer>
))

// Set display names for React DevTools
TemperatureChart.displayName = 'TemperatureChart'
HumidityChart.displayName = 'HumidityChart'
PressureChart.displayName = 'PressureChart'
UVChart.displayName = 'UVChart'
SpeedChart.displayName = 'SpeedChart'
AltitudeChart.displayName = 'AltitudeChart'
HumidityChart.displayName = 'HumidityChart'
PressureChart.displayName = 'PressureChart'
UVChart.displayName = 'UVChart'
SpeedChart.displayName = 'SpeedChart'
AltitudeChart.displayName = 'AltitudeChart'

const AnalyticsTab = React.memo(({ }: AnalyticsTabProps) => {
  const [historicalData, setHistoricalData] = useState<WeatherData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recordLimit, setRecordLimit] = useState(50) // Add record limit state
  const [autoRefresh, setAutoRefresh] = useState(true) // Auto-refresh toggle
  const [error, setError] = useState<string | null>(null)
  const [refreshInterval, setRefreshInterval] = useState(10) // Refresh interval in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch historical data function
  const fetchHistoricalData = useCallback(async (limit: number = recordLimit) => {
    setIsLoading(true)
    setError(null) // Clear previous errors
    try {
      const data = await firebaseService.getHistoricalData(limit)
      setHistoricalData(data)
      console.log('📊 Historical data loaded for analytics:', data.length, 'records')
    } catch (error) {
      console.error('❌ Error fetching historical data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [recordLimit])

  // Fetch historical data on component mount and set up auto-refresh
  useEffect(() => {
    // Initial data fetch
    fetchHistoricalData()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Set up auto-refresh interval if enabled
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchHistoricalData()
      }, refreshInterval * 1000) // Convert seconds to milliseconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fetchHistoricalData, autoRefresh, refreshInterval])

  // Process historical data for charts
  const chartData = useMemo(() => {
    if (historicalData.length === 0) {
      // Fallback to sample data if no historical data
      return {
        temperature: [
          { time: '00:00', value: 18.5 }
        ],
        environmental: [
          { time: '00:00', temperature: 18.5, humidity: 65, pressure: 1013, uv: 0 }
        ],
        flight: [
          { time: '10:00', speed: 0, altitude: 0 }
        ]
      }
    }

    // Process real historical data
    const processedData = historicalData.map((record) => {
      const timestamp = new Date(record.lastUpdate || Date.now())
      const timeString = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      return {
        time: timeString,
        value: record.temperature.celsius,
        temperature: record.temperature.celsius,
        humidity: record.humidity,
        pressure: record.pressure.hPa,
        uv: record.uvIndex.value,
        speed: record.wind.speed,
        altitude: record.location.altitude,
        co2: record.airQuality.co2,
        light: record.light.lux,
        latitude: record.location.latitude,
        longitude: record.location.longitude
      }
    })

    return {
      temperature: processedData,
      environmental: processedData,
      flight: processedData
    }
  }, [historicalData])  // Memoize static data to prevent re-creation on every render
  const temperatureData = useMemo(() => {
    return chartData.temperature
  }, [chartData])

  const environmentalData = useMemo(() => {
    return chartData.environmental
  }, [chartData])

  const flightData = useMemo(() => {
    return chartData.flight
  }, [chartData])

  const gpsTrail = useMemo(() => {
    if (historicalData.length === 0) {
      // Fallback GPS trail
      return [
        [7.2901, 80.6337],
        [7.2905, 80.6340],
        [7.2910, 80.6345],
        [7.2915, 80.6342],
        [7.2920, 80.6338],
        [7.2918, 80.6335]
      ]
    }

    // Create GPS trail from historical data
    return historicalData
      .filter(record => record.location.latitude !== 0 && record.location.longitude !== 0)
      .map(record => [record.location.latitude, record.location.longitude] as [number, number])
  }, [historicalData])

  // Calculate insights from historical data
  const insights = useMemo(() => {
    if (historicalData.length === 0) {
      return {
        avgTemperature: 22.0,
        maxUV: 2.0,
        maxCO2: 450,
        avgHumidity: 51,
        tempTrend: 'stable',
        dataPoints: 0
      }
    }

    const temperatures = historicalData.map(d => d.temperature.celsius)
    const uvValues = historicalData.map(d => d.uvIndex.value)
    const co2Values = historicalData.map(d => d.airQuality.co2)
    const humidityValues = historicalData.map(d => d.humidity)

    const avgTemperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length
    const maxUV = Math.max(...uvValues)
    const maxCO2 = Math.max(...co2Values)
    const avgHumidity = humidityValues.reduce((a, b) => a + b, 0) / humidityValues.length

    // Calculate temperature trend (last 5 vs first 5 readings)
    const firstFive = temperatures.slice(0, 5)
    const lastFive = temperatures.slice(-5)
    const firstAvg = firstFive.reduce((a, b) => a + b, 0) / firstFive.length
    const lastAvg = lastFive.reduce((a, b) => a + b, 0) / lastFive.length
    const tempTrend = lastAvg > firstAvg + 1 ? 'rising' :
      lastAvg < firstAvg - 1 ? 'falling' : 'stable'

    return {
      avgTemperature,
      maxUV,
      maxCO2,
      avgHumidity,
      tempTrend,
      dataPoints: historicalData.length
    }
  }, [historicalData])

  // Refresh historical data
  const refreshData = useCallback(async () => {
    await fetchHistoricalData(recordLimit)
  }, [fetchHistoricalData, recordLimit])

  // Handle record limit change
  const handleLimitChange = (newLimit: number) => {
    setRecordLimit(newLimit)
    fetchHistoricalData(newLimit)
  }

  // Export CSV function
  const exportToCSV = useCallback(() => {
    const csvData = [
      ['Time', 'Temperature (°C)', 'Humidity (%)', 'Pressure (hPa)', 'UV Index'],
      ...environmentalData.map(row => [row.time, row.temperature, row.humidity, row.pressure, row.uv])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `skyforge_analytics_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [environmentalData])

  // Generate PDF report function
  const generatePDFReport = useCallback(() => {
    const reportContent = `
SkyForge Analytics Report
Generated: ${new Date().toLocaleString()}

=== ENVIRONMENTAL DATA ===
${environmentalData.map(data =>
      `${data.time}: Temp ${data.temperature}°C, Humidity ${data.humidity}%, Pressure ${data.pressure}hPa, UV ${data.uv}`
    ).join('\n')}

=== FLIGHT DATA ===
${flightData.map(data =>
      `${data.time}: Speed ${data.speed}m/s, Altitude ${data.altitude}m`
    ).join('\n')}

=== INSIGHTS ===
- Average Temperature: 27.6°C
- Max UV Today: 5.3
- CO₂ Trend: Steady → Rising
- Light Peak Time: 11:50 AM

=== GPS TRAIL ===
${gpsTrail.map((coord, index) =>
      `Point ${index + 1}: ${coord[0]}, ${coord[1]}`
    ).join('\n')}
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `skyforge_report_${new Date().toISOString().split('T')[0]}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [environmentalData, flightData, gpsTrail])

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card className="shadow-lg shadow-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              Analytics
              {isLoading && (
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin ml-2" />
              )}
            </h2>
            {/* Time Range Selector and Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Records: {historicalData.length}</span>
              </div>
              <div className="relative">
                <select
                  value={recordLimit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value={25}>Last 25 records</option>
                  <option value={50}>Last 50 records</option>
                  <option value={100}>Last 100 records</option>
                  <option value={200}>Last 200 records</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${autoRefresh
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
                Auto: {autoRefresh ? 'ON' : 'OFF'}
              </button>
              {autoRefresh && (
                <div className="relative">
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  >
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                    <option value={15}>15s</option>
                    <option value={30}>30s</option>
                    <option value={60}>1m</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                </div>
              )}
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          {historicalData.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing data from {new Date(historicalData[0]?.lastUpdate || 0).toLocaleString()} to {new Date(historicalData[historicalData.length - 1]?.lastUpdate || 0).toLocaleString()}
            </div>
          )}
          {historicalData.length === 0 && !isLoading && (
            <div className="mt-4 text-sm text-red-600">
              No historical data loaded. Check Firebase connection.
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600 font-medium">Error loading data:</div>
              <div className="text-sm text-red-500">{error}</div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            Analytics: {historicalData.length} records loaded • Latest temp: {historicalData[historicalData.length - 1]?.temperature?.celsius || 'N/A'}°C • Auto-refresh: {autoRefresh ? `ON (${refreshInterval}s)` : 'OFF'}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Trends */}
      <Card className="shadow-md shadow-gray-200/40">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              {/* <TrendingUp className="w-5 h-5 text-green-500" /> */}
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
                <TemperatureChart data={temperatureData} />
              </div>
            </div>

            {/* Humidity Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                Humidity (%)
              </h4>
              <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                <HumidityChart data={environmentalData} />
              </div>
            </div>

            {/* Pressure Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-500" />
                Pressure (hPa)
              </h4>
              <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                <PressureChart data={environmentalData} />
              </div>
            </div>

            {/* UV Index Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                UV Index
              </h4>
              <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                <UVChart data={environmentalData} />
              </div>
            </div>

            {/* Air Quality (CO2) Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Wind className="w-4 h-4 text-red-500" />
                CO₂ Levels (ppm)
              </h4>
              <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={environmentalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="co2" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Light Intensity Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-orange-500" />
                Light Intensity (lux)
              </h4>
              <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={environmentalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="light" stroke="#fb923c" fill="#fb923c" fillOpacity={0.3} />
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
              Flight History Visualizations
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GPS Trail Map Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                GPS Trail
              </h4>
              <div className="h-64 rounded-lg overflow-hidden bg-gray-200 flex flex-col items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">GPS Coordinates</p>
                  <p className="text-sm text-gray-500 mb-2">{gpsTrail.length} position points</p>
                  {gpsTrail.length > 0 && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Start: {gpsTrail[0][0].toFixed(4)}, {gpsTrail[0][1].toFixed(4)}</div>
                      <div>End: {gpsTrail[gpsTrail.length - 1][0].toFixed(4)}, {gpsTrail[gpsTrail.length - 1][1].toFixed(4)}</div>
                    </div>
                  )}
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
                <SpeedChart data={flightData} />
              </div>
            </div>

            {/* Altitude vs Time */}
            <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-green-500" />
                Altitude vs Time (m)
              </h4>
              <div className="h-48 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
                <AltitudeChart data={flightData} />
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
              Insights & Aggregates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium">Avg Temperature</div>
              <div className="text-2xl font-bold text-blue-900">
                {insights.avgTemperature.toFixed(1)}°C
              </div>
              <div className="text-xs text-blue-500 mt-1">
                Trend: {insights.tempTrend}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-yellow-600 font-medium">Max UV Index</div>
              <div className="text-2xl font-bold text-yellow-900">
                {insights.maxUV.toFixed(1)}
              </div>
              <div className="text-xs text-yellow-500 mt-1">
                From {insights.dataPoints} readings
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">Max CO₂ Level</div>
              <div className="text-lg font-bold text-green-900 flex items-center gap-1">
                {insights.maxCO2.toFixed(0)} ppm
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium">Avg Humidity</div>
              <div className="text-2xl font-bold text-purple-900">
                {insights.avgHumidity.toFixed(0)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export / Download Options */}
      <Card className="shadow-md shadow-gray-200/40">
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              Export / Download Options
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-500 rounded-md hover:bg-green-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={generatePDFReport}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Report PDF
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

AnalyticsTab.displayName = 'AnalyticsTab'

export default AnalyticsTab
