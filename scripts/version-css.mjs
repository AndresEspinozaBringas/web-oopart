// Agrega el hash del contenido de styles.css al <link> de cada pagina HTML.
// Sin esto, un navegador que ya visito el sitio sigue usando el CSS viejo
// y no ve los cambios hasta que limpia la cache a mano.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const IGNORAR = new Set(['node_modules', 'src', 'brand', 'assets', 'scripts', '.git', '.claude', '.wrangler']);

function buscarPaginas(dir = '.') {
  const salida = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    const ruta = dir === '.' ? e.name : join(dir, e.name);
    if (e.isDirectory()) {
      if (!IGNORAR.has(e.name)) salida.push(...buscarPaginas(ruta));
    } else if (e.name.endsWith('.html')) {
      salida.push(ruta);
    }
  }
  return salida;
}

const hash = createHash('sha256').update(readFileSync('styles.css')).digest('hex').slice(0, 8);
const RE = /href="\/styles\.css(?:\?v=[a-f0-9]+)?"/;
const paginas = buscarPaginas();

if (paginas.length === 0) {
  console.error('No se encontro ninguna pagina HTML');
  process.exit(1);
}

let tocadas = 0;
for (const file of paginas) {
  const html = readFileSync(file, 'utf8');
  if (!RE.test(html)) {
    console.error(`No se encontro el <link> de styles.css en ${file}`);
    process.exit(1);
  }
  const nuevo = html.replace(RE, `href="/styles.css?v=${hash}"`);
  if (nuevo !== html) { writeFileSync(file, nuevo); tocadas++; }
}

console.log(`styles.css?v=${hash}  — ${paginas.join(', ')}  (${tocadas} actualizada/s)`);
