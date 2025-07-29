# Multi-stage Docker build for Editorial App

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production && \
    cd backend && npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build:production

# Stage 2: Production stage
FROM nginx:alpine AS production

# Install Node.js for backend (if needed)
RUN apk add --no-cache nodejs npm

# Create app directory
RUN mkdir -p /app/backend

# Copy built frontend to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy backend files
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/backend/node_modules /app/backend/node_modules

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Expose ports
EXPOSE 80 4000

# Start both frontend (nginx) and backend
CMD ["/start.sh"]
