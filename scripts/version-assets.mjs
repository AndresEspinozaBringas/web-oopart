// Agrega el hash del contenido a cada recurso propio (CSS y JS) en el HTML.
//
// Cumple dos funciones a la vez:
//  1. Un navegador que ya visito el sitio no se queda con la version vieja:
//     al cambiar el contenido cambia la URL y la vuelve a pedir.
//  2. Permite cachear esos archivos un ano entero (ver _headers). Sin hash
//     habria que revalidarlos en cada visita, que es lo que haciamos antes.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const IGNORAR = new Set(['node_modules', 'src', 'brand', 'assets', 'scripts', '.git', '.claude', '.wrangler']);

// styles.css es obligatorio en toda pagina; los JS no (gracias/ no los necesita
// todos), asi que solo exigimos que cada uno aparezca en alguna parte.
const RECURSOS = [
  { archivo: 'styles.css', attr: 'href', obligatorio: true },
  { archivo: 'app.js', attr: 'src', obligatorio: false },
  { archivo: 'consent.js', attr: 'src', obligatorio: false },
  { archivo: 'analytics.js', attr: 'src', obligatorio: false },
];

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

const paginas = buscarPaginas();
if (paginas.length === 0) {
  console.error('No se encontro ninguna pagina HTML');
  process.exit(1);
}

for (const r of RECURSOS) {
  r.hash = createHash('sha256').update(readFileSync(r.archivo)).digest('hex').slice(0, 8);
  // El ?v= previo se descarta: si no, se irian encadenando.
  r.re = new RegExp(`${r.attr}="/${r.archivo.replace('.', '\\.')}(?:\\?v=[a-f0-9]+)?"`, 'g');
  r.encontrado = 0;
}

for (const file of paginas) {
  let html = readFileSync(file, 'utf8');
  const antes = html;
  for (const r of RECURSOS) {
    const coincidencias = html.match(r.re);
    if (coincidencias) r.encontrado += coincidencias.length;
    else if (r.obligatorio) {
      console.error(`Falta ${r.archivo} en ${file}`);
      process.exit(1);
    }
    html = html.replace(r.re, `${r.attr}="/${r.archivo}?v=${r.hash}"`);
  }
  if (html !== antes) writeFileSync(file, html);
}

for (const r of RECURSOS) {
  if (r.encontrado === 0 && !r.obligatorio) {
    console.error(`Aviso: ${r.archivo} no se referencia en ninguna pagina`);
  }
  console.log(`  ${r.archivo}?v=${r.hash}`.padEnd(34) + `${r.encontrado} referencia/s`);
}
console.log(`${paginas.length} paginas revisadas`);
