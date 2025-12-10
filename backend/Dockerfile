FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

EXPOSE 3000

# Use node directly (server.js handles DB connection retries)
CMD ["node", "server.js"]
