# ---------- BASE IMAGE ----------
FROM node:22-slim AS base

# Set working directory
WORKDIR /app

# Install dependencies early for caching
COPY package*.json ./
RUN npm ci --omit=dev

# ---------- BUILD IMAGE ----------
FROM node:22-slim AS build

WORKDIR /app

# Copy source files
COPY . .

# Install full dependencies (including dev for build)
RUN npm install

# Build TypeScript to JavaScript
RUN npm run build

# ---------- FINAL RUNTIME IMAGE ----------
FROM node:22-slim AS final

# Use a non-root user for security
RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /app

# Only copy what's needed at runtime
COPY --chown=appuser:appuser --from=build /app/dist ./dist
COPY --chown=appuser:appuser package*.json ./
COPY --from=base /app/node_modules ./node_modules

# Expose port your app listens on
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
