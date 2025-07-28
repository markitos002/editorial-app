// jest.config.js - Configuración de Jest para testing
export default {
  // Entorno de testing
  testEnvironment: 'jsdom',
  
  // Archivos de setup
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
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
  moduleNameMapping: {
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
  }
};
