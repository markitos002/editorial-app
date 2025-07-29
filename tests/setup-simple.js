// tests/setup.js - Configuración global para Jest simplificada
import '@testing-library/jest-dom';

// Mock de variables de entorno
process.env.VITE_API_URL = 'http://localhost:4000/api';

// Polyfills para Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de fetch para las peticiones HTTP
global.fetch = jest.fn();

// Configuración de timeouts para tests asíncronos
jest.setTimeout(10000);

// Limpiar mocks entre tests
beforeEach(() => {
  localStorage.clear();
  localStorage.getItem.mockClear();
  localStorage.setItem.mockClear();
  localStorage.removeItem.mockClear();
  fetch.mockClear();
});
