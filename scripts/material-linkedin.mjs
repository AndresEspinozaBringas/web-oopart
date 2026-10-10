// Inventario del material publicable del sitio, para preparar posts de LinkedIn.
//
// No escribe los posts: reune en un solo lugar las piezas que sirven de insumo
// (metricas de cada caso, cierres, frases destacadas y paginas enlazables) para
// no tener que ir abriendo HTML uno por uno cada vez que toca publicar.
//
// La automatizacion llega hasta aca a proposito. Publicar en LinkedIn con bots
// viola sus terminos de servicio y se paga con la restriccion de la cuenta; el
// programador nativo de LinkedIn hace el resto gratis y sin riesgo.
//
// Uso: node scripts/material-linkedin.mjs > marketing/material.md
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const casos = JSON.parse(readFileSync('scripts/casos.json', 'utf8'));
const servicios = JSON.parse(readFileSync('scripts/servicios.json', 'utf8'));

const IGNORAR = new Set(['node_modules', 'src', 'brand', 'assets', 'scripts', 'marketing',
                         '.git', '.claude', '.wrangler']);

function paginas(dir = '.') {
  const salida = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const ruta = dir === '.' ? e.name : join(dir, e.name);
    if (e.isDirectory()) { if (!IGNORAR.has(e.name)) salida.push(...paginas(ruta)); }
    else if (e.name === 'index.html') salida.push(ruta);
  }
  return salida;
}

const sinEtiquetas = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// Paginas que existen por obligacion legal o funcional, no para promocionar.
const NO_PROMOCIONAR = /^(privacidad|gracias)\//;

console.log('# Material disponible para LinkedIn\n');
console.log('_Generado por `scripts/material-linkedin.mjs`. No editar a mano._\n');

console.log('## Casos de éxito\n');
for (const c of casos) {
  console.log(`### ${c.cliente} — ${c.titulo}`);
  console.log(`- URL: https://oopart.cl/casos/${c.slug}/`);
  console.log(`- Industria: ${c.industria}`);
  console.log(`- Métricas: ${c.metricas.map((m) => `**${m.v}** ${m.l}`).join(' · ')}`);
  if (c.cierre) console.log(`- Cierre: ${c.cierre}`);
  console.log();
}

console.log('## Páginas enlazables\n');
for (const f of paginas().sort()) {
  const s = readFileSync(f, 'utf8');
  if (/name="robots" content="[^"]*noindex/.test(s)) continue;
  if (NO_PROMOCIONAR.test(f)) continue;
  const url = 'https://oopart.cl/' + f.replace(/index\.html$/, '');
  const titulo = (s.match(/<title>(.*?)<\/title>/s) || [])[1] || '?';
  console.log(`- [${titulo}](${url})`);
}

console.log('\n## Frases destacadas del sitio\n');
console.log('_Los párrafos marcados como `.nota` están escritos para quedarse grabados, ' +
            'así que son el mejor punto de partida para un post sin enlace._\n');
for (const f of paginas().sort()) {
  if (NO_PROMOCIONAR.test(f)) continue;
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/<p class="nota">(.*?)<\/p>/gs)) {
    console.log(`- **${f.replace(/index\.html$/, '') || '/'}** — ${sinEtiquetas(m[1])}`);
  }
}

console.log('\n## Servicios\n');
for (const s of servicios) {
  console.log(`- **${s.nombre}** — https://oopart.cl/servicios/${s.slug}/`);
  if (s.resumen) console.log(`  ${sinEtiquetas(s.resumen)}`);
}
