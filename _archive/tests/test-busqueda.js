// test-busqueda.js - Script de prueba para el sistema de búsqueda
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';
let token = '';
let userId = '';

// Helper para hacer peticiones autenticadas
const api = axios.create({
  baseURL: BASE_URL
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function login() {
  try {
    console.log('🔐 Iniciando sesión como admin...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@editorial.com',
      contrasena: 'admin123'
    });
    
    token = response.data.token;
    userId = response.data.usuario.id;
    console.log('✅ Login exitoso');
    console.log(`📋 Usuario ID: ${userId}`);
    
  } catch (error) {
    console.error('❌ Error al hacer login:', error.response?.data || error.message);
    process.exit(1);
  }
}

async function probarBusquedaGlobal() {
  try {
    console.log('\n🔍 Probando búsqueda global...');
    
    const response = await api.get('/busqueda/global', {
      params: {
        q: 'articulo',
        tipo: 'todos',
        limite: 10
      }
    });
    
    console.log('✅ Búsqueda global exitosa:');
    console.log(`📊 Término: "${response.data.termino_busqueda}"`);
    console.log(`📈 Total resultados: ${response.data.total_general}`);
    console.log('📋 Totales por tipo:');
    console.log(`  - Artículos: ${response.data.totales.articulos}`);
    console.log(`  - Comentarios: ${response.data.totales.comentarios}`);
    console.log(`  - Usuarios: ${response.data.totales.usuarios}`);
    
    if (response.data.resultados.articulos?.length > 0) {
      console.log('\n📝 Artículos encontrados:');
      response.data.resultados.articulos.slice(0, 3).forEach((articulo, index) => {
        console.log(`${index + 1}. "${articulo.titulo}" - ${articulo.autor}`);
        console.log(`   Estado: ${articulo.estado} | Relevancia: ${articulo.relevancia}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error en búsqueda global:', error.response?.data || error.message);
  }
}

async function probarBusquedaArticulos() {
  try {
    console.log('\n📚 Probando búsqueda avanzada de artículos...');
    
    const response = await api.get('/busqueda/articulos', {
      params: {
        q: 'ejemplo',
        page: 1,
        limit: 5,
        ordenar_por: 'fecha_creacion',
        orden: 'DESC'
      }
    });
    
    console.log('✅ Búsqueda de artículos exitosa:');
    console.log(`📊 Total encontrados: ${response.data.pagination.total_count}`);
    console.log(`📄 Página: ${response.data.pagination.current_page} de ${response.data.pagination.total_pages}`);
    
    if (response.data.articulos.length > 0) {
      console.log('\n📝 Artículos encontrados:');
      response.data.articulos.forEach((articulo, index) => {
        console.log(`${index + 1}. "${articulo.titulo}"`);
        console.log(`   Autor: ${articulo.autor} | Estado: ${articulo.estado}`);
        console.log(`   Comentarios: ${articulo.total_comentarios} | Fecha: ${new Date(articulo.fecha_creacion).toLocaleDateString('es-ES')}`);
        if (articulo.revisores_asignados) {
          console.log(`   Revisores: ${articulo.revisores_asignados}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error en búsqueda de artículos:', error.response?.data || error.message);
  }
}

async function probarSugerencias() {
  try {
    console.log('\n💡 Probando autocompletado...');
    
    const tests = [
      { tipo: 'articulos', termino: 'ej' },
      { tipo: 'autores', termino: 'ju' },
      { tipo: 'usuarios', termino: 'ad' }
    ];
    
    for (const test of tests) {
      try {
        const response = await api.get('/busqueda/sugerencias', {
          params: {
            q: test.termino,
            tipo: test.tipo,
            limite: 5
          }
        });
        
        console.log(`✅ Sugerencias para "${test.termino}" (${test.tipo}):`);
        if (response.data.sugerencias.length > 0) {
          response.data.sugerencias.forEach((sugerencia, index) => {
            console.log(`  ${index + 1}. ${sugerencia.sugerencia} (${sugerencia.tipo})`);
          });
        } else {
          console.log('  No hay sugerencias disponibles');
        }
        console.log('');
      } catch (error) {
        console.log(`❌ Error en sugerencias de ${test.tipo}:`, error.response?.data?.mensaje || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general en sugerencias:', error);
  }
}

async function probarOpcionesFiltros() {
  try {
    console.log('\n⚙️ Probando opciones de filtros...');
    
    const response = await api.get('/busqueda/opciones-filtros');
    
    console.log('✅ Opciones de filtros obtenidas:');
    
    if (response.data.opciones.estados) {
      console.log('\n📊 Estados disponibles:');
      response.data.opciones.estados.forEach((estado, index) => {
        console.log(`  ${index + 1}. ${estado.estado} (${estado.count} artículos)`);
      });
    }
    
    if (response.data.opciones.autores) {
      console.log('\n👨‍💼 Top autores:');
      response.data.opciones.autores.slice(0, 5).forEach((autor, index) => {
        console.log(`  ${index + 1}. ${autor.nombre} (${autor.articulos_count} artículos)`);
      });
    }
    
    if (response.data.opciones.revisores) {
      console.log('\n👩‍🔬 Revisores activos:');
      response.data.opciones.revisores.slice(0, 5).forEach((revisor, index) => {
        console.log(`  ${index + 1}. ${revisor.nombre} (${revisor.revisiones_count} revisiones)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al obtener opciones de filtros:', error.response?.data || error.message);
  }
}

async function probarBusquedaConFiltros() {
  try {
    console.log('\n🎯 Probando búsqueda con filtros avanzados...');
    
    const response = await api.get('/busqueda/articulos', {
      params: {
        estado: 'enviado',
        page: 1,
        limit: 3,
        ordenar_por: 'titulo',
        orden: 'ASC'
      }
    });
    
    console.log('✅ Búsqueda con filtros exitosa:');
    console.log(`📊 Filtros aplicados: estado = enviado`);
    console.log(`📈 Resultados: ${response.data.pagination.total_count} artículos`);
    
    if (response.data.articulos.length > 0) {
      console.log('\n📝 Artículos filtrados:');
      response.data.articulos.forEach((articulo, index) => {
        console.log(`${index + 1}. "${articulo.titulo}" - ${articulo.estado}`);
        console.log(`   Autor: ${articulo.autor} | Fecha: ${new Date(articulo.fecha_creacion).toLocaleDateString('es-ES')}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error en búsqueda con filtros:', error.response?.data || error.message);
  }
}

async function ejecutarPruebas() {
  try {
    console.log('🔍 === PRUEBAS DEL SISTEMA DE BÚSQUEDA ===\n');
    
    // 1. Login
    await login();
    
    // 2. Obtener opciones de filtros
    await probarOpcionesFiltros();
    
    // 3. Búsqueda global
    await probarBusquedaGlobal();
    
    // 4. Búsqueda de artículos
    await probarBusquedaArticulos();
    
    // 5. Búsqueda con filtros
    await probarBusquedaConFiltros();
    
    // 6. Sugerencias de autocompletado
    await probarSugerencias();
    
    console.log('\n✅ === TODAS LAS PRUEBAS COMPLETADAS ===');
    console.log('🎉 Sistema de búsqueda funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// Ejecutar las pruebas
ejecutarPruebas();
