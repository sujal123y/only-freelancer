# Production Dockerfile for ONLY FREELANCER
FROM node:24-alpine AS runner

WORKDIR /app

# Install dependencies first for optimal Docker layer caching
COPY package*.json ./
RUN npm ci --omit=dev || npm install --production

# Copy application source code
COPY . .

# Build the Vite frontend into dist/
RUN npx vite build

# Create persistent storage directories
RUN mkdir -p /app/data /app/uploads

# Expose default HTTP port
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

# Start unified Express server (serving API + static frontend)
CMD ["node", "server/index.js"]
