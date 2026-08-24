FROM node:20-alpine AS builder
WORKDIR /app

# Install all deps (including dev) to build
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# Runtime image with only production deps and build output
FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/server.cjs"]
