// pages/TestMinimal.jsx - Prueba ULTRA minimalista - Solo React puro
import React from 'react';

const TestMinimal = () => {
  console.log('TestMinimal: Renderizando página minimalista...');
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>
        ✅ Página Minimalista - Solo React
      </h1>
      <p style={{ marginBottom: '15px' }}>
        Esta página usa SOLO React puro, sin Chakra UI, sin providers, sin nada.
      </p>
      <p style={{ marginBottom: '15px' }}>
        Si esta página funciona, el problema está en Chakra UI o ThemeProvider.
      </p>
      <button 
        onClick={() => alert('¡React puro funciona!')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#3182CE', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Probar React Puro
      </button>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#F7FAFC', 
        borderRadius: '5px' 
      }}>
        <strong>Debug Info:</strong><br />
        - React Version: {React.version}<br />
        - Date: {new Date().toISOString()}<br />
        - Environment: {process.env.NODE_ENV || 'development'}<br />
        - UserAgent: {navigator.userAgent.substring(0, 50)}...
      </div>
    </div>
  );
};

export default TestMinimal;
