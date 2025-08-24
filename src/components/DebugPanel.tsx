import { useState, useEffect } from 'react'
import { firebaseService } from '../services/firebaseService'

export default function DebugPanel() {
  const [logs, setLogs] = useState<string[]>([])
  const [connectionStatus, setConnectionStatus] = useState('unknown')
  const [rawData, setRawData] = useState<any>(null)

  useEffect(() => {
    // Capture console logs
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      setLogs(prev => [...prev.slice(-20), `LOG: ${message}`])
      originalLog(...args)
    }

    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      setLogs(prev => [...prev.slice(-20), `ERROR: ${message}`])
      originalError(...args)
    }

    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      setLogs(prev => [...prev.slice(-20), `WARN: ${message}`])
      originalWarn(...args)
    }

    // Set up connection monitoring
    firebaseService.setConnectionStatusCallback((status) => {
      setConnectionStatus(status)
    })

    // Subscribe to data
    const unsubscribe = firebaseService.subscribeToWeatherData((data) => {
      setRawData(data)
    })

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
      unsubscribe()
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-black bg-opacity-90 text-white p-4 rounded-lg overflow-auto text-xs font-mono z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Debug Panel</h3>
        <div className={`px-2 py-1 rounded text-xs ${
          connectionStatus === 'connected' ? 'bg-green-600' :
          connectionStatus === 'connecting' ? 'bg-yellow-600' : 'bg-red-600'
        }`}>
          {connectionStatus}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-yellow-400">Raw Data:</div>
        <pre className="text-xs overflow-auto max-h-20">
          {rawData ? JSON.stringify(rawData, null, 1) : 'null'}
        </pre>
      </div>

      <div>
        <div className="text-yellow-400">Console Logs:</div>
        <div className="overflow-auto max-h-48">
          {logs.map((log, index) => (
            <div key={index} className={`text-xs ${
              log.startsWith('ERROR:') ? 'text-red-400' :
              log.startsWith('WARN:') ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
