import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Crear una aplicación mínima para diagnosticar
function MinimalApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎉 Editorial App - Diagnostic Page</h1>
      <p>If you see this page, React is working correctly!</p>
      <p>API URL: {import.meta.env.VITE_API_URL || 'Not defined'}</p>
      <p>Environment: {import.meta.env.MODE || 'Not defined'}</p>
      <button onClick={() => {
        fetch(`${import.meta.env.VITE_API_URL}/articulos`)
          .then(res => res.json())
          .then(data => alert(`API Working! Found ${data.articulos?.length || 0} articles`))
          .catch(err => alert(`API Error: ${err.message}`))
      }}>
        Test API Connection
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MinimalApp />
  </StrictMode>,
)
