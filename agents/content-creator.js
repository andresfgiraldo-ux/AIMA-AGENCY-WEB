#!/usr/bin/env node

/**
 * Content Creator Agent
 * Genera contenido diario para marcas usando Higgsfield + publica en Instagram
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARCAS_PATH = path.join(__dirname, '../data/marcas.json');

// Tipos de contenido y sus características
const CONTENT_TYPES = {
  educativo: {
    emojis: ['📚', '💡', '🎓', '📖'],
    cta: 'Aprende más',
    tone: 'informativo y útil'
  },
  fomo: {
    emojis: ['🔥', '⚡', '🎯', '⏰'],
    cta: 'No te lo pierdas',
    tone: 'urgente y emocionante'
  },
  comercial: {
    emojis: ['💼', '🎁', '📢', '👇'],
    cta: 'Descubre cómo',
    tone: 'profesional y convincente'
  },
  venta: {
    emojis: ['🚀', '✅', '💰', '🎉'],
    cta: 'Contáctanos',
    tone: 'directo y motivador'
  }
};

class ContentCreatorAgent {
  constructor() {
    this.marcas = this.loadMarcas();
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

  getDayOfWeek() {
    return new Date().getDay(); // 0-6
  }

  selectContentType(marca) {
    // Seleccionar contenido basado en la marca y el día
    const dayOfWeek = this.getDayOfWeek();
    const tipos = Object.keys(marca.tipos_contenido);

    // Rotar tipos según el día
    const selectedType = tipos[dayOfWeek % tipos.length];
    return selectedType;
  }

  generateContentBrief(marca, contentType) {
    const typeInfo = CONTENT_TYPES[contentType];
    const description = marca.tipos_contenido[contentType];

    const brief = {
      marca: marca.nombre,
      tipo: contentType,
      descripcion: description,
      emojis: typeInfo.emojis,
      cta: typeInfo.cta,
      tone: typeInfo.tone,
      colors: marca.colores_brand,
      timestamp: new Date().toISOString()
    };

    return brief;
  }

  generatePromptForHiggsfield(marca, brief) {
    const emoji = brief.emojis[Math.floor(Math.random() * brief.emojis.length)];

    let prompt = `Create an Instagram post design for "${marca.nombre}"\n`;
    prompt += `Niche: ${marca.nicho}\n`;
    prompt += `Content Type: ${brief.tipo} (${brief.tone})\n`;
    prompt += `Description: ${brief.descripcion}\n`;
    prompt += `Call to Action: ${brief.cta}\n`;
    prompt += `Brand Colors: ${brief.colors.join(', ')}\n`;
    prompt += `Brand Voice: ${marca.voz_marca}\n`;
    prompt += `Emoji: ${emoji}\n`;
    prompt += `Platform: Instagram (1080x1350px or 1080x1080px)\n`;
    prompt += `Style: Professional, on-brand, mobile-first, engaging\n`;

    return prompt;
  }

  async generateWithHiggsfield(marca, brief) {
    console.log(`\n🎨 Generating content with Higgsfield for ${marca.nombre}...`);

    try {
      const prompt = this.generatePromptForHiggsfield(marca, brief);

      // Crear archivo de prompt temporal
      const promptFile = `/tmp/prompt_${marca.id}_${Date.now()}.txt`;
      fs.writeFileSync(promptFile, prompt);

      console.log('📝 Prompt:', prompt);
      console.log('\n⚠️  Note: Higgsfield generation requires authentication');
      console.log('Run: higgsfield auth login\n');

      // Mock response (en producción, llamar a Higgsfield API)
      const mockAsset = {
        marca_id: marca.id,
        tipo: brief.tipo,
        prompt: prompt,
        status: 'ready',
        asset_url: `mock://higgsfield/${marca.id}_${Date.now()}.jpg`,
        ready_to_publish: true
      };

      fs.unlinkSync(promptFile);
      return mockAsset;
    } catch (error) {
      console.error('Error generating with Higgsfield:', error.message);
      throw error;
    }
  }

  formatCaption(marca, brief, asset) {
    const emoji = brief.emojis[0];
    const lines = [
      emoji + ' ' + brief.descripcion,
      '',
      brief.cta + ' →',
      '',
      `#${marca.nombre.replace(/\s+/g, '')}`,
      ...brief.colors.map(c => `[${c}]`)
    ];

    return lines.join('\n');
  }

  async publishToInstagram(marca, asset, caption) {
    console.log(`\n📲 Publishing to Instagram: @${marca.instagram}`);
    console.log(`Caption:\n${caption}\n`);

    const publishData = {
      marca_id: marca.id,
      instagram_handle: marca.instagram,
      asset_url: asset.asset_url,
      caption: caption,
      published_at: new Date().toISOString(),
      connector: 'instagram_organic',
      action: 'create_post',
      params: {
        image_url: asset.asset_url,
        caption: caption,
        media_type: 'IMAGE'
      }
    };

    // Windsor.ai integration ready
    // Call this with MCP tool: mcp__047c11d0-0925-4d64-8074-146e7a6585fd__execute_action
    // With params: connector='instagram_organic', action='create_post', account=marca.instagram_token, params={...}

    if (marca.instagram_token && marca.instagram_token !== 'CONFIGURABLE_EN_SECRETS') {
      console.log('🔗 Windsor.ai payload ready for execution');
    } else {
      console.log('⚠️  Set Instagram token in marcas.json to enable publishing');
    }

    return publishData;
  }

  async processMarc(marcaId) {
    const marca = this.marcas.find(m => m.id === marcaId);
    if (!marca) {
      console.error(`Marca ${marcaId} not found`);
      return null;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📱 Processing: ${marca.nombre}`);
    console.log(`${'='.repeat(60)}`);

    // 1. Seleccionar tipo de contenido
    const contentType = this.selectContentType(marca);
    console.log(`\n📌 Content Type: ${contentType}`);

    // 2. Generar brief
    const brief = this.generateContentBrief(marca, contentType);
    console.log(`✅ Brief generated`);

    // 3. Generar con Higgsfield
    const asset = await this.generateWithHiggsfield(marca, brief);
    console.log(`✅ Asset generated`);

    // 4. Crear caption
    const caption = this.formatCaption(marca, brief, asset);

    // 5. Publicar
    const published = await this.publishToInstagram(marca, asset, caption);
    console.log(`✅ Published (mock)`);

    return {
      marca: marca.nombre,
      contentType,
      brief,
      asset,
      caption,
      published
    };
  }

  async processAll() {
    console.log('\n🚀 CONTENT CREATOR AGENT - Daily Run');
    console.log(`Timestamp: ${new Date().toISOString()}\n`);

    const results = [];
    for (const marca of this.marcas) {
      try {
        const result = await this.processMarc(marca.id);
        results.push(result);
      } catch (error) {
        console.error(`Error processing ${marca.nombre}:`, error.message);
      }
    }

    // Guardar log
    this.saveLogs(results);
    return results;
  }

  saveLogs(results) {
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, `content_${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`\n📝 Logs saved to: ${logFile}`);
  }
}

// Main
const agent = new ContentCreatorAgent();

const command = process.argv[2];
if (command === '--marca') {
  const marcaId = process.argv[3];
  agent.processMarc(marcaId).catch(console.error);
} else {
  agent.processAll().catch(console.error);
}

export default ContentCreatorAgent;
