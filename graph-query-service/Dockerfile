# ---------- BASE STAGE ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

# Install dependencies (only needed packages)
RUN yarn install

# ---------- BUILD STAGE ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./node_modules

# Compile NestJS TypeScript to JavaScript
RUN yarn build

# ---------- FINAL STAGE ----------
FROM node:20-alpine AS final
WORKDIR /app

# Copy only necessary files from build
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Start app
CMD ["node", "dist/main"]
