#!/bin/bash

# Build script for Render deployment
echo "🚀 Building Editorial App for Render..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend for production
echo "🏗️ Building frontend..."
npm run build:production

# Verify build
echo "✅ Verifying build..."
if [ -d "dist" ]; then
    echo "✅ Build successful! Files created:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Build completed successfully!"
