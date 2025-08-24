function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2563eb' }}>🔧 Simple Import Test</h1>
      
      <div style={{ 
        background: '#f3f4f6', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <p>✅ React is working</p>
        <p>✅ Basic components render</p>
        <p>✅ Styling works</p>
      </div>

      <div style={{ 
        background: '#ecfdf5', 
        padding: '15px', 
        borderRadius: '8px'
      }}>
        <h3>Next: Test Firebase Components</h3>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}

export default App
