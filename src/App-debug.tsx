import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('Loading...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Test if environment variables are available
      const hasEnv = !!(
        import.meta.env.VITE_FIREBASE_API_KEY &&
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
        import.meta.env.VITE_FIREBASE_DATABASE_URL &&
        import.meta.env.VITE_FIREBASE_PROJECT_ID
      )

      if (hasEnv) {
        setStatus('Firebase environment variables are loaded ✅')
      } else {
        setStatus('Firebase environment variables are missing ❌')
        setError('Check your .env file')
      }

      // Skip Firebase import test for now
      setStatus('Environment check complete ✅')

    } catch (err) {
      setError('Error during initialization: ' + (err as Error).message)
    }
  }, [])

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2563eb' }}>🔧 SkyForge Dashboard Debug</h1>
      
      <div style={{ 
        background: '#f3f4f6', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Status:</h3>
        <p>{status}</p>
        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '10px', 
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ 
        background: '#ecfdf5', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Environment Check:</h3>
        <ul>
          <li>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</li>
          <li>Database URL: {import.meta.env.VITE_FIREBASE_DATABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
        </ul>
      </div>

      <div style={{ 
        background: '#fffbeb', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Next Steps:</h3>
        <p>If all checks pass, we can restore the full dashboard.</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}

export default App
