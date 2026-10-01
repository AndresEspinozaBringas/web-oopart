// Agrega el hash del contenido de styles.css a su <link> en index.html.
// Sin esto, un navegador que ya visito el sitio sigue usando el CSS viejo
// y no ve los cambios hasta que limpia la cache a mano.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const css = readFileSync('styles.css');
const hash = createHash('sha256').update(css).digest('hex').slice(0, 8);

const file = 'index.html';
const html = readFileSync(file, 'utf8');
const actualizado = html.replace(
  /href="\/styles\.css(?:\?v=[a-f0-9]+)?"/,
  `href="/styles.css?v=${hash}"`
);

if (actualizado === html && !html.includes(`styles.css?v=${hash}`)) {
  console.error('No se encontro el <link> de styles.css en index.html');
  process.exit(1);
}

writeFileSync(file, actualizado);
console.log(`styles.css?v=${hash}`);
