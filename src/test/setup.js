import '@testing-library/jest-dom'

// Mock para localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock para window.alert
global.alert = vi.fn();

// Mock para window.confirm
global.confirm = vi.fn(() => true);

// Mock para console.error para evitar logs innecesarios en tests
global.console.error = vi.fn();

// Configuración global para tests
beforeEach(() => {
  vi.clearAllMocks();
});
