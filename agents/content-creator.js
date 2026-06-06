#!/usr/bin/env node

/**
 * AIMA Content Agent - Idea & Caption Generator
 *
 * Genera:
 * ✅ Ideas de contenido inteligentes
 * ✅ Captions profesionales
 *
 * El usuario luego:
 * 👉 Genera imagen en Higgsfield, Canva, o herramienta preferida
 * 👉 Publica en Instagram manualmente o via API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARCAS_PATH = path.join(__dirname, '../data/marcas.json');

const CONTENT_TYPES = {
  educativo: {
    emoji: '📚',
    cta: 'Aprende más',
    tone: 'informativo y útil',
    idea_hint: 'Comparte tips, datos curiosos, casos de éxito, análisis, tutoriales'
  },
  fomo: {
    emoji: '🔥',
    cta: 'No te lo pierdas',
    tone: 'urgente y emocionante',
    idea_hint: 'Ofertas limitadas, urgencia, promociones, trending topics'
  },
  comercial: {
    emoji: '💼',
    cta: 'Descubre cómo',
    tone: 'profesional y convincente',
    idea_hint: 'Presenta servicios, destaca beneficios, call-to-action claro'
  },
  venta: {
    emoji: '🚀',
    cta: 'Contáctanos',
    tone: 'directo y motivador',
    idea_hint: 'Testimonios, resultados, propuestas cerradas, conversión'
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
    return new Date().getDay();
  }

  selectContentType(marca) {
    const dayOfWeek = this.getDayOfWeek();
    const tipos = Object.keys(marca.tipos_contenido);
    return tipos[dayOfWeek % tipos.length];
  }

  generateIdea(marca, contentType) {
    const typeInfo = CONTENT_TYPES[contentType];
    const description = marca.tipos_contenido[contentType];

    return {
      marca: marca.nombre,
      marca_id: marca.id,
      tipo: contentType,
      descripcion: description,
      idea_hint: typeInfo.idea_hint,
      tone: typeInfo.tone,
      emoji: typeInfo.emoji,
      colores_brand: marca.colores_brand,
      voz_marca: marca.voz_marca,
      nicho: marca.nicho
    };
  }

  generateCaption(marca, idea) {
    const lines = [
      idea.emoji + ' ' + idea.descripcion,
      '',
      CONTENT_TYPES[idea.tipo].cta + ' →',
      '',
      `#${marca.nombre.replace(/\s+/g, '')}`,
      ...idea.colores_brand.map(c => `[${c}]`)
    ];

    return lines.join('\n');
  }

  async processMarca(marcaId) {
    const marca = this.marcas.find(m => m.id === marcaId);
    if (!marca) {
      console.error(`Marca ${marcaId} not found`);
      return null;
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📱 ${marca.nombre.toUpperCase()}`);
    console.log(`${'='.repeat(70)}`);

    const contentType = this.selectContentType(marca);
    const idea = this.generateIdea(marca, contentType);
    const caption = this.generateCaption(marca, idea);

    console.log(`\n🎯 Tipo de contenido: ${contentType}`);
    console.log(`\n💡 IDEA:`);
    console.log(`   ${idea.idea_hint}`);
    console.log(`\n📝 CAPTION:`);
    console.log(`${caption}`);
    console.log(`\n🎨 COLORS PARA LA IMAGEN:`);
    console.log(`   ${idea.colores_brand.join(' | ')}`);
    console.log(`\n📋 VOZ DE MARCA:`);
    console.log(`   "${idea.voz_marca}"`);

    return {
      marca: marca.nombre,
      marca_id: marca.id,
      tipo: contentType,
      idea: idea.descripcion,
      idea_hint: idea.idea_hint,
      caption: caption,
      colores_brand: idea.colores_brand,
      voz_marca: idea.voz_marca,
      timestamp: new Date().toISOString()
    };
  }

  async processAll() {
    console.log('\n\n🚀 AIMA CONTENT AGENT - Daily Brief Generator');
    console.log(`🕐 ${new Date().toLocaleString()}\n`);

    const results = [];
    for (const marca of this.marcas) {
      try {
        const result = await this.processMarca(marca.id);
        results.push(result);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
      }
    }

    this.saveLogs(results);
    this.printSummary(results);
    return results;
  }

  saveLogs(results) {
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `ideas_${date}.json`);
    fs.writeFileSync(logFile, JSON.stringify(results, null, 2));
    console.log(`\n📝 Ideas guardadas: ${logFile}`);
  }

  printSummary(results) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 RESUMEN`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Marcas procesadas: ${results.length}`);
    console.log(`\n👉 Próximo paso para cada marca:`);
    console.log(`   1. Lee la IDEA sugerida`);
    console.log(`   2. Genera imagen en Higgsfield, Canva, o herramienta preferida`);
    console.log(`   3. Copia el CAPTION`);
    console.log(`   4. Publica en Instagram\n`);
  }
}

const agent = new ContentCreatorAgent();

const command = process.argv[2];
if (command === '--marca') {
  const marcaId = process.argv[3];
  agent.processMarca(marcaId).catch(console.error);
} else {
  agent.processAll().catch(console.error);
}

export default ContentCreatorAgent;
