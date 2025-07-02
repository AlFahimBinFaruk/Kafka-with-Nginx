# ---------- BASE STAGE ----------
FROM node:22-slim AS deps
WORKDIR /app

# Install dependencies only
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# ---------- BUILD STAGE ----------
FROM node:22-slim AS builder
WORKDIR /app

# Copy source and install dev deps for build only
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- FINAL STAGE ----------
FROM node:22-slim AS runner
WORKDIR /app

# Minimal runtime only: no dev deps, no source, no .ts files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

EXPOSE 5000

CMD ["node", "dist/main"]
