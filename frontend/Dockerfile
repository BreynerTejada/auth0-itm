# Build stage: Compile React with Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copy frontend package files (context is root of project)
COPY frontend/package*.json ./frontend/

# Install dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy frontend source code
COPY frontend . 

# Build the application
RUN npm run build

# Runtime stage: Development server
FROM node:20-alpine

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies (with dev deps for hot reload)
RUN npm ci

# Copy frontend source
COPY frontend .

EXPOSE 5173

CMD ["npm", "run", "dev"]
