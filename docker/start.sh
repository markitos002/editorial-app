#!/bin/sh

# Start script for Docker container
# Starts both frontend (nginx) and backend (Node.js)

echo "🚀 Starting Editorial App..."

# Start backend in background
echo "Starting backend server..."
cd /app/backend && npm start &

# Wait a moment for backend to start
sleep 5

# Start nginx in foreground
echo "Starting frontend server (nginx)..."
nginx -g "daemon off;"
