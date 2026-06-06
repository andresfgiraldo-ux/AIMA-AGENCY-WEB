#!/usr/bin/env node

/**
 * AIMA Content Planner
 * Plan mensual completo de contenido para cada marca
 *
 * Para cada día incluye:
 * ✅ Prompt detallado para imagen/video
 * ✅ Logo original de marca (especificado)
 * ✅ Herramienta recomendada
 * ✅ Tipo: Post | Carrusel | Reel | Historia
 * ✅ Caption profesional
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
    formats: ['post', 'carrusel', 'reel'],
    tools: ['Higgsfield', 'Canva', 'Adobe Express']
  },
  fomo: {
    emoji: '🔥',
    cta: 'No te lo pierdas',
    tone: 'urgente y emocionante',
    formats: ['reel', 'historia', 'post'],
    tools: ['Higgsfield', 'CapCut', 'Canva']
  },
  comercial: {
    emoji: '💼',
    cta: 'Descubre cómo',
    tone: 'profesional y convincente',
    formats: ['post', 'carrusel', 'reel'],
    tools: ['Canva', 'Higgsfield', 'Adobe Express']
  },
  venta: {
    emoji: '🚀',
    cta: 'Contáctanos',
    tone: 'directo y motivador',
    formats: ['reel', 'post', 'carrusel'],
    tools: ['Higgsfield', 'Canva', 'CapCut']
  }
};

class ContentPlanner {
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

  getContentTypeByDay(dayOfMonth) {
    const types = Object.keys(CONTENT_TYPES);
    return types[(dayOfMonth - 1) % types.length];
  }

  selectFormat(contentType) {
    const formats = CONTENT_TYPES[contentType].formats;
    const random = Math.floor(Math.random() * formats.length);
    return formats[random];
  }

  selectTool(contentType) {
    const tools = CONTENT_TYPES[contentType].tools;
    const random = Math.floor(Math.random() * tools.length);
    return tools[random];
  }

  generatePrompt(marca, contentType, format, dayOfMonth) {
    const typeInfo = CONTENT_TYPES[contentType];
    const description = marca.tipos_contenido[contentType];

    let prompt = '';

    if (format === 'reel') {
      prompt = `Create a ${marca.nombre} Instagram REEL (15-30 seconds):
- Include the ORIGINAL ${marca.nombre} logo prominently
- Content: ${description}
- Style: ${marca.identidad_visual}
- Tone: ${typeInfo.tone}
- Brand voice: "${marca.voz_marca}"
- Colors: ${marca.colores_brand.join(', ')}
- Goal: Viral, engaging, mobile-optimized
- Platform: Instagram Reels (1080x1920px)`;
    } else if (format === 'carrusel') {
      prompt = `Create a ${marca.nombre} Instagram CAROUSEL (3-5 slides):
- Slide 1: INCLUDE ORIGINAL ${marca.nombre} LOGO
- Remaining slides: Visual storytelling of "${description}"
- Style: ${marca.identidad_visual}
- Tone: ${typeInfo.tone}
- Brand colors: ${marca.colores_brand.join(', ')}
- Each slide: 1080x1350px
- Call to action on last slide: "${typeInfo.cta}"`;
    } else if (format === 'historia') {
      prompt = `Create an Instagram STORY for ${marca.nombre}:
- Include ORIGINAL ${marca.nombre} LOGO at top
- Duration: 5-15 seconds
- Content: ${description}
- Style: ${marca.identidad_visual}
- Interactive element (poll, question, quiz)
- Brand colors: ${marca.colores_brand.join(', ')}
- Dimension: 1080x1920px`;
    } else {
      // post
      prompt = `Create an Instagram POST for ${marca.nombre}:
- INCLUDE ORIGINAL ${marca.nombre} LOGO in the design
- Content theme: ${description}
- Visual style: ${marca.identidad_visual}
- Tone: ${typeInfo.tone}
- Brand voice: "${marca.voz_marca}"
- Dominant colors: ${marca.colores_brand.join(', ')}
- Dimension: 1080x1350px
- High quality, professional, on-brand`;
    }

    return prompt;
  }

  generateCaption(marca, contentType) {
    const typeInfo = CONTENT_TYPES[contentType];
    const description = marca.tipos_contenido[contentType];

    const lines = [
      typeInfo.emoji + ' ' + description,
      '',
      typeInfo.cta + ' →',
      '',
      `#${marca.nombre.replace(/\s+/g, '')}`,
      ...marca.colores_brand.map(c => `[${c}]`)
    ];

    return lines.join('\n');
  }

  generateMonthlyPlan(marca) {
    const plan = {
      marca: marca.nombre,
      marca_id: marca.id,
      mes: new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
      instagram: marca.instagram,
      logo_original: `${marca.nombre} logo (original file from brand assets)`,
      dias: []
    };

    // Generar 30 días
    for (let day = 1; day <= 30; day++) {
      const contentType = this.getContentTypeByDay(day);
      const format = this.selectFormat(contentType);
      const tool = this.selectTool(contentType);
      const prompt = this.generatePrompt(marca, contentType, format, day);
      const caption = this.generateCaption(marca, contentType);

      plan.dias.push({
        dia: day,
        fecha: new Date(new Date().getFullYear(), new Date().getMonth(), day)
          .toLocaleDateString('es-ES'),
        tipo_contenido: contentType,
        formato: format,
        herramienta_recomendada: tool,
        logo_original: `✅ DEBE INCLUIR el logo original de ${marca.nombre}`,
        prompt: prompt,
        caption: caption,
        colores_brand: marca.colores_brand,
        voz_marca: marca.voz_marca
      });
    }

    return plan;
  }

  async generateAllPlans() {
    console.log('\n\n🚀 AIMA CONTENT PLANNER - Monthly Plans');
    console.log(`Generated: ${new Date().toLocaleString()}\n`);

    const allPlans = [];

    for (const marca of this.marcas) {
      console.log(`📋 Generando plan mensual para ${marca.nombre}...`);
      const plan = this.generateMonthlyPlan(marca);
      allPlans.push(plan);

      this.printPlanPreview(plan);
    }

    this.savePlans(allPlans);
    return allPlans;
  }

  printPlanPreview(plan) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📱 ${plan.marca.toUpperCase()}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Instagram: ${plan.instagram}`);
    console.log(`Logo original: ${plan.logo_original}`);
    console.log(`Mes: ${plan.mes}`);
    console.log(`Total días: ${plan.dias.length}\n`);

    // Mostrar primeros 3 días como ejemplo
    console.log('📅 Ejemplo - Primeros 3 días:');
    for (let i = 0; i < 3; i++) {
      const dia = plan.dias[i];
      console.log(`\n   DÍA ${dia.dia} (${dia.fecha})`);
      console.log(`   Tipo: ${dia.tipo_contenido} | Formato: ${dia.formato}`);
      console.log(`   Tool: ${dia.herramienta_recomendada}`);
      console.log(`   Logo: ${dia.logo_original}`);
    }

    console.log(`\n   ... (27 días más en el archivo JSON)`);
  }

  savePlans(allPlans) {
    const plansDir = path.join(__dirname, '../content-plans');
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    const date = new Date().toISOString().split('T')[0];
    const filename = `monthly-plan_${date}.json`;
    const filepath = path.join(plansDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(allPlans, null, 2));

    console.log(`\n${'='.repeat(80)}`);
    console.log(`✅ Plan mensual guardado: ${filepath}`);
    console.log(`${'='.repeat(80)}\n`);

    // También crear un archivo README para cada marca
    for (const plan of allPlans) {
      this.createMarkdownPlan(plan, plansDir);
    }
  }

  createMarkdownPlan(plan, plansDir) {
    let markdown = `# 📋 Plan de Contenido Mensual - ${plan.marca}\n\n`;
    markdown += `**Instagram:** ${plan.instagram}\n`;
    markdown += `**Mes:** ${plan.mes}\n`;
    markdown += `**Logo Original:** ${plan.logo_original}\n\n`;

    markdown += `---\n\n`;

    for (const dia of plan.dias) {
      markdown += `## Día ${dia.dia} - ${dia.fecha}\n\n`;
      markdown += `**Tipo:** ${dia.tipo_contenido}  \n`;
      markdown += `**Formato:** ${dia.formato}  \n`;
      markdown += `**Herramienta:** ${dia.herramienta_recomendada}  \n`;
      markdown += `**Logo:** ${dia.logo_original}\n\n`;

      markdown += `### 🎨 Prompt para generar imagen/video:\n\n`;
      markdown += `\`\`\`\n${dia.prompt}\n\`\`\`\n\n`;

      markdown += `### 💬 Caption:\n\n`;
      markdown += `\`\`\`\n${dia.caption}\n\`\`\`\n\n`;

      markdown += `**Colors:** ${dia.colores_brand.join(' | ')}  \n`;
      markdown += `**Brand Voice:** "${dia.voz_marca}"\n\n`;
      markdown += `---\n\n`;
    }

    const filename = `${plan.marca_id}-monthly-plan.md`;
    const filepath = path.join(plansDir, filename);
    fs.writeFileSync(filepath, markdown);
  }
}

// Main
const planner = new ContentPlanner();
planner.generateAllPlans().catch(console.error);

export default ContentPlanner;
