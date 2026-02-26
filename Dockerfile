# Base image
FROM node:22-alpine

# App directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port for Railway
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
