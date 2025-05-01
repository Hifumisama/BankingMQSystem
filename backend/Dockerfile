# Build stage
FROM node:18-bullseye as builder

WORKDIR /app

# Install required packages for IBM MQ
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    gzip \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-bullseye

WORKDIR /app

# Install required packages for IBM MQ
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    gzip \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"] 