FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY backend/package.json ./
RUN npm install --production

# Copy source
COPY backend/src ./src
COPY frontend ./frontend

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
