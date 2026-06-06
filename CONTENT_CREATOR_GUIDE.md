# 📱 Content Creator Agent Guide

Agente autónomo que genera contenido diario para Instagram usando Higgsfield AI.

## 🚀 Quick Start

### 1. Ejecutar agente manualmente

```bash
# Procesar todas las marcas
node agents/content-creator.js

# Procesar una marca específica
node agents/content-creator.js --marca aima-agency
```

### 2. Configurar ejecución diaria

Usa el skill `/loop` de Claude Code:

```
/loop 24h node agents/content-creator.js
```

Esto ejecutará el agente a la misma hora cada día.

---

## 📋 Configuración de Marcas

Edita `data/marcas.json` para agregar/modificar marcas:

```json
{
  "id": "mi-marca",
  "nombre": "Mi Marca",
  "instagram": "@mimaraca",
  "nicho": "Tu nicho",
  "identidad_visual": "Descripción de estilo",
  "audiencia": "Tu audiencia",
  "voz_marca": "Tone of voice",
  "tipos_contenido": {
    "educativo": "Descripción",
    "fomo": "Descripción",
    "comercial": "Descripción",
    "venta": "Descripción"
  },
  "colores_brand": ["#COLOR1", "#COLOR2"],
  "instagram_token": "TOKEN_AQUI"
}
```

---

## 🔑 Configurar Instagram Tokens

### Opción 1: Instagram Graph API (Facebook Developer)

1. Ve a [Facebook Developer Console](https://developers.facebook.com)
2. Crea una App > Instagram Graph API
3. Obtén el token de acceso
4. Agrega a `data/marcas.json`

### Opción 2: Windsor.ai (Recomendado)

Windsor.ai simplifica la autenticación:

```bash
# Ver conectores disponibles
npx @windsor-ai/cli list

# Autenticarse con Instagram
npx @windsor-ai/cli auth instagram
```

Luego el agente publicará automáticamente.

---

## 🎨 Cómo funciona

### Flujo diario:

1. **Selecciona tipo de contenido** (educativo, fomo, comercial, venta)
   - Rota según el día de la semana
   
2. **Genera brief** con:
   - Descripción del contenido
   - Emojis y CTA
   - Colores de marca
   - Tone of voice

3. **Crea con Higgsfield**:
   - Genera imagen profesional
   - Respeta identidad visual
   - Optimizado para Instagram

4. **Publica en Instagram**:
   - Caption formateado
   - Hashtags
   - Horarios específicos

---

## 📊 Logs

Los resultados se guardan en `logs/content_YYYY-MM-DD.json`:

```json
{
  "marca": "AIMA Agency",
  "contentType": "educativo",
  "brief": {...},
  "asset": {...},
  "caption": "...",
  "published": {...}
}
```

---

## 🔧 Próximos pasos

- [ ] Autenticar Higgsfield CLI: `higgsfield auth login`
- [ ] Configurar Instagram tokens
- [ ] Integrar Windsor.ai para publicación
- [ ] Usar `/loop` para automatización diaria
- [ ] Agregar más marcas a `data/marcas.json`

---

## 🐛 Troubleshooting

**"Higgsfield requires authentication"**
```bash
higgsfield auth login
```

**"Instagram token invalid"**
- Verifica token en `data/marcas.json`
- O usa Windsor.ai para re-autenticar

**"No logs directory"**
- Se crea automáticamente en primera ejecución

---

## 📌 Ejemplos de tipos de contenido

### AIMA Agency
- **Educativo**: Tips SEO, estrategias marketing
- **FOMO**: "Últimas 3 consultas disponibles esta semana"
- **Comercial**: "Auditoría SEO $280k" con CTA
- **Venta**: Testimonios de clientes

### Club del Hincha
- **Educativo**: Historia del fútbol, análisis táctico
- **FOMO**: "Gol increíble del minuto 89 EN VIVO"
- **Comercial**: "Merchandise exclusivo 50% OFF"
- **Venta**: "Membresía VIP - acceso a conciertos"

---

## 🚀 Deployment

Para ejecutar en producción:

```bash
# Instalar PM2 para persistencia
npm install -g pm2

# Crear job diario
pm2 start agents/content-creator.js --cron "0 9 * * *"

# Salvar configuración
pm2 save
```

---

**Versión**: 1.0.0  
**Última actualización**: 2026-06-06
