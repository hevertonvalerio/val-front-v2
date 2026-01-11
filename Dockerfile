# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Configuração de timezone
ENV TZ=America/Sao_Paulo
RUN apk add --no-cache tzdata wget && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Configuração de timezone
ENV TZ=America/Sao_Paulo
RUN apk add --no-cache tzdata wget && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Copiar build do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Remover configuração padrão do nginx e criar customizada para SPA
RUN rm -f /etc/nginx/conf.d/default.conf && \
    echo 'server { \
    listen 3000; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    location /config.js { \
        expires -1; \
        add_header Cache-Control "no-store, no-cache, must-revalidate"; \
    } \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/app.conf

# Script de entrypoint para gerar config.js em runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'cat > /usr/share/nginx/html/config.js << EOF' >> /docker-entrypoint.sh && \
    echo 'window.__APP_CONFIG__ = {' >> /docker-entrypoint.sh && \
    echo '  API_KEY: "${API_KEY:-}",' >> /docker-entrypoint.sh && \
    echo '  FLOW_ID: "${FLOW_ID:-61a17804-9284-446d-8e60-3801aef9bb60}",' >> /docker-entrypoint.sh && \
    echo '  HOST_URL: "${HOST_URL:-https://langflow.inovai.app}"' >> /docker-entrypoint.sh && \
    echo '};' >> /docker-entrypoint.sh && \
    echo 'EOF' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 3000

CMD ["/docker-entrypoint.sh"]
