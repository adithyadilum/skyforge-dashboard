import React, { useMemo, useCallback, useEffect, useState, useRef } from "react"
import { Sun, Thermometer, Droplets, Gauge, Wind, BarChart3, TrendingUp, Download, FileText, RefreshCw, ChevronDown, Mountain } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { WeatherData } from '../../types'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { firebaseService } from '../../services/firebaseService'
import jsPDF from 'jspdf'

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
AltitudeChart.displayName = 'AltitudeChart'
HumidityChart.displayName = 'HumidityChart'
PressureChart.displayName = 'PressureChart'
UVChart.displayName = 'UVChart'
AltitudeChart.displayName = 'AltitudeChart'

const AnalyticsTab = React.memo(({ weatherData: _weatherData }: AnalyticsTabProps) => {
  const [historicalData, setHistoricalData] = useState<WeatherData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day') // Time range selector
  const [autoRefresh, setAutoRefresh] = useState(true) // Auto-refresh toggle
  const [_error, setError] = useState<string | null>(null) // Error state for future use
  const [refreshInterval, setRefreshInterval] = useState(5) // Refresh interval in seconds (default 5s)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch analytics data function
  const fetchAnalyticsData = useCallback(async (range: 'hour' | 'day' | 'week' | 'month' = timeRange) => {
    setIsLoading(true)
    setError(null) // Clear previous errors
    try {
      console.log(`📊 Fetching analytics data for ${range}...`)
      const data = await firebaseService.getAnalyticsData(range)
      setHistoricalData(data)
      console.log(`📊 Analytics data loaded for ${range}:`, data.length, 'records')
    } catch (error) {
      console.error('❌ Error fetching analytics data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }, [timeRange])

  // Fetch analytics data on component mount and set up auto-refresh
  useEffect(() => {
    // Initial data fetch
    fetchAnalyticsData()

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Set up auto-refresh interval if enabled
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchAnalyticsData()
      }, refreshInterval * 1000) // Convert seconds to milliseconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fetchAnalyticsData, autoRefresh, refreshInterval])

  // Process historical data for charts
  const chartData = useMemo(() => {
    console.log(`📊 Processing chart data from ${historicalData.length} records for ${timeRange}`)
    
    if (historicalData.length === 0) {
      console.log('⚠️ No historical data available, using fallback sample data')
      // Fallback to sample data if no historical data
      return {
        temperature: [
          { time: '00:00:00', value: 18.5 }
        ],
        environmental: [
          { time: '00:00:00', temperature: 18.5, humidity: 65, pressure: 1013, uv: 0, co2: 400, light: 100 }
        ],
        flight: [
          { time: '10:00:00', speed: 0, altitude: 0 }
        ]
      }
    }

    console.log('✅ Processing real analytics data:', historicalData[0])

    // Process real historical data
    const processedData = historicalData.map((record, index) => {
      const timestamp = new Date(record.lastUpdate || Date.now())
      const timeString = timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      const dataPoint = {
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

      if (index === 0) {
        console.log('📈 Sample processed data point:', dataPoint)
      }

      return dataPoint
    })

    console.log(`📊 Chart data ready: ${processedData.length} points for ${timeRange} range`)

    return {
      temperature: processedData,
      environmental: processedData,
      flight: processedData
    }
  }, [historicalData, timeRange])  // Include timeRange in dependencies
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

  // Generate color gradient for path segments
  const pathSegments = useMemo(() => {
    if (gpsTrail.length < 2) return []
    
    const segments: Array<{ path: [[number, number], [number, number]], color: string }> = []
    
    for (let i = 0; i < gpsTrail.length - 1; i++) {
      const progress = i / (gpsTrail.length - 1)
      // Color gradient from green (start) to red (end)
      const red = Math.round(progress * 255)
      const green = Math.round((1 - progress) * 255)
      const color = `rgb(${red}, ${green}, 0)`
      
      segments.push({
        path: [gpsTrail[i] as [number, number], gpsTrail[i + 1] as [number, number]],
        color: color
      })
    }
    
    return segments
  }, [gpsTrail])

  // Default location (landmark) when GPS coordinates are zero
  const defaultLocation: [number, number] = [6.7973, 79.9021]

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

  // Refresh analytics data
  const refreshData = useCallback(async () => {
    await fetchAnalyticsData()
  }, [fetchAnalyticsData])

  // Handle time range change
  const handleTimeRangeChange = (newRange: 'hour' | 'day' | 'week' | 'month') => {
    setTimeRange(newRange)
    fetchAnalyticsData(newRange)
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
      link.setAttribute('download', `SKYFORGE_analytics_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [environmentalData])

  // Generate PDF report function
  const generatePDFReport = useCallback(() => {
    const doc = new jsPDF()
    
    // Grayscale color scheme
    const primaryColor: [number, number, number] = [64, 64, 64] // Dark gray
    const secondaryColor: [number, number, number] = [96, 96, 96] // Medium gray
    const accentColor: [number, number, number] = [128, 128, 128] // Light gray
    const lightGray: [number, number, number] = [240, 240, 240] // Very light gray
    
    // Calculate additional insights
    const maxAltitude = Math.max(...flightData.map(d => d.altitude))
    const totalFlightTime = flightData.length * 5 // Assuming 5-minute intervals
    const minHumidity = Math.min(...environmentalData.map(d => d.humidity))
    const maxHumidity = Math.max(...environmentalData.map(d => d.humidity))
    
    // Header with Skyforge branding
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 35, 'F')
    
    // Main title (no circle logo)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('SKYFORGE', 25, 20)
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('Drone Analytics Report', 25, 28)
    
    // Report metadata in header with seconds
    doc.setFontSize(10)
    const currentDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    doc.text(`Generated: ${currentDate}`, 145, 15)
    doc.text(`Records: ${historicalData.length}`, 145, 23)
    doc.text(`Time Range: ${timeRange}`, 145, 31)
    
    let yPosition = 50
    
    // Report summary box
    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 25, 'F')
    doc.setDrawColor(...secondaryColor)
    doc.rect(15, yPosition, 180, 25, 'S')
    
    doc.setTextColor(...primaryColor)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('[ EXECUTIVE SUMMARY ]', 20, yPosition + 8)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...secondaryColor)
    doc.text(`• Environmental Conditions: ${insights.avgTemperature.toFixed(1)}°C avg temp, ${insights.maxUV} max UV`, 20, yPosition + 15)
    doc.text(`• Flight Performance: ${totalFlightTime}min flight time, ${maxAltitude}m max altitude`, 20, yPosition + 21)
    
    yPosition += 35
    
    // Environmental Data Section
    doc.setFillColor(...accentColor)
    doc.rect(15, yPosition, 5, 8, 'F')
    doc.setTextColor(...primaryColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('[ ENVIRONMENTAL DATA ]', 25, yPosition + 6)
    yPosition += 15
    
    // Environmental data table
    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 12, 'F')
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('TIME', 20, yPosition + 8)
    doc.text('TEMP (°C)', 55, yPosition + 8)
    doc.text('HUMIDITY (%)', 85, yPosition + 8)
    doc.text('PRESSURE (hPa)', 125, yPosition + 8)
    doc.text('UV INDEX', 165, yPosition + 8)
    yPosition += 15
    
    doc.setFont('helvetica', 'normal')
    environmentalData.slice(0, 8).forEach((data, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248) // Light gray for alternating rows
        doc.rect(15, yPosition - 2, 180, 10, 'F')
      }
      doc.setTextColor(...secondaryColor)
      doc.text(data.time, 20, yPosition + 5)
      doc.text(data.temperature.toString(), 55, yPosition + 5)
      doc.text(data.humidity.toString(), 85, yPosition + 5)
      doc.text(data.pressure.toString(), 125, yPosition + 5)
      doc.text(data.uv.toString(), 165, yPosition + 5)
      yPosition += 10
    })
    
    yPosition += 10
    
    // Flight Data Section
    doc.setFillColor(...accentColor)
    doc.rect(15, yPosition, 5, 8, 'F')
    doc.setTextColor(...primaryColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('[ FLIGHT DATA ]', 25, yPosition + 6)
    yPosition += 15
    
    // Flight data table
    doc.setFillColor(...lightGray)
    doc.rect(15, yPosition, 180, 12, 'F')
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('TIME', 20, yPosition + 8)
    doc.text('ALTITUDE (m)', 80, yPosition + 8)
    doc.text('GPS COORDINATES', 140, yPosition + 8)
    yPosition += 15
    
    doc.setFont('helvetica', 'normal')
    flightData.slice(0, 8).forEach((data, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248) // Light gray for alternating rows
        doc.rect(15, yPosition - 2, 180, 10, 'F')
      }
      doc.setTextColor(...secondaryColor)
      doc.text(data.time, 20, yPosition + 5)
      doc.text(data.altitude.toString(), 80, yPosition + 5)
      
      // Add GPS coordinates if available
      const gpsCoord = gpsTrail[index] 
      if (gpsCoord) {
        doc.text(`${gpsCoord[0].toFixed(4)}, ${gpsCoord[1].toFixed(4)}`, 140, yPosition + 5)
      } else {
        doc.text('N/A', 140, yPosition + 5)
      }
      yPosition += 10
    })
    
    // Check if we need a new page
    if (yPosition > 230) {
      doc.addPage()
      yPosition = 30
    } else {
      yPosition += 15
    }
    
    // Key Insights Section
    doc.setFillColor(...accentColor)
    doc.rect(15, yPosition, 5, 8, 'F')
    doc.setTextColor(...primaryColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('[ KEY INSIGHTS ]', 25, yPosition + 6)
    yPosition += 15
    
    // Insights in a styled box
    doc.setFillColor(245, 245, 245) // Light gray background
    doc.rect(15, yPosition, 180, 45, 'F')
    doc.setDrawColor(...primaryColor)
    doc.rect(15, yPosition, 180, 45, 'S')
    
    doc.setTextColor(...secondaryColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    const insightsList = [
      `• Temperature: ${insights.avgTemperature.toFixed(1)}°C (Average)`,
      `• UV Index: ${insights.maxUV} (Maximum)`,
      `• Humidity: ${minHumidity}% - ${maxHumidity}% (Range)`,
      `• Altitude: ${maxAltitude}m (Maximum)`,
      `• Flight Time: ${totalFlightTime} minutes (Total)`,
      `• GPS Points: ${gpsTrail.length} (Recorded)`
    ]
    
    insightsList.forEach((insight, index) => {
      doc.text(insight, 25, yPosition + 10 + (index * 7))
    })
    
    yPosition += 55
    
    // GPS Trail Section (if space allows)
    if (yPosition < 220 && gpsTrail.length > 0) {
      doc.setFillColor(...accentColor)
      doc.rect(15, yPosition, 5, 8, 'F')
      doc.setTextColor(...primaryColor)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('[ GPS TRAIL SUMMARY ]', 25, yPosition + 6)
      yPosition += 15
      
      doc.setTextColor(...secondaryColor)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Start: ${gpsTrail[0]?.[0]?.toFixed(6)}, ${gpsTrail[0]?.[1]?.toFixed(6)}`, 20, yPosition + 5)
      doc.text(`End: ${gpsTrail[gpsTrail.length-1]?.[0]?.toFixed(6)}, ${gpsTrail[gpsTrail.length-1]?.[1]?.toFixed(6)}`, 20, yPosition + 12)
      doc.text(`Total Points: ${gpsTrail.length}`, 20, yPosition + 19)
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFillColor(...primaryColor)
    doc.rect(0, pageHeight - 15, 210, 15, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text('© 2025 Skyforge Drone Analytics • Confidential Report', 20, pageHeight - 8)
    doc.text(`Page 1 of 1 • Report ID: SF-${Date.now()}`, 145, pageHeight - 8)
    
    // Save the PDF with enhanced filename
    const timestamp = new Date().toISOString().split('T')[0]
    doc.save(`Skyforge_Analytics_Report_${timestamp}.pdf`)
  }, [environmentalData, flightData, gpsTrail, insights, historicalData.length, timeRange])

  return (
    <div className="space-y-6">
      {/* Analytics Header - Responsive Design */}
      <Card className="shadow-lg shadow-gray-200/50">
        <CardContent className="p-4 sm:p-6">
          {/* Mobile-First Header Layout */}
          <div className="space-y-4 lg:space-y-0">
            {/* Title Row - Always Full Width */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                Analytics
                {isLoading && (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin ml-2" />
                )}
              </h2>
              {/* Records Count - Right Side on Desktop, Below Title on Mobile */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Records: {historicalData.length}</span>
              </div>
            </div>
            
            {/* Controls Row - Responsive Grid Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Time Range Selector - Full Width on Mobile */}
              <div className="relative flex-shrink-0">
                <select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value as 'hour' | 'day' | 'week' | 'month')}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-3 sm:px-4 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full sm:w-auto min-w-[120px]"
                >
                  <option value="hour">Last Hour</option>
                  <option value="day">Last Day</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              
              {/* Auto Refresh Controls - Responsive Flex */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors text-sm min-h-[36px] ${autoRefresh
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
                  <span className="whitespace-nowrap">Auto: {autoRefresh ? 'ON' : 'OFF'}</span>
                </button>
                
                {autoRefresh && (
                  <div className="relative flex-shrink-0">
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(Number(e.target.value))}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full sm:w-auto min-w-[80px]"
                      title="Auto refresh interval"
                    >
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                      <option value={15}>15s</option>
                      <option value={20}>20s</option>
                      <option value={30}>30s</option>
                      <option value={60}>1m</option>
                      <option value={120}>2m</option>
                      <option value={300}>5m</option>
                      <option value={600}>10m</option>
                      <option value={900}>15m</option>
                      <option value={1800}>30m</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                )}
                
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px]"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="whitespace-nowrap">Refresh</span>
                </button>
              </div>
            </div>
          </div>
          {/*{historicalData.length > 0 && (
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
          )}*/}
          {/* Status Information - Responsive Layout */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="font-medium">Analytics:</span>
                <span>{historicalData.length} records loaded</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Latest temp:</span>
                <span>{historicalData[historicalData.length - 1]?.temperature?.celsius || 'N/A'}°C</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Auto-refresh:</span>
                <span>{autoRefresh ? `ON (${refreshInterval}s)` : 'OFF'}</span>
              </span>
            </div>
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
                <Mountain className="w-4 h-4 text-green-500" />
                GPS Trail with Flight Path
              </h4>
              <div className="h-64 rounded-lg overflow-hidden relative">
                <MapContainer
                  center={gpsTrail.length > 0 ? gpsTrail[0] as [number, number] : defaultLocation}
                  zoom={13}
                  style={{ height: '16rem', width: '100%' }}
                  className="rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Colored path segments */}
                  {pathSegments.map((segment, index) => (
                    <Polyline
                      key={index}
                      positions={segment.path}
                      color={segment.color}
                      weight={4}
                      opacity={0.8}
                    />
                  ))}
                  
                  {/* Start marker (green) */}
                  {gpsTrail.length > 0 && (
                    <Marker position={gpsTrail[0] as [number, number]}>
                      <Popup>
                        <div className="text-green-600 font-semibold">Flight Start</div>
                        Location: {gpsTrail[0][0].toFixed(4)}°N, {gpsTrail[0][1].toFixed(4)}°E
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* End marker (red) */}
                  {gpsTrail.length > 1 && (
                    <Marker position={gpsTrail[gpsTrail.length - 1] as [number, number]}>
                      <Popup>
                        <div className="text-red-600 font-semibold">Flight End</div>
                        Location: {gpsTrail[gpsTrail.length - 1][0].toFixed(4)}°N, {gpsTrail[gpsTrail.length - 1][1].toFixed(4)}°E
                        <br />
                        Total Points: {gpsTrail.length}
                      </Popup>
                    </Marker>
                  )}
                  
                  {/* Default landmark when no GPS data */}
                  {gpsTrail.length === 0 && (
                    <Marker position={defaultLocation}>
                      <Popup>
                        <div className="text-blue-600 font-semibold">Default Landmark</div>
                        Location: {defaultLocation[0].toFixed(4)}°N, {defaultLocation[1].toFixed(4)}°E
                        <br />
                        <span className="text-gray-500">Waiting for GPS data...</span>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Altitude vs Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-green-500" />
                Altitude vs Time (m)
              </h4>
              <div className="h-64 flex items-center justify-center bg-white rounded border-2 border-dashed border-gray-300">
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
