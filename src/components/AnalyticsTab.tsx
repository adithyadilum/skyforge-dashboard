import React, { useMemo, useCallback } from "react"
import { Sun, Thermometer, Droplets, Gauge, Wind, MapPin, BarChart3, TrendingUp, Download, FileText, RefreshCw, ChevronDown, Mountain } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { WeatherData } from '../types'

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

const AnalyticsTab = React.memo(({ weatherData }: AnalyticsTabProps) => {
  // Memoize static data to prevent re-creation on every render
  const temperatureData = useMemo(() => {
    // Include current temperature from Firebase if available
    const currentTemp = weatherData?.temperature.celsius || 22
    const baseData = [
      { time: '00:00', value: 18.5 },
      { time: '03:00', value: 16.2 },
      { time: '06:00', value: 19.8 },
      { time: '09:00', value: 23.4 },
      { time: '12:00', value: 27.6 },
      { time: '15:00', value: 29.1 },
      { time: '18:00', value: 26.3 },
      { time: '21:00', value: 22.8 }
    ]
    
    // Add current reading as the latest point
    if (weatherData) {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
      baseData.push({ time: currentTime, value: currentTemp })
    }
    
    return baseData
  }, [weatherData])

  const environmentalData = useMemo(() => {
    // Include current environmental data from Firebase if available
    const currentTemp = weatherData?.temperature.celsius || 22
    const currentHumidity = weatherData?.humidity || 51
    const currentPressure = weatherData?.pressure.hPa || 1015
    const currentUV = weatherData?.uvIndex.value || 2
    
    const baseData = [
      { time: '00:00', temperature: 18.5, humidity: 65, pressure: 1013, uv: 0 },
      { time: '03:00', temperature: 16.2, humidity: 72, pressure: 1014, uv: 0 },
      { time: '06:00', temperature: 19.8, humidity: 68, pressure: 1015, uv: 1.2 },
      { time: '09:00', temperature: 23.4, humidity: 58, pressure: 1016, uv: 3.8 },
      { time: '12:00', temperature: 27.6, humidity: 45, pressure: 1015, uv: 5.3 },
      { time: '15:00', temperature: 29.1, humidity: 42, pressure: 1014, uv: 4.9 },
      { time: '18:00', temperature: 26.3, humidity: 48, pressure: 1013, uv: 2.1 },
      { time: '21:00', temperature: 22.8, humidity: 55, pressure: 1012, uv: 0 }
    ]
    
    // Add current readings as the latest point
    if (weatherData) {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
      baseData.push({ 
        time: currentTime, 
        temperature: currentTemp, 
        humidity: currentHumidity, 
        pressure: currentPressure, 
        uv: currentUV 
      })
    }
    
    return baseData
  }, [weatherData])

  const flightData = useMemo(() => {
    // Include current GPS and flight data from Firebase if available
    const currentSpeed = weatherData?.wind.speed || 0
    const currentAltitude = weatherData?.location.altitude || 0
    
    const baseData = [
      { time: '10:00', speed: 0, altitude: 0 },
      { time: '10:05', speed: 3.2, altitude: 45 },
      { time: '10:10', speed: 5.8, altitude: 120 },
      { time: '10:15', speed: 4.1, altitude: 142 },
      { time: '10:20', speed: 3.6, altitude: 142 },
      { time: '10:25', speed: 2.8, altitude: 98 },
      { time: '10:30', speed: 0, altitude: 0 }
    ]
    
    // Add current readings as the latest point
    if (weatherData) {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
      baseData.push({ 
        time: currentTime, 
        speed: currentSpeed, 
        altitude: currentAltitude 
      })
    }
    
    return baseData
  }, [weatherData])

  const gpsTrail = useMemo(() => {
    // Include current GPS coordinates if available
    const baseTrail: [number, number][] = [
      [7.2901, 80.6337],
      [7.2905, 80.6340],
      [7.2910, 80.6345],
      [7.2915, 80.6342],
      [7.2920, 80.6338],
      [7.2918, 80.6335]
    ]
    
    // Add current GPS position if available
    if (weatherData?.location.latitude && weatherData?.location.longitude) {
      baseTrail.push([weatherData.location.latitude, weatherData.location.longitude])
    }
    
    return baseTrail
  }, [weatherData])

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
            </h2>
            {/* Time Range Selector in Header */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm">
                  <option>Last 1h</option>
                  <option>Last 6h</option>
                  <option>Last 24h</option>
                  <option>Last 7d</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
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
              <div className="text-sm text-blue-600 font-medium">Current Temperature</div>
              <div className="text-2xl font-bold text-blue-900">
                {weatherData?.temperature.celsius?.toFixed(1) || '22.0'}°C
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-yellow-600 font-medium">UV Index</div>
              <div className="text-2xl font-bold text-yellow-900">
                {weatherData?.uvIndex.value?.toFixed(1) || '2.0'}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">CO₂ Level</div>
              <div className="text-lg font-bold text-green-900 flex items-center gap-1">
                {weatherData?.airQuality.co2 || '450'} ppm
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium">Humidity</div>
              <div className="text-2xl font-bold text-purple-900">
                {weatherData?.humidity?.toFixed(0) || '51'}%
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
