# 📚 Editorial App - Comprehensive Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Development Guide](#development-guide)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [API Documentation](#api-documentation)
8. [Contributing](#contributing)
9. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

**Editorial App** is a comprehensive editorial management system built with modern web technologies. It provides a complete solution for managing articles, reviews, user roles, and editorial workflows.

### 🌟 Key Features

- **Authentication & Authorization**: Role-based access control (Admin, Editor, Author)
- **Article Management**: Complete CRUD operations for articles
- **Review System**: Comprehensive article review and approval workflow
- **File Upload**: Support for document attachments
- **Notifications**: Real-time notification system
- **Responsive Design**: Mobile-first responsive UI
- **Search & Filtering**: Advanced article search capabilities
- **Dashboard Analytics**: Editorial statistics and metrics

### 🛠️ Technology Stack

**Frontend:**
- React 19.1.0
- Vite (Build tool)
- Chakra UI (Component library)
- React Router (Navigation)
- Axios (HTTP client)
- React Testing Library + Jest (Testing)
- Cypress (E2E Testing)

**Backend:**
- Node.js + Express
- PostgreSQL (Database)
- JWT (Authentication)
- Multer (File uploads)
- Bcrypt (Password hashing)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (Reverse proxy)
- ESLint (Code linting)

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 5173    │    │   Port: 4000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Directory Structure

```
editorial-app/
├── 📁 src/                    # Frontend source code
│   ├── 📁 components/         # React components
│   ├── 📁 pages/             # Page components
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 services/          # API services
│   ├── 📁 utils/             # Utility functions
│   └── 📁 styles/            # CSS and styling
├── 📁 backend/               # Backend source code
│   ├── 📁 controllers/       # Route controllers
│   ├── 📁 middleware/        # Express middleware
│   ├── 📁 models/           # Database models
│   ├── 📁 routes/           # API routes
│   └── 📁 utils/            # Backend utilities
├── 📁 tests/                # Test files
│   ├── 📁 unit/             # Unit tests
│   ├── 📁 integration/      # Integration tests
│   └── 📁 e2e/             # End-to-end tests
├── 📁 docs/                 # Documentation
├── 📁 docker/               # Docker configuration
└── 📁 scripts/              # Build and deployment scripts
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/markitos002/editorial-app.git
   cd editorial-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Setup environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env.local
   cp backend/.env.example backend/.env
   
   # Edit the files with your configuration
   ```

4. **Setup database**
   ```bash
   # Create database
   createdb editorialdata
   
   # Run migrations
   cd backend
   npm run migrate
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - Default admin login: admin@editorial.com / admin123

### Docker Setup

For a complete Docker-based setup:

```bash
# Development environment
docker-compose up -d

# Production environment
docker-compose -f docker-compose.prod.yml up -d
```

## 💻 Development Guide

### Code Standards

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **Code Reviews**: All PRs require review

### Git Workflow

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit: `git commit -m "feat: add feature description"`
3. Push branch: `git push origin feature/description`
4. Create Pull Request
5. Code review and merge

### Environment Variables

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Editorial App
```

**Backend (.env):**
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/editorialdata
JWT_SECRET=your-jwt-secret
UPLOAD_PATH=./uploads
```

## 🧪 Testing

### Test Strategy

The application includes comprehensive testing at three levels:

#### Unit Tests (Jest + React Testing Library)
```bash
# Run unit tests
npm run test:unit

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

#### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

#### End-to-End Tests (Cypress)
```bash
# Run E2E tests (headless)
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

#### Run All Tests
```bash
npm run test:all
```

### Test Coverage

Current test coverage:
- **Unit Tests**: 15/15 passing (100%)
- **Integration Tests**: Configured
- **E2E Tests**: 16/16 passing (100%)

## 🚀 Deployment

### Build for Production

```bash
# Build frontend
npm run build:production

# Preview production build
npm run preview:production
```

### Deployment Options

#### 1. Traditional Server Deployment

```bash
# Build the application
npm run build:production

# Copy dist/ folder to your web server
rsync -avz dist/ user@server:/var/www/editorial-app/
```

#### 2. Docker Deployment

```bash
# Build Docker image
docker build -t editorial-app .

# Run container
docker run -p 80:80 -p 4000:4000 editorial-app
```

#### 3. Docker Compose (Recommended)

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration

- **Development**: `.env.local`
- **Staging**: `.env.staging` 
- **Production**: `.env.production`

### Health Checks

```bash
# Check application health
npm run health-check

# Manual health check
curl http://localhost:3000/health
```

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Article Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articulos` | Get all articles |
| GET | `/api/articulos/:id` | Get article by ID |
| POST | `/api/articulos` | Create new article |
| PUT | `/api/articulos/:id` | Update article |
| DELETE | `/api/articulos/:id` | Delete article |

### User Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/usuarios` | Get all users |
| GET | `/api/usuarios/:id` | Get user by ID |
| POST | `/api/usuarios` | Create new user |
| PUT | `/api/usuarios/:id` | Update user |
| DELETE | `/api/usuarios/:id` | Delete user |

For complete API documentation, see [API.md](./API.md).

## 🤝 Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Development Setup

1. Follow the installation guide above
2. Run tests to ensure everything works
3. Make your changes
4. Add appropriate tests
5. Run the full test suite

### Code Review Process

- All PRs require at least one review
- Tests must pass
- Code must follow linting rules
- Documentation must be updated if needed

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

#### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Docker Issues
```bash
# Clean Docker containers and images
docker-compose down
docker system prune -a

# Rebuild containers
docker-compose build --no-cache
```

### Performance Issues

#### Slow Build Times
- Use `npm run build:staging` for faster builds
- Clear Vite cache: `rm -rf node_modules/.vite`

#### Database Performance
- Check database indexes
- Analyze query performance
- Monitor connection pool usage

### Getting Help

- **Issues**: Create a GitHub issue
- **Discussions**: Use GitHub Discussions
- **Email**: contact@editorial-app.com

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Documentation**: This README and docs/ folder
- **Issues**: GitHub Issues
- **Email**: support@editorial-app.com

---

**Version**: 1.0.0  
**Last Updated**: July 28, 2025  
**Maintained by**: Editorial App Team
