# Base image
FROM node:22-alpine

# App directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build NestJS
RUN npm run build

# 🔥 VERY IMPORTANT
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:prod"]
