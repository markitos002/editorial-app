// verificacion-sistema.js - Script para verificar el estado completo del sistema
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

class VerificadorSistema {
  constructor() {
    this.token = null;
    this.resultados = {
      backend: false,
      auth: false,
      busqueda_global: false,
      busqueda_articulos: false,
      autocompletado: false,
      opciones_filtros: false
    };
  }

  async verificarTodo() {
    console.log('🚀 === VERIFICACIÓN COMPLETA DEL SISTEMA ===\n');
    
    try {
      await this.verificarBackend();
      await this.verificarAuth();
      await this.verificarBusquedaGlobal();
      await this.verificarBusquedaArticulos();
      await this.verificarAutocompletado();
      await this.verificarOpcionesFiltros();
      
      this.mostrarResumen();
      
    } catch (error) {
      console.error('❌ Error fatal en la verificación:', error.message);
    }
  }

  async verificarBackend() {
    try {
      console.log('🔧 Verificando backend...');
      const response = await axios.get(`${API_BASE}`, { timeout: 5000 });
      this.resultados.backend = true;
      console.log('✅ Backend funcionando correctamente\n');
    } catch (error) {
      console.log('❌ Backend no responde');
      console.log('💡 Ejecuta: cd backend && node app.js\n');
      throw new Error('Backend no disponible');
    }
  }

  async verificarAuth() {
    try {
      console.log('🔐 Verificando autenticación...');
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@editorial.com',
        contrasena: 'admin123'
      });
      
      this.token = response.data.token;
      this.resultados.auth = true;
      console.log('✅ Autenticación funcionando correctamente');
      console.log(`👤 Usuario: ${response.data.usuario.nombre}\n`);
    } catch (error) {
      console.log('❌ Error en autenticación:', error.response?.data?.mensaje || error.message);
      throw new Error('Autenticación falló');
    }
  }

  async realizarPeticionAutenticada(url, descripcion) {
    const config = {
      headers: { Authorization: `Bearer ${this.token}` },
      timeout: 10000
    };
    
    try {
      console.log(`🔍 Verificando ${descripcion}...`);
      const response = await axios.get(url, config);
      console.log(`✅ ${descripcion} funcionando correctamente`);
      return response.data;
    } catch (error) {
      console.log(`❌ Error en ${descripcion}:`, error.response?.data?.mensaje || error.message);
      throw error;
    }
  }

  async verificarBusquedaGlobal() {
    try {
      const url = `${API_BASE}/busqueda/global?q=articulo&tipo=todos&limite=10`;
      const data = await this.realizarPeticionAutenticada(url, 'búsqueda global');
      
      console.log(`📊 Resultados encontrados: ${data.total_general}`);
      console.log(`   - Artículos: ${data.totales.articulos}`);
      console.log(`   - Comentarios: ${data.totales.comentarios}`);
      console.log(`   - Usuarios: ${data.totales.usuarios}\n`);
      
      this.resultados.busqueda_global = true;
    } catch (error) {
      console.log('');
    }
  }

  async verificarBusquedaArticulos() {
    try {
      const url = `${API_BASE}/busqueda/articulos?q=ejemplo&page=1&limit=5`;
      const data = await this.realizarPeticionAutenticada(url, 'búsqueda de artículos');
      
      console.log(`📚 Artículos encontrados: ${data.pagination.total_count}`);
      if (data.articulos.length > 0) {
        console.log(`   Primer resultado: "${data.articulos[0].titulo}"`);
      }
      console.log('');
      
      this.resultados.busqueda_articulos = true;
    } catch (error) {
      console.log('');
    }
  }

  async verificarAutocompletado() {
    try {
      const url = `${API_BASE}/busqueda/sugerencias?q=ej&tipo=articulos&limite=5`;
      const data = await this.realizarPeticionAutenticada(url, 'autocompletado');
      
      console.log(`💡 Sugerencias encontradas: ${data.sugerencias.length}`);
      if (data.sugerencias.length > 0) {
        console.log(`   Primera sugerencia: "${data.sugerencias[0].sugerencia}"`);
      }
      console.log('');
      
      this.resultados.autocompletado = true;
    } catch (error) {
      console.log('');
    }
  }

  async verificarOpcionesFiltros() {
    try {
      const url = `${API_BASE}/busqueda/opciones-filtros`;
      const data = await this.realizarPeticionAutenticada(url, 'opciones de filtros');
      
      console.log(`⚙️ Estados disponibles: ${data.opciones.estados?.length || 0}`);
      console.log(`👨‍💼 Autores disponibles: ${data.opciones.autores?.length || 0}\n`);
      
      this.resultados.opciones_filtros = true;
    } catch (error) {
      console.log('');
    }
  }

  mostrarResumen() {
    console.log('📋 === RESUMEN DE VERIFICACIÓN ===');
    
    const total = Object.keys(this.resultados).length;
    const exitosos = Object.values(this.resultados).filter(Boolean).length;
    const porcentaje = Math.round((exitosos / total) * 100);
    
    Object.entries(this.resultados).forEach(([componente, estado]) => {
      const icono = estado ? '✅' : '❌';
      const nombre = componente.replace(/_/g, ' ').toUpperCase();
      console.log(`${icono} ${nombre}`);
    });
    
    console.log('\n📊 ESTADO GENERAL:');
    console.log(`🎯 ${exitosos}/${total} componentes funcionando (${porcentaje}%)`);
    
    if (porcentaje === 100) {
      console.log('🎉 ¡Sistema completamente funcional!');
      console.log('💡 Puedes abrir http://localhost:5173 para probar el frontend');
    } else if (porcentaje >= 80) {
      console.log('⚠️ Sistema mayormente funcional con algunos problemas menores');
    } else {
      console.log('🚨 Sistema con problemas significativos que requieren atención');
    }
    
    console.log('\n🔗 URLs importantes:');
    console.log('- Frontend: http://localhost:5173');
    console.log('- Backend API: http://localhost:4000/api');
    console.log('- Página de búsqueda: http://localhost:5173/busqueda');
  }
}

// Ejecutar verificación
const verificador = new VerificadorSistema();
verificador.verificarTodo();
