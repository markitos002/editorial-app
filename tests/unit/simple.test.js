// tests/unit/simple.test.js - Test simple para verificar configuración
describe('Simple Test', () => {
  test('should be able to run tests', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have access to localStorage mock', () => {
    // Verificar que localStorage está disponible
    expect(localStorage).toBeDefined();
    expect(typeof localStorage.setItem).toBe('function');
    expect(typeof localStorage.getItem).toBe('function');
  });

  test('should have environment variables', () => {
    expect(process.env.VITE_API_URL).toBe('http://localhost:4000/api');
  });
});
