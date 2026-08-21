FROM node:20-slim

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install all dependencies (including dev for build)
RUN npm install --no-audit --no-fund

# Copy frontend source
COPY frontend/ .

# Build Next.js
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

ENV PORT=3000

CMD ["npm", "start"]
