# DOUTORIZZE Backend - Dockerfile
# Imagem otimizada para produção

# Estágio 1: Build
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Estágio 2: Produção
FROM node:18-alpine AS production

# Instalar dependências do sistema para produção
RUN apk add --no-cache \
    mysql-client \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S doutorizze -u 1001 -G nodejs

# Definir diretório de trabalho
WORKDIR /app

# Copiar node_modules do estágio de build
COPY --from=builder --chown=doutorizze:nodejs /app/node_modules ./node_modules

# Copiar código da aplicação
COPY --chown=doutorizze:nodejs . .

# Criar diretórios necessários
RUN mkdir -p logs uploads && \
    chown -R doutorizze:nodejs logs uploads

# Definir timezone
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001
ENV NPM_CONFIG_LOGLEVEL=warn

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Mudar para usuário não-root
USER doutorizze

# Comando de inicialização
CMD ["node", "server.js"]