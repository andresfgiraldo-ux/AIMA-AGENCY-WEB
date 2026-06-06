#!/usr/bin/env node

/**
 * Windsor.ai Publisher
 * Puente entre Content Creator Agent y Windsor.ai MCP
 *
 * Uso:
 *   node windsor-publisher.js publish <marca_id> <image_url> <caption>
 *   node windsor-publisher.js list-accounts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARCAS_PATH = path.join(__dirname, '../data/marcas.json');

class WindsorPublisher {
  constructor() {
    this.marcas = this.loadMarcas();
    this.connectors = {
      instagram_organic: 'instagram_organic', // Publicación orgánica
      instagram_public: 'instagram_public',   // Perfil público
      meta_ads: 'meta_ads'                    // Meta Ads
    };
  }

  loadMarcas() {
    try {
      const data = fs.readFileSync(MARCAS_PATH, 'utf8');
      return JSON.parse(data).marcas;
    } catch (error) {
      console.error('Error loading marcas.json:', error.message);
      process.exit(1);
    }
  }

  async publishViaWindsor(marcaId, imageUrl, caption) {
    const marca = this.marcas.find(m => m.id === marcaId);
    if (!marca) {
      throw new Error(`Marca ${marcaId} not found`);
    }

    // Validar token
    if (!marca.instagram_token || marca.instagram_token === 'CONFIGURABLE_EN_SECRETS') {
      throw new Error(`Instagram token not configured for ${marca.nombre}`);
    }

    // Preparar payload para Windsor.ai
    const payload = {
      connector: 'instagram_organic',
      action: 'create_post',
      account: marca.instagram_token,
      params: {
        image_url: imageUrl,
        caption: caption,
        media_type: 'IMAGE',
        schedule_timestamp: new Date().toISOString()
      }
    };

    console.log(`\n📲 Windsor.ai Publish Request`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Marca: ${marca.nombre}`);
    console.log(`Instagram: @${marca.instagram}`);
    console.log(`Connector: ${payload.connector}`);
    console.log(`Account: ${marca.instagram_token.substring(0, 20)}...`);
    console.log(`\nCaption preview:`);
    console.log(caption);
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    return {
      success: true,
      marca_id: marcaId,
      marca_name: marca.nombre,
      instagram: marca.instagram,
      payload,
      instructions: `
Execute this with Windsor.ai MCP:

mcp__047c11d0-0925-4d64-8074-146e7a6585fd__execute_action
  connector: "${payload.connector}"
  action: "${payload.action}"
  account: "${marca.instagram_token}"
  params: ${JSON.stringify(payload.params, null, 2)}
      `
    };
  }

  async listAccounts() {
    console.log('\n📱 Configured Instagram Accounts');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    let configuredCount = 0;
    for (const marca of this.marcas) {
      const isConfigured = marca.instagram_token &&
                          marca.instagram_token !== 'CONFIGURABLE_EN_SECRETS';

      const status = isConfigured ? '✅' : '❌';
      console.log(`${status} ${marca.nombre}`);
      console.log(`   @${marca.instagram}`);
      if (isConfigured) {
        console.log(`   Token: ${marca.instagram_token.substring(0, 20)}...`);
        configuredCount++;
      } else {
        console.log(`   ⚠️  Token not configured`);
      }
    }

    console.log(`\nConfigured: ${configuredCount}/${this.marcas.length}`);
  }

  async validateTokens() {
    console.log('\n🔐 Token Validation');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    const results = {
      valid: [],
      invalid: [],
      missing: []
    };

    for (const marca of this.marcas) {
      if (!marca.instagram_token || marca.instagram_token === 'CONFIGURABLE_EN_SECRETS') {
        results.missing.push(marca.nombre);
      } else if (marca.instagram_token.length < 20) {
        results.invalid.push(marca.nombre);
      } else {
        results.valid.push(marca.nombre);
      }
    }

    if (results.valid.length > 0) {
      console.log(`✅ Valid tokens (${results.valid.length}):`);
      results.valid.forEach(m => console.log(`   - ${m}`));
    }

    if (results.invalid.length > 0) {
      console.log(`\n⚠️  Invalid tokens (${results.invalid.length}):`);
      results.invalid.forEach(m => console.log(`   - ${m}`));
    }

    if (results.missing.length > 0) {
      console.log(`\n❌ Missing tokens (${results.missing.length}):`);
      results.missing.forEach(m => console.log(`   - ${m}`));
    }

    return results;
  }

  generateMCPCommand(marcaId, imageUrl, caption) {
    const marca = this.marcas.find(m => m.id === marcaId);
    if (!marca) {
      throw new Error(`Marca ${marcaId} not found`);
    }

    return `
mcp__047c11d0-0925-4d64-8074-146e7a6585fd__execute_action {
  "connector": "instagram_organic",
  "action": "create_post",
  "account": "${marca.instagram_token}",
  "params": {
    "image_url": "${imageUrl}",
    "caption": ${JSON.stringify(caption)},
    "media_type": "IMAGE"
  }
}
    `;
  }
}

// CLI
const publisher = new WindsorPublisher();
const command = process.argv[2];

(async () => {
  try {
    if (command === 'publish') {
      const marcaId = process.argv[3];
      const imageUrl = process.argv[4];
      const caption = process.argv[5];

      if (!marcaId || !imageUrl || !caption) {
        console.error('Usage: node windsor-publisher.js publish <marca_id> <image_url> <caption>');
        process.exit(1);
      }

      const result = await publisher.publishViaWindsor(marcaId, imageUrl, caption);
      console.log(result.instructions);
    } else if (command === 'list-accounts') {
      await publisher.listAccounts();
    } else if (command === 'validate-tokens') {
      await publisher.validateTokens();
    } else if (command === 'mcp-command') {
      const marcaId = process.argv[3];
      const imageUrl = process.argv[4];
      const caption = process.argv[5];

      if (!marcaId || !imageUrl || !caption) {
        console.error('Usage: node windsor-publisher.js mcp-command <marca_id> <image_url> <caption>');
        process.exit(1);
      }

      console.log(publisher.generateMCPCommand(marcaId, imageUrl, caption));
    } else {
      console.log(`Windsor.ai Instagram Publisher

Usage:
  list-accounts              - List all configured Instagram accounts
  validate-tokens            - Check token configuration
  publish <marca> <img> <txt> - Prepare publish payload
  mcp-command <marca> <img>  - Generate MCP command

Examples:
  node windsor-publisher.js list-accounts
  node windsor-publisher.js validate-tokens
  node windsor-publisher.js publish aima-agency https://... "Caption text"
      `);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

export default WindsorPublisher;
