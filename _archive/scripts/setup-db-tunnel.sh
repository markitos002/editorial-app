#!/bin/bash
# scripts/setup-db-tunnel.sh - Configurar túnel SSH para acceso a BD desde Render

echo "🔧 Configurando túnel SSH para PostgreSQL..."

# 1. Instalar autossh para túnel persistente
sudo apt install autossh -y

# 2. Crear usuario específico para túnel
sudo adduser --system --group --shell /bin/bash tunnel-user

# 3. Configurar PostgreSQL para acepting conexiones externas
sudo tee -a /etc/postgresql/*/main/postgresql.conf << EOF
# Configuración para túnel SSH
listen_addresses = 'localhost,127.0.0.1'
port = 5432
EOF

# 4. Configurar pg_hba.conf para autenticación
sudo tee -a /etc/postgresql/*/main/pg_hba.conf << EOF
# Conexión desde túnel SSH
host editorialdata editorialuser 127.0.0.1/32 md5
EOF

# 5. Reiniciar PostgreSQL
sudo systemctl restart postgresql

echo "✅ Túnel SSH configurado. PostgreSQL accesible en localhost:5432"
echo "🔑 Usar estas credenciales en Render:"
echo "   HOST: localhost"
echo "   PORT: 5432" 
echo "   DATABASE: editorialdata"
echo "   USER: editorialuser"
echo "   PASSWORD: [tu-password]"
