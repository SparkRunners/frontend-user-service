# Use official lite Node image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first (leverage Docker cache layers)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code (dev mode will override with volume)
COPY . .

# Expose default Vite dev server port
EXPOSE 5173

# Default command for dev (volume will override /app)
CMD ["npm", "run", "dev"]
