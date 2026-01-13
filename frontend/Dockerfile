FROM node:20-slim

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm ci --prefer-offline --no-audit --legacy-peer-deps

# Copy source
COPY . .

EXPOSE 5173

# Start Vite dev server and bind to 0.0.0.0 so it's reachable from host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
