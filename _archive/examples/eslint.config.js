import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Global ignores - migrados desde .eslintignore
  {
    ignores: [
      // Build outputs
      'dist/**',
      'build/**',
      '.next/**',
      'out/**',
      
      // Dependencies
      'node_modules/**',
      
      // Logs y archivos temporales
      '*.log',
      '**/*.log',
      'logs/**',
      'tmp/**',
      'temp/**',
      '*.tmp',
      '*.temp',
      
      // Cache directories
      'coverage/**',
      '.nyc_output/**',
      '.cache/**',
      '.parcel-cache/**',
      '.eslintcache',
      
      // Environment files
      '.env',
      '.env.*',
      
      // Test outputs
      'cypress/downloads/**',
      'cypress/videos/**',
      'cypress/screenshots/**',
      'test-results/**',
      'playwright-report/**',
      
      // IDE files
      '.vscode/**',
      '.idea/**',
      
      // OS files
      '.DS_Store',
      'Thumbs.db',
      
      // Archivos específicos problemáticos
      'src/context/AuthContext.clean.jsx',
      'src/context/AuthContext.simple.jsx',
      'src/main-diagnostic.jsx',
      'backend/test-*.js',
      'backend/debug-*.js',
      'backend/simple-test-*.js',
      'backend/check-*.js',
      'backend/create-*.js',
      'backend/migrate-*.js',
      'backend/*-*.sql',
      'backend/revisar-*.js',
      'backend/investigar-*.js',
      'backend/update-*.js',
      'verificacion-sistema.js',
      'test-conexion-remota.js',
      'test-login.json',
      'test.html',
      
      // Archivos de backup y desarrollo
      'src/**/*-backup.jsx',
      'src/**/*.backup.jsx',
      'backend/**/*-backup.js',
      'backend/dev-tools/**',
      'eslint.config.old.js',
      
      // Archivos JSON con contenido no-JS
      'babel.config.json',
      
      // HTML files no deben ser parseados como JS
      'index.html',
      '**/*.html'
    ]
  },

  // Frontend: React + Vite (sin HTML ni JSON)
  {
    files: ['src/**/*.{js,jsx,ts,tsx}', 'vite.config.js'],
    ...js.configs.recommended,
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z_]',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'warn',
      'prefer-const': 'warn'
    },
  },

  // Backend: Node.js + Express
  {
    files: ['backend/**/*.js', 'ecosystem.config.cjs'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z_]',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off', // Permitir console en backend
      'prefer-const': 'warn'
    },
  },

  // Tests: Jest
  {
    files: ['tests/**/*.{js,jsx,ts,tsx}', '*.test.{js,jsx}', '*.spec.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z_]',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'prefer-const': 'warn'
    },
  },

  // Cypress E2E Tests
  {
    files: ['cypress/**/*.{js,ts}', 'tests/e2e/**/*.{js,ts}'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        chai: 'readonly'
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z_]',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'prefer-const': 'warn'
    },
  },

  // Config files (solo .js, no .json)
  {
    files: [
      '*.config.{js,cjs,mjs}',
      'eslint.config.js',
      'jest.config.js'
    ],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^[A-Z_]',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'prefer-const': 'warn'
    },
  },
]
