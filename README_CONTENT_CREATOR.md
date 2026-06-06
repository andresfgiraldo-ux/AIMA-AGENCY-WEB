# 🎯 Content Creator Agent - Complete Setup

**Agente autónomo que genera y publica contenido diario en Instagram para múltiples marcas usando Higgsfield AI + Windsor.ai**

---

## ✅ What's Ready Now

### 📁 Architecture
```
┌─────────────────────────────────────────┐
│  Daily Publish Orchestrator             │
│  (daily-publish.js)                     │
└────┬────────────────────────────────────┘
     ├─→ Content Creator Agent
     │   └─→ Higgsfield (generación)
     ├─→ Caption Formatter
     └─→ Windsor Publisher
         └─→ Instagram (publicación)
```

### 🛠️ Components

| Componente | Archivo | Función |
|-----------|---------|---------|
| **Orquestador** | `agents/daily-publish.js` | Coordina flujo completo |
| **Generador** | `agents/content-creator.js` | Crea contenido inteligente |
| **Publicador** | `agents/windsor-publisher.js` | Interfaz con Windsor.ai |
| **Base de datos** | `data/marcas.json` | Perfiles de marcas |

### 🚀 Configured Brands
```
✅ AIMA Agency (@aimaagency.co)
   - Nicho: Marketing Digital con IA
   - Audiencia: Emprendedores, 25-45 años
   - Contenidos: Educativo, FOMO, Comercial, Venta

✅ Club del Hincha (@clubdelhincha.co)
   - Nicho: Comunidades futboleras
   - Audiencia: Hinchas, 15-55 años
   - Contenidos: Educativo, FOMO, Comercial, Venta
```

---

## 🚀 Próximo paso: Obtener Instagram Tokens

### 1️⃣ Get Instagram Access Tokens

