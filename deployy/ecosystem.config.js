module.exports = {
  apps: [{
    name: 'doutorizze-api',
    script: 'server.js',
    instances: 'max', // Usar todos os cores disponíveis
    exec_mode: 'cluster',
    
    // Variáveis de ambiente
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    
    // Ambiente de produção
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Performance
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024',
    
    // Auto restart
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Configurações avançadas
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Merge logs
    merge_logs: true,
    
    // Configurações de cluster
    instance_var: 'INSTANCE_ID',
    
    // Health check
    health_check_grace_period: 3000
  }],
  
  // Configurações de deploy (opcional)
  deploy: {
    production: {
      user: 'deploy',
      host: ['seu-servidor.com'],
      ref: 'origin/main',
      repo: 'git@github.com:seu-usuario/doutorizze.git',
      path: '/var/www/doutorizze',
      'post-deploy': 'cd backend && npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
};