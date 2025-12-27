# Use official lite Node image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
# RUN npm install

# Expose default Vite dev server port
EXPOSE 5173

# Default command for dev (volume will override /app)
CMD ["npm", "run", "dev", "--", "--host"]
