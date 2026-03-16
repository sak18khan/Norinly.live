#!/bin/sh
set -e

# Save the public port provided by Cloud Run (default to 8080)
PUBLIC_PORT=${PORT:-8080}
echo "🚀 Norinly starting on public port: $PUBLIC_PORT"

# Use fixed internal ports to avoid conflicts
export BACKEND_PORT=5000
export FRONTEND_PORT=3000

# Replace $PORT in nginx config template using the saved PUBLIC_PORT
# We use a temp variable to avoid envsubst confusing $PORT with internal ones
export PORT_FOR_NGINX=$PUBLIC_PORT
envsubst '${PORT_FOR_NGINX}' < /app/nginx.conf.template > /etc/nginx/nginx.conf

echo "Starting Norinly Backend on port $BACKEND_PORT..."
cd /app/backend
PORT=$BACKEND_PORT node dist/index.js 2>&1 &

echo "Starting Norinly Frontend on port $FRONTEND_PORT..."
cd /app/frontend
export HOSTNAME=0.0.0.0
PORT=$FRONTEND_PORT node server.js 2>&1 &

# Wait a bit for processes to start
sleep 2

echo "Starting Nginx as proxy on port $PUBLIC_PORT..."
nginx -g "daemon off;"
