// jest.config.js - Configuración de Jest para testing
module.exports = {
  // Entorno de testing
  testEnvironment: 'jsdom',
  
  // Archivos de setup
  setupFilesAfterEnv: ['<rootDir>/tests/setup-final.js'],
  
  // Patrones de archivos de test
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx}',
    '<rootDir>/src/**/*.test.{js,jsx}'
  ],
  
  // Extensiones de archivos a procesar
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Transformaciones
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Mapeo de módulos para resolver imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  
  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.test.{js,jsx}',
    '!src/test/**'
  ],
  
  // Variables de entorno para testing
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },

  // Globales para Jest - Mock de import.meta
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:4000/api',
        NODE_ENV: 'test'
      }
    }
  }
};
