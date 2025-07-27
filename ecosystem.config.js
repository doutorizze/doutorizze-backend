module.exports = {
  "apps": [
    {
      "name": "doutorizze-api",
      "script": "./server.js",
      "cwd": "/var/www/api",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000,
        "DB_HOST": "localhost",
        "DB_USER": "doutorizze_user",
        "DB_PASSWORD": "senha_segura",
        "DB_NAME": "doutorizze_db",
        "JWT_SECRET": "seu_jwt_secret_super_seguro",
        "PARCELAMAIS_API_KEY": "sua_api_key",
        "PARCELAMAIS_SECRET": "seu_secret"
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true
    }
  ]
};