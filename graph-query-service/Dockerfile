# ---------- BASE STAGE ----------
FROM node:22-slim AS base
WORKDIR /app
COPY package.json yarn.lock ./

# Install dependencies (only needed packages)
RUN yarn install

# ---------- BUILD STAGE ----------
FROM node:22-slim AS build
WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./node_modules

# Compile NestJS TypeScript to JavaScript
RUN yarn build

# ---------- FINAL STAGE ----------
FROM node:22-slim AS final
WORKDIR /app

# Copy only necessary files from build
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

EXPOSE 5000

# Start app
CMD ["node", "dist/main"]