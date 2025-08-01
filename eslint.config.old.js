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
      'test.html'
    ]
  },
      'build/**',
      'coverage/**',
      'node_modules/**',
      '*.min.js',
      'uploads/**',
      '.vscode/**',
      '.git/**',
      // Backup and temporary files
      '**/*-backup.{js,jsx}',
      '**/*.backup.{js,jsx}',
      // Specific problematic files during development
      'src/components/ResponsiveLayout.jsx', // Has parsing errors
      'backend/dev-tools/**', // Development tools with loose coding standards
      'backend/test-*.js', // Ad-hoc test files
      'verificacion-sistema.js', // Development verification script
    ]
  },

  // Frontend (src/) - React/Vite
  {
    files: ['src/**/*.{js,jsx}'],
    ...js.configs.recommended,
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2022,
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
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-console': 'warn',
      'prefer-const': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Backend (backend/) - Node.js/CommonJS
  {
    files: ['backend/**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-console': 'off', // Allow console in backend
      'prefer-const': 'warn',
    },
  },

  // Tests - Jest
  {
    files: ['tests/**/*.{js,jsx}', '**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-console': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },

  // Cypress E2E Tests
  {
    files: ['tests/e2e/**/*.{js,jsx}', 'cypress/**/*.{js,jsx}', '**/*.cy.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // Cypress globals
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        before: 'readonly',
        after: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-console': 'off',
    },
  },

  // Config files and scripts
  {
    files: [
      '*.config.{js,mjs}',
      'scripts/**/*.js',
      'vite.config.js',
      'jest.config.js',
      'cypress.config.js',
      'eslint.config.js'
    ],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      'no-console': 'off',
    },
  },

  // Development and build tools
  {
    files: ['verificacion-sistema.js', 'test-conexion-remota.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn'], // More lenient for development scripts
      'no-console': 'off',
    },
  },
]
