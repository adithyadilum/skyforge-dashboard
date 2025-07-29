import { Battery, Cpu, CheckCircle, MapPin } from "lucide-react"
import { Card, CardContent } from "./ui/card"

interface SystemTabProps {
  currentDateTime: Date
  systemData?: any
}

export default function SystemTab({ currentDateTime, systemData }: SystemTabProps) {
  return (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section - Left Side */}
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-700 mb-3">Current Position</h4>
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-50"></div>
                <MapPin className="w-8 h-8 text-gray-600 z-10" />
                <div className="absolute bottom-3 left-3 text-sm font-medium text-gray-700">
                  7.2901° N, 80.6337° E
                </div>
                <div className="absolute top-3 right-3 text-xs bg-white/80 px-2 py-1 rounded">
                  Live GPS
                </div>
              </div>
            </div>
            
            {/* Telemetry Data - Right Side */}
            <div className="flex flex-col">
              <h4 className="font-medium text-gray-700 mb-3">Flight Data</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">GPS Location:</span>
                  <span className="font-semibold text-gray-900">7.2901, 80.6337</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">GPS Altitude:</span>
                  <span className="font-semibold text-gray-900">142 m</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Ground Speed:</span>
                  <span className="font-semibold text-gray-900">3.6 m/s</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className="font-semibold text-blue-600">Hovering</span>
                </div>
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Battery Voltage */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Battery Voltage</div>
              <div className="text-lg font-bold text-gray-900">
                {systemData?.batteryVoltage?.toFixed(1) || '11.7'} V
              </div>
            </div>
            
            {/* NRF Link */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">NRF Link</div>
              <div className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Connected
              </div>
            </div>
            
            {/* Control Channel */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Control Channel</div>
              <div className="text-sm font-semibold text-gray-900">NRF24L01</div>
              <div className="text-xs text-gray-500">(2.4GHz)</div>
            </div>
            
            {/* Uplink Status */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Uplink Status</div>
              <div className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Active
              </div>
            </div>
            
            {/* Uptime */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Uptime</div>
              <div className="text-lg font-bold text-gray-900">
                {systemData?.uptime || '00:13:22'}
              </div>
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
              <span className="font-semibold text-gray-900">
                {systemData?.esp32Temp?.toFixed(1) || '39.2'}°C
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
