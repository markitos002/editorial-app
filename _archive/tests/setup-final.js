// tests/setup-final.js - Configuración final para Jest
import '@testing-library/jest-dom';

// Mock de variables de entorno
process.env.VITE_API_URL = 'http://localhost:4000/api';

// Mock más completo de import.meta.env para Vite
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:4000/api',
        NODE_ENV: 'test'
      }
    }
  },
  writable: true
});

// Polyfills para Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock de fetch
global.fetch = jest.fn();

// Timeout para tests asíncronos
jest.setTimeout(10000);