**For each brand:**
- Go to [Facebook Developers](https://developers.facebook.com/)
- Create App → Instagram Graph API
- Get Access Token with permissions:
  - `instagram_basic`
  - `instagram_content_publishing`

### 2️⃣ Configure in `data/marcas.json`

```bash
# Edit and add tokens
nano data/marcas.json
```

```json
{
  "id": "aima-agency",
  "nombre": "AIMA Agency",
  "instagram": "aimaagency.co",
  "instagram_token": "IGQVJYc3R5M0F3NWp3dUdFYzJnZXJYN3k5MlJOTE1ZANyXJJbmlzNUZAMdmZAzNlBGVGRkSzQ2TzI5TWY4Z..."
}
```

### 3️⃣ Validate Configuration

```bash
node agents/windsor-publisher.js validate-tokens
```

Expected output:
```
✅ Valid tokens (2):
   - AIMA Agency
   - Club del Hincha
```

---

## 🎯 Test Execution

### Dry Run (Preview)
```bash
node agents/daily-publish.js --dry-run
```

Output:
- Shows what would be published
- Generates MCP payloads
- Saves to `logs/publish_*.json`

### Live Execution (With Real Publishing)
```bash
# After configuring tokens:
node agents/daily-publish.js

# Or for specific brand:
node agents/daily-publish.js --marca=aima-agency
```

---

## 📅 Automate Daily at 9 AM

Use Claude's `/loop` command:

```bash
/loop 24h node agents/daily-publish.js
```

This will:
- ✅ Run every 24 hours
- ✅ Generate new content each day
- ✅ Rotate content types automatically
- ✅ Publish to Instagram
- ✅ Save logs

---

## 📊 Logs & Monitoring

Logs saved in `logs/publish_YYYY-MM-DD.json`:

```bash
# View latest publication
cat logs/publish_2026-06-06.json | jq '.[] | {marca, content_type, publish_status}'

# Check for errors
cat logs/publish_2026-06-06.json | jq '.[] | select(.error)'
```

---

## 🔄 Content Rotation

Content type rotates by day of week:

| Day | AIMA Agency | Club del Hincha |
|-----|------------|-----------------|
| Mon | Educativo | Educativo |
| Tue | FOMO | FOMO |
| Wed | Comercial | Comercial |
| Thu | Venta | Venta |
| Fri | Educativo | Educativo |
| Sat | FOMO | FOMO |
| Sun | Comercial | Comercial |

---

## 🔑 Environment Setup

### Installation
```bash
# Required: Higgsfield CLI (already installed)
higgsfield --version

# Required: Node.js (already installed)
node --version
```

### Optional: Secure Token Storage
```bash
# Create .env.local (not versioned)
cat > .env.local << 'EOF'
INSTAGRAM_TOKEN_AIMA="your_token_here"
INSTAGRAM_TOKEN_HINCHA="your_token_here"
EOF

# Then in data/marcas.json reference them:
"instagram_token": "${process.env.INSTAGRAM_TOKEN_AIMA}"
```

---

## 📝 Adding More Brands

To add a new brand:

1. **Edit `data/marcas.json`:**
```json
{
  "id": "nueva-marca",
  "nombre": "Nueva Marca",
  "instagram": "@nueva.marca",
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
  "instagram_token": "TOKEN_HERE"
}
```

2. **Validate:**
```bash
node agents/windsor-publisher.js validate-tokens
```

3. **Test:**
```bash
node agents/daily-publish.js --marca=nueva-marca --dry-run
```

---

## 🐛 Troubleshooting

### "Missing Instagram tokens"
```bash
node agents/windsor-publisher.js list-accounts
# Configure tokens in data/marcas.json
```

### "Invalid token format"
- Instagram tokens must be 20+ characters
- Use valid Facebook Graph API tokens

### "Higgsfield not found"
```bash
higgsfield --version
# If not installed: npm install -g @higgsfield/cli
```

### "Content generation failed"
```bash
# Run verbose mode:
node agents/daily-publish.js --marca=aima-agency
# Check error in logs/publish_*.json
```

---

## 🚀 Production Checklist

- [ ] Instagram tokens obtained and configured
- [ ] Validation passed: `node agents/windsor-publisher.js validate-tokens`
- [ ] Dry run successful: `node agents/daily-publish.js --dry-run`
- [ ] Test with one brand first
- [ ] Schedule with `/loop 24h node agents/daily-publish.js`
- [ ] Monitor logs daily
- [ ] Adjust content types if needed

---

## 📊 Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                  Daily Execution (9 AM)                  │
└─────────┬───────────────────────────────────────────────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│         Load Brands from data/marcas.json                │
│  - AIMA Agency                                           │
│  - Club del Hincha                                       │
│  - [Add more...]                                         │
└─────────┬───────────────────────────────────────────────┘
          │
          v
     ┌────┴────┐
     │ For Each Brand
     └────┬────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│     Step 1: Select Content Type (by day of week)         │
│     Educativo → FOMO → Comercial → Venta → (repeat)     │
└─────────┬───────────────────────────────────────────────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│         Step 2: Generate Content Brief                   │
│     - Description                                        │
│     - Emojis & CTA                                       │
│     - Brand colors & voice                               │
└─────────┬───────────────────────────────────────────────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│        Step 3: Generate with Higgsfield                  │
│     - Create professional image                          │
│     - Respect brand identity                             │
│     - 1080x1350px or 1080x1080px                         │
└─────────┬───────────────────────────────────────────────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│          Step 4: Format Instagram Caption                │
│     - Emoji + Description                                │
│     - CTA                                                │
│     - Hashtags                                           │
│     - Brand colors (hex codes)                           │
└─────────┬───────────────────────────────────────────────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│       Step 5: Publish via Windsor.ai                     │
│     MCP Tool: execute_action                             │
│     - connector: instagram_organic                       │
│     - action: create_post                                │
│     - account: instagram_token                           │
│     - params: {image_url, caption}                       │
└─────────┬───────────────────────────────────────────────┘
          │
          v
┌──────────────────────────────────────────────────────────┐
│     Step 6: Save to logs/publish_YYYY-MM-DD.json        │
│     - Mark & metadata                                    │
│     - Content type                                       │
│     - MCP payload                                        │
│     - Publish status                                     │
└──────────────────────────────────────────────────────────┘
```

---

## 📞 Support

**For issues:**
- Check `CONTENT_CREATOR_GUIDE.md` for basics
- Check `WINDSOR_AI_SETUP.md` for Instagram setup
- Review logs in `logs/publish_*.json`
- Run with `--dry-run` to test safely

---

**Version**: 1.0.0  
**Status**: ✅ Ready for Production (after token setup)  
**Last Updated**: 2026-06-06
