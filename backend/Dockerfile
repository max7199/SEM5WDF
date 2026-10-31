# =============================================================================
# Practical 11: Containerization with Docker and Docker Compose
# File: backend/Dockerfile
# Description: Production-ready container image for Node.js Express Backend
# Student: Max Patel (24IT070) - CHARUSAT - ITUE301
# =============================================================================

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY controllers/ ./controllers/
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY utils/ ./utils/
COPY events/ ./events/

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
