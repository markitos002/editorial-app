// tests/setup.js - Configuración global para Jest
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

// Mock de window.location
delete window.location;
window.location = {
  href: '',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn()
};

// Mock de fetch para las peticiones HTTP
global.fetch = jest.fn();

// Configuración de timeouts para tests asíncronos
jest.setTimeout(10000);

// Limpiar mocks entre tests
beforeEach(() => {
  localStorage.clear();
  fetch.mockClear();
});

// Mock de console.error para evitar ruido en los tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
