# 🚀 Deployment Guide - Editorial App

## Quick Deployment Checklist

### Pre-deployment Steps ✅

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Build process verified
- [ ] Health check script tested

### Production Deployment Steps

#### 1. **Environment Setup**

Create production environment file:
```bash
cp .env.production.example .env.production
# Edit with actual production values
```

Required environment variables:
- `DATABASE_URL`: Production database connection
- `JWT_SECRET`: Secure JWT secret (minimum 32 chars)
- `VITE_API_URL`: Production API URL
- `CORS_ORIGIN`: Production frontend URL

#### 2. **Database Setup**

```bash
# Create production database
createdb editorialdata

# Run migrations
cd backend
NODE_ENV=production npm run migrate
NODE_ENV=production npm run seed:prod
```

#### 3. **Build Application**

```bash
# Install production dependencies
npm ci --only=production

# Build for production
npm run build:production

# Verify build
npm run preview:production
```

#### 4. **Deploy Options**

##### Option A: Traditional Server
```bash
# Copy built files to server
rsync -avz --delete dist/ user@server:/var/www/editorial-app/
rsync -avz --delete backend/ user@server:/opt/editorial-app/backend/

# Start backend service
pm2 start ecosystem.config.js --env production
```

##### Option B: Docker Deployment
```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d

# Verify deployment
docker-compose ps
docker-compose logs app
```

##### Option C: Cloud Platforms

**Heroku:**
```bash
# Create Heroku app
heroku create editorial-app-prod

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

**Vercel (Frontend only):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 5. **Post-deployment Verification**

```bash
# Health check
npm run health-check

# Manual verification
curl -f https://your-domain.com/health
curl -f https://api.your-domain.com/health
```

#### 6. **Monitoring Setup**

- Set up error tracking (Sentry, LogRocket)
- Configure performance monitoring
- Set up uptime monitoring
- Configure backup schedules

## CI/CD Pipeline

The project includes a complete GitHub Actions workflow:

### Automatic Deployment Triggers

- **Staging**: Push to `develop` branch
- **Production**: Push to `main` branch

### Pipeline Stages

1. **Test Stage**: All tests must pass
2. **Build Stage**: Application build verification
3. **Deploy Stage**: Automated deployment
4. **Health Check**: Post-deployment verification

### Manual Deployment

If automatic deployment is disabled:

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production (after all tests pass)
npm run deploy:production
```

## Security Considerations

### SSL/TLS Setup
- Use HTTPS in production
- Configure SSL certificates
- Set secure cookies

### Environment Security
- Never commit `.env` files
- Use strong JWT secrets
- Enable CORS protection
- Set up rate limiting

### Database Security
- Use connection pooling
- Enable SSL for database connections
- Regular backups
- Access control

## Performance Optimization

### Frontend Optimizations
- Gzip compression enabled
- Static asset caching
- Code splitting implemented
- Image optimization

### Backend Optimizations
- Database indexing
- Query optimization
- Redis caching (optional)
- Connection pooling

## Rollback Strategy

### Quick Rollback
```bash
# Docker rollback
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --scale app=0
# Deploy previous version

# Traditional server rollback
pm2 stop all
# Restore previous version
pm2 start ecosystem.config.js
```

### Database Rollback
```bash
# Rollback database migrations if needed
npm run migrate:rollback
```

## Monitoring & Maintenance

### Health Monitoring
- Automated health checks every 5 minutes
- Alert on 3 consecutive failures
- Monitor response times

### Log Management
- Centralized logging
- Log rotation
- Error alerting

### Backup Strategy
- Daily database backups
- Weekly full system backups
- Backup retention: 30 days

## Troubleshooting

### Common Deployment Issues

**Build Failures:**
```bash
# Clear cache and rebuild
npm run clean
npm run build:production
```

**Database Connection Issues:**
```bash
# Test database connection
node -e "console.log(process.env.DATABASE_URL)"
```

**Port Conflicts:**
```bash
# Check port usage
netstat -tulpn | grep :80
netstat -tulpn | grep :4000
```

### Performance Issues

**High Memory Usage:**
- Check for memory leaks
- Monitor Node.js heap size
- Review database query performance

**Slow Response Times:**
- Enable application profiling
- Check database indexes
- Review API endpoint performance

## Support Contacts

- **DevOps**: devops@editorial-app.com
- **Emergency**: +1-555-0123
- **Slack**: #editorial-app-prod

---

**Last Updated**: July 28, 2025  
**Version**: 1.0.0
