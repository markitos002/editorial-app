import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Resolver aliases  
  resolve: {
    alias: {
      // Mock framer-motion para evitar errores de React 19
      'framer-motion': path.resolve(__dirname, './src/mocks/framer-motion.js')
    }
  },
  
  // Development server configuration
  server: {
    hmr: {
      overlay: false, // Reduce overlay de errores
    },
    // SPA fallback para desarrollo
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Production build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Copy _redirects file for Render deployment
    copyPublicDir: true,
    
    // Rollup options for advanced optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          icons: ['@chakra-ui/icons', 'react-icons'],
          utils: ['axios']
        }
      }
    },
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    }
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },

  // Preview server (for built app)
  preview: {
    port: 3000,
    host: true,
    // SPA fallback para preview
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
