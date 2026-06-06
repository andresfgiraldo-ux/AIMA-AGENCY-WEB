#!/usr/bin/env node

/**
 * Daily Publish Orchestrator
 *
 * Orquesta el flujo completo:
 * 1. Content Creator → Genera contenido
 * 2. Higgsfield → Crea assets
 * 3. Windsor Publisher → Publica en Instagram
 *
 * Uso:
 *   node daily-publish.js                    # Procesar todas las marcas
 *   node daily-publish.js --marca aima-agency # Procesar una marca
 *   node daily-publish.js --dry-run          # Simular sin publicar
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARCAS_PATH = path.join(__dirname, '../data/marcas.json');
const LOGS_PATH = path.join(__dirname, '../logs');

class DailyPublishOrchestrator {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || true;
    this.marcas = this.loadMarcas();
    this.results = [];
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

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const levels = { info: 'ℹ️ ', success: '✅', error: '❌', warning: '⚠️ ' };
    console.log(`${levels[level] || '•'} [${timestamp}] ${message}`);
  }

  async generateContent(marca) {
    this.log(`Generating content for ${marca.nombre}...`);

    try {
      // Ejecutar content creator
      const output = execSync(
        `node ${path.join(__dirname, 'content-creator.js')} --marca ${marca.id}`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      // Parsear output para extraer datos
      const asset = {
        marca_id: marca.id,
        url: `mock://higgsfield/${marca.id}_${Date.now()}.jpg`,
        generated_at: new Date().toISOString()
      };

      this.log(`Content generated for ${marca.nombre}`, 'success');
      return asset;
    } catch (error) {
      this.log(`Failed to generate content: ${error.message}`, 'error');
      throw error;
    }
  }

  formatCaption(marca, contentType) {
    const CONTENT_TYPES = {
      educativo: { emoji: '📚', cta: 'Aprende más' },
      fomo: { emoji: '🔥', cta: 'No te lo pierdas' },
      comercial: { emoji: '💼', cta: 'Descubre cómo' },
      venta: { emoji: '🚀', cta: 'Contáctanos' }
    };

    const type = CONTENT_TYPES[contentType] || CONTENT_TYPES.educativo;
    const description = marca.tipos_contenido[contentType] || 'Contenido especial';

    return `${type.emoji} ${description}\n\n${type.cta} →\n\n#${marca.nombre.replace(/\s+/g, '')}\n${marca.colores_brand.map(c => `[${c}]`).join(' ')}`;
  }

  async publishToInstagram(marca, asset, caption) {
    this.log(`Publishing to Instagram: @${marca.instagram}`);

    if (this.dryRun) {
      this.log('DRY RUN: Would publish with caption:', 'info');
      console.log(caption);
      return { status: 'dry_run_success', marca_id: marca.id };
    }

    // Validar token
    if (!marca.instagram_token || marca.instagram_token === 'CONFIGURABLE_EN_SECRETS') {
      this.log(`Instagram token not configured for ${marca.nombre}`, 'warning');
      return { status: 'token_missing', marca_id: marca.id };
    }

    try {
      // Aquí iría el llamado real a Windsor.ai MCP
      // mcp__047c11d0-0925-4d64-8074-146e7a6585fd__execute_action

      const publishData = {
        status: 'ready_to_publish',
        marca_id: marca.id,
        image_url: asset.url,
        caption: caption,
        mcp_action: {
          connector: 'instagram_organic',
          action: 'create_post',
          account: marca.instagram_token,
          params: {
            image_url: asset.url,
            caption: caption,
            media_type: 'IMAGE'
          }
        }
      };

      this.log(`Ready for Instagram: @${marca.instagram}`, 'success');
      return publishData;
    } catch (error) {
      this.log(`Failed to publish: ${error.message}`, 'error');
      throw error;
    }
  }

  async processMarca(marca) {
    this.log(`\n${'='.repeat(60)}`);
    this.log(`Processing: ${marca.nombre}`, 'info');
    this.log(`${'='.repeat(60)}`);

    try {
      // 1. Generar contenido
      const asset = await this.generateContent(marca);

      // 2. Determinar tipo de contenido (según día)
      const dayOfWeek = new Date().getDay();
      const types = Object.keys(marca.tipos_contenido);
      const contentType = types[dayOfWeek % types.length];

      // 3. Crear caption
      const caption = this.formatCaption(marca, contentType);

      // 4. Publicar
      const publishResult = await this.publishToInstagram(marca, asset, caption);

      const result = {
        marca: marca.nombre,
        marca_id: marca.id,
        content_type: contentType,
        asset_url: asset.url,
        caption_preview: caption.substring(0, 100),
        publish_status: publishResult.status,
        timestamp: new Date().toISOString(),
        mcp_payload: publishResult.mcp_action
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const result = {
        marca: marca.nombre,
        marca_id: marca.id,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.results.push(result);
      return result;
    }
  }

  async processAll(marcaId = null) {
    this.log('\n🚀 DAILY PUBLISH ORCHESTRATOR');
    this.log(`Started: ${new Date().toISOString()}`);
    this.log(`Dry Run: ${this.dryRun}`);

    const marcasToProcess = marcaId
      ? this.marcas.filter(m => m.id === marcaId)
      : this.marcas;

    for (const marca of marcasToProcess) {
      await this.processMarca(marca);
    }

    this.saveLogs();
    this.printSummary();

    return this.results;
  }

  saveLogs() {
    if (!fs.existsSync(LOGS_PATH)) {
      fs.mkdirSync(LOGS_PATH, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(LOGS_PATH, `publish_${date}.json`);

    fs.writeFileSync(logFile, JSON.stringify(this.results, null, 2));
    this.log(`\nLogs saved: ${logFile}`, 'success');
  }

  printSummary() {
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 SUMMARY');
    console.log(`${'='.repeat(60)}`);

    const successful = this.results.filter(r => r.publish_status === 'ready_to_publish' || r.publish_status === 'dry_run_success');
    const failed = this.results.filter(r => r.error);
    const missing_tokens = this.results.filter(r => r.publish_status === 'token_missing');

    console.log(`Total processed: ${this.results.length}`);
    console.log(`✅ Ready: ${successful.length}`);
    console.log(`⚠️  Missing tokens: ${missing_tokens.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (missing_tokens.length > 0) {
      console.log(`\nMissing tokens for:`);
      missing_tokens.forEach(r => console.log(`  - ${r.marca}`));
    }

    console.log(`\n📝 To publish with Windsor.ai, use:`);
    console.log(`   mcp__047c11d0-0925-4d64-8074-146e7a6585fd__execute_action`);
    console.log(`   With payload from: logs/publish_*.json`);
  }
}

// CLI
const dryRun = process.argv.includes('--dry-run');
const verbose = !process.argv.includes('--quiet');
const marcaArg = process.argv.find(arg => arg.startsWith('--marca='));
const marcaId = marcaArg ? marcaArg.split('=')[1] : null;

const orchestrator = new DailyPublishOrchestrator({ dryRun, verbose });

(async () => {
  try {
    await orchestrator.processAll(marcaId);
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
})();

export default DailyPublishOrchestrator;
