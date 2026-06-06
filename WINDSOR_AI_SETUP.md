# 🔗 Windsor.ai Instagram Integration Setup

Cómo configurar Instagram para publicación automática con Windsor.ai.

---

## 📋 Requisitos previos

- ✅ Windsor.ai MCP tools cargadas
- ✅ Content Creator Agent instalado
- ✅ Instagram Business Account (recomendado)

---

## 🔑 Obtener Instagram Token

### Opción 1: Instagram Graph API (Recomendado para automatización)

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una App o usa una existente
3. Agrega "Instagram Graph API" como producto
4. Obtén el **Access Token** con permisos:
   - `instagram_basic`
   - `instagram_content_publishing`
   - `pages_read_engagement`

5. Copia el token

### Opción 2: Manual (Más fácil para pruebas)

1. Abre Instagram en desktop
2. Ve a Settings → Apps and Websites
3. Copia el token de acceso

---

## 📝 Configurar en marcas.json

Edita `data/marcas.json` y reemplaza `CONFIGURABLE_EN_SECRETS`:

```json
{
  "id": "aima-agency",
  "nombre": "AIMA Agency",
  "instagram": "aimaagency.co",
  "instagram_token": "IGQVJYc3R5M0F3NWp3dUdFYzJnZXJYN3k5MlJOTE1ZANyXJJbmlzNUZAMdmZAzNlBGVGRkSzQ2TzI5TWY4Z..."
}
```

---

## ✅ Validar Configuración

```bash
# Ver todas las cuentas y sus tokens
node agents/windsor-publisher.js list-accounts

# Validar que tokens sean válidos
node agents/windsor-publisher.js validate-tokens
```

Salida esperada:
```
✅ Valid tokens (2):
   - AIMA Agency
   - Club del Hincha
```

---

## 🚀 Publicar Manualmente (Test)

```bash
# Preparar payload para Windsor.ai
node agents/windsor-publisher.js publish aima-agency \
  "https://example.com/image.jpg" \
  "Este es un post de prueba #AIMA"

# Ver comando MCP listo para ejecutar
node agents/windsor-publisher.js mcp-command aima-agency \
  "https://example.com/image.jpg" \
  "Este es un post de prueba #AIMA"
```

---

## 🔄 Flujo de Publicación Automática

```
Content Creator Agent
    ↓
Genera contenido con Higgsfield
    ↓
Windsor Publisher
    ↓
MCP Tool: execute_action
    ↓
Instagram
```

---

## 🐛 Troubleshooting

### "Instagram token not configured"
- Ejecuta: `node agents/windsor-publisher.js list-accounts`
- Verifica que `instagram_token` no sea vacío en `data/marcas.json`

### "Invalid token"
- El token debe tener mínimo 20 caracteres
- Verifica que sea un token válido de Instagram Graph API

### "Account not found in Windsor.ai"
- Asegúrate de que el token tenga permisos `instagram_content_publishing`
- Reconecta la cuenta: `mcp__047c11d0-0925-4d64-8074-146e7a6585fd__get_connector_authorization_url`

### "Caption is too long"
- Instagram permite máximo 2,200 caracteres
- El agente limpia esto automáticamente

---

## 📱 Conectar Múltiples Cuentas

Para cada marca Instagram que quieras publicar:

1. Obtén su token de acceso
2. Agrega a `data/marcas.json`:

```json
{
  "id": "otra-marca",
  "nombre": "Otra Marca",
  "instagram": "@otramarca",
  "instagram_token": "IGQVJYc3R5M0F3..."
}
```

3. Valida: `node agents/windsor-publisher.js validate-tokens`
4. ¡Listo! El agente publicará automáticamente cada día

---

## 🔐 Seguridad

**Nunca hagas commit de tokens reales:**

```bash
# Crear .env.local (no versionado)
echo "data/marcas.json" >> .gitignore

# O usar secretos:
export INSTAGRAM_TOKEN_AIMA="tu_token_aqui"
export INSTAGRAM_TOKEN_HINCHA="tu_token_aqui"
```

---

## 📊 Monitoreo de Publicaciones

Los logs se guardan en `logs/content_*.json`:

```bash
# Ver últimas publicaciones
cat logs/content_2026-06-06.json | jq '.[] | {marca, published}'

# Ver errores
cat logs/content_2026-06-06.json | jq '.[] | select(.published.status != "published")'
```

---

## 🚀 Próximas integraciones

- [ ] Programar posts para horarios específicos
- [ ] Analytics de engagement
- [ ] Reintentosautomáticos si falla
- [ ] Notificaciones Slack cuando se publica
- [ ] A/B testing de captions

---

**Versión**: 1.0.0  
**Última actualización**: 2026-06-06
