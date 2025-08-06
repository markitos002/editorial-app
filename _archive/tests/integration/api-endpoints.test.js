// tests/integration/api-endpoints.test.js - Tests de integración para APIs del backend
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock de la aplicación Express
let app;
let server;
let authToken;
let testUserId;

beforeAll(async () => {
  // Importar la aplicación después de configurar mocks
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost/test_db';
  
  // Crear token de prueba
  authToken = jwt.sign(
    { userId: 1, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  if (server) {
    await server.close();
  }
});

describe('API Endpoints Integration Tests', () => {
  describe('Authentication Endpoints', () => {
    test('POST /api/auth/login should authenticate user with valid credentials', async () => {
      const loginData = {
        email: 'admin@editorial.com',
        contrasena: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', loginData.email);
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const loginData = {
        email: 'admin@editorial.com',
        contrasena: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('mensaje');
    });

    test('POST /api/auth/registro should create new user', async () => {
      const userData = {
        nombre: 'Test User',
        email: 'testuser@example.com',
        contrasena: 'password123',
        rol: 'autor'
      };

      const response = await request(app)
        .post('/api/auth/registro')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data.user).toHaveProperty('rol', userData.rol);
      
      // Guardar ID para tests posteriores
      testUserId = response.body.data.user.id;
    });

    test('GET /api/auth/verify should verify valid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
    });

    test('GET /api/auth/verify should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Articles Endpoints', () => {
    test('GET /api/articulos should return articles list', async () => {
      const response = await request(app)
        .get('/api/articulos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('articulos');
      expect(Array.isArray(response.body.data.articulos)).toBe(true);
    });

    test('POST /api/articulos should create new article', async () => {
      const articleData = {
        titulo: 'Test Article',
        resumen: 'This is a test article',
        palabras_clave: 'test, article, integration'
      };

      const response = await request(app)
        .post('/api/articulos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(articleData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.articulo).toHaveProperty('titulo', articleData.titulo);
      expect(response.body.data.articulo).toHaveProperty('estado', 'enviado');
    });

    test('GET /api/articulos/:id should return specific article', async () => {
      // Primero crear un artículo
      const articleData = {
        titulo: 'Specific Test Article',
        resumen: 'Article for specific retrieval test',
        palabras_clave: 'specific, test'
      };

      const createResponse = await request(app)
        .post('/api/articulos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(articleData);

      const articleId = createResponse.body.data.articulo.id;

      // Luego recuperarlo
      const response = await request(app)
        .get(`/api/articulos/${articleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.articulo).toHaveProperty('id', articleId);
      expect(response.body.data.articulo).toHaveProperty('titulo', articleData.titulo);
    });
  });

  describe('Users Endpoints', () => {
    test('GET /api/usuarios should return users list for admin', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('usuarios');
      expect(Array.isArray(response.body.data.usuarios)).toBe(true);
    });

    test('GET /api/usuarios should reject non-admin users', async () => {
      // Crear token de usuario no-admin
      const userToken = jwt.sign(
        { userId: 2, role: 'autor' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('mensaje');
    });
  });

  describe('Statistics Endpoints', () => {
    test('GET /api/estadisticas/admin should return admin statistics', async () => {
      const response = await request(app)
        .get('/api/estadisticas/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('usuarios');
      expect(response.body.data).toHaveProperty('articulos');
      expect(response.body.data).toHaveProperty('revisiones');
    });

    test('GET /api/estadisticas/autor should return author statistics', async () => {
      // Crear token de autor
      const authorToken = jwt.sign(
        { userId: testUserId, role: 'autor' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/estadisticas/autor')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('articulosEnviados');
      expect(response.body.data).toHaveProperty('articulosAprobados');
      expect(response.body.data).toHaveProperty('articulosRechazados');
    });
  });

  describe('Notifications Endpoints', () => {
    test('GET /api/notificaciones/usuario/me should return user notifications', async () => {
      const response = await request(app)
        .get('/api/notificaciones/usuario/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('notificaciones');
      expect(Array.isArray(response.body.data.notificaciones)).toBe(true);
    });

    test('POST /api/notificaciones should create notification', async () => {
      const notificationData = {
        usuario_id: 1,
        tipo: 'sistema',
        titulo: 'Test Notification',
        mensaje: 'This is a test notification'
      };

      const response = await request(app)
        .post('/api/notificaciones')
        .set('Authorization', `Bearer ${authToken}`)
        .send(notificationData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.notificacion).toHaveProperty('titulo', notificationData.titulo);
    });
  });

  describe('Search Endpoints', () => {
    test('GET /api/busqueda should return search results', async () => {
      const response = await request(app)
        .get('/api/busqueda?q=test&tipo=articulos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('resultados');
      expect(Array.isArray(response.body.data.resultados)).toBe(true);
    });

    test('GET /api/busqueda should handle empty search', async () => {
      const response = await request(app)
        .get('/api/busqueda?q=&tipo=articulos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('mensaje');
    });
  });
});
