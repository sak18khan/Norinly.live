# --- Stage 1: Build Frontend ---
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Build Backend ---
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# --- Stage 3: Runtime ---
FROM node:22-alpine AS runner
WORKDIR /app

# Install Nginx and gettext (for envsubst)
RUN apk add --no-cache nginx gettext

# Copy built frontend
COPY --from=frontend-builder /app/public ./frontend/public
COPY --from=frontend-builder /app/.next/standalone ./frontend/
COPY --from=frontend-builder /app/.next/static ./frontend/.next/static

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy Nginx config and start script
COPY nginx.conf.template /app/nginx.conf.template
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

CMD ["/app/start.sh"]
