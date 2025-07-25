# SCRIPTS DE GESTIÓN DEL SISTEMA EDITORIAL
# ========================================

## 📋 INSTRUCCIONES PARA PORTÁTIL DEBIAN

### 1. COPIAR SCRIPTS AL PORTÁTIL
```bash
# En Windows (en este directorio):
# Copiar todos los archivos .sh a una USB o usar scp/rsync

# En el portátil Debian, copiar a /tmp:
cp /ruta/usb/*.sh /tmp/
cd /tmp
```

### 2. CONFIGURACIÓN INICIAL
```bash
# Hacer ejecutable el instalador
chmod +x install_scripts.sh

# Ejecutar instalación
./install_scripts.sh
```

### 3. CONFIGURACIÓN DE BASE DE DATOS
```bash
# IMPORTANTE: Los scripts están configurados para:
DB_NAME="editorialdata"
DB_USER="markitos"

# Si tu configuración es diferente, edita los scripts:
nano safe_shutdown.sh    # Línea ~30
nano safe_startup.sh     # Línea ~30  
nano auto_backup.sh      # Línea ~30
```

### 4. USO DIARIO
```bash
# Menú principal (recomendado)
./editorial_system.sh

# O comandos directos:
./safe_startup.sh        # Al arrancar el portátil
./auto_backup.sh          # Backup manual
./safe_shutdown.sh       # Antes de apagar
```

## 🔧 SCRIPTS INCLUIDOS

1. **editorial_system.sh** - Menú principal interactivo
2. **safe_startup.sh** - Verificar sistema al arrancar
3. **safe_shutdown.sh** - Apagar de forma segura
4. **auto_backup.sh** - Crear backups automáticos
5. **install_scripts.sh** - Configuración inicial

## ⚠️ IMPORTANTE

- SIEMPRE ejecuta `safe_shutdown.sh` antes de apagar
- Configura backups automáticos con `auto_backup.sh install`
- Los backups se guardan en `/home/$USER/backups`
- Verifica la configuración de DB_NAME y DB_USER

## 🚀 ARRANQUE RÁPIDO

```bash
# 1. Copiar scripts
cp *.sh /tmp/ && cd /tmp

# 2. Instalar
chmod +x install_scripts.sh && ./install_scripts.sh

# 3. Usar menú
./editorial_system.sh
```

## 📞 COMANDOS DE EMERGENCIA

Si algo sale mal:
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Ver logs
sudo journalctl -u postgresql -n 20

# Backup manual de emergencia
sudo -u postgres pg_dump -U markitos editorialdata > emergency_backup.sql
```
