#!/bin/bash
# scripts/get-supabase-ip.sh - Obtener IP de Supabase para evitar IPv6

echo "🔍 Obteniendo IP de Supabase para evitar problemas IPv6..."
echo ""

SUPABASE_HOST="db.ybnpusbnqlizaiqvztph.supabase.co"

echo "🌐 Resolviendo DNS para: $SUPABASE_HOST"
echo ""

# Resolver IPv4
IP_V4=$(dig +short A $SUPABASE_HOST | head -1)
echo "📡 IPv4: $IP_V4"

# Resolver IPv6 (para comparar)
IP_V6=$(dig +short AAAA $SUPABASE_HOST | head -1)
echo "📡 IPv6: $IP_V6"

echo ""
echo "💡 SOLUCIÓN ALTERNATIVA:"
echo "   En lugar de usar: $SUPABASE_HOST"
echo "   Usar IP directa: $IP_V4"
echo ""
echo "🔧 Variable de entorno actualizada:"
echo "   DB_HOST=$IP_V4"
echo ""
echo "⚠️  NOTA: Las IPs pueden cambiar, usar con precaución"
