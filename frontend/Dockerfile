# =============================================================================
# Practical 11: Containerization with Docker and Docker Compose
# File: frontend/Dockerfile
# Description: Multi-stage Docker build for React Vite Frontend with Nginx
# Student: Max Patel (24IT070) - CHARUSAT - ITUE301
# =============================================================================

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./

ENV VITE_API_BASE_URL=/api
RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
