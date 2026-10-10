// Descarga las fuentes desde Google y genera src/fuentes.css para auto-hospedarlas.
//
// Por que: pedirlas a fonts.googleapis.com obliga al navegador a resolver dos
// dominios extra (googleapis y gstatic) antes de poder pintar texto. Lighthouse
// lo midio en ~830 ms de bloqueo de render. Auto-hospedadas viajan en la misma
// conexion que el resto del sitio.
//
// Ademas, pedirlas desde el navegador del visitante envia su IP a Google. Un
// tribunal aleman lo declaro incompatible con el RGPD en 2022; vendiendo
// cumplimiento de la Ley 21.719 conviene no hacerlo.
//
// Solo bajamos el subconjunto "latin": cubre todo el espanol (incluidos
// acentos, enie y signos de apertura). Los demas subconjuntos que sirve Google
// (cirilico, griego, vietnamita) no se usan nunca aca.
//
// Uso: node scripts/fuentes.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

const FAMILIAS = 'family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@300;400;500';
// Sin un User-Agent moderno, Google devuelve formatos antiguos (ttf) en vez de woff2.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const css = await fetch(
  'https://fonts.googleapis.com/css2?' + FAMILIAS + '&display=swap',
  { headers: { 'User-Agent': UA } }
).then((r) => r.text());

// Google antecede cada @font-face con un comentario que nombra el subconjunto.
const bloques = css.split('/* ').slice(1).map((b) => ({
  sub: b.slice(0, b.indexOf(' */')),
  fam: (b.match(/font-family: '([^']+)'/) || [])[1],
  peso: (b.match(/font-weight: (\d+)/) || [])[1],
  url: (b.match(/url\((https:[^)]+)\)/) || [])[1],
  rango: (b.match(/unicode-range: ([^;]+);/) || [])[1],
})).filter((b) => b.sub === 'latin' && b.url);

if (bloques.length === 0) throw new Error('Google no devolvio bloques latin; reviso el User-Agent?');

mkdirSync('assets/fonts', { recursive: true });

// Google sirve estas dos familias como fuentes VARIABLES: el archivo del peso
// 300 y el del 500 son byte por byte el mismo. Si emitieramos un @font-face por
// peso, el navegador bajaria el mismo archivo tres veces (188 KB en vez de 63).
// Agrupamos por familia y declaramos el rango de pesos, que es como se usan las
// fuentes variables: el navegador interpola los intermedios por su cuenta.
const familias = new Map();
for (const b of bloques) {
  if (!familias.has(b.fam)) familias.set(b.fam, { ...b, pesos: [] });
  familias.get(b.fam).pesos.push(Number(b.peso));
}

for (const f of familias.values()) {
  f.archivo = f.fam.toLowerCase().replace(/[^a-z]+/g, '-') + '.woff2';
  const datos = Buffer.from(await fetch(f.url).then((r) => r.arrayBuffer()));
  writeFileSync('assets/fonts/' + f.archivo, datos);
  const min = Math.min(...f.pesos), max = Math.max(...f.pesos);
  f.rangoPeso = min === max ? String(min) : min + ' ' + max;
  console.log('  ' + f.archivo.padEnd(24) + String(datos.length).padStart(7) + ' B   pesos ' + f.rangoPeso);
}

const cabecera = [
  '/* Generado por scripts/fuentes.mjs. No editar a mano.',
  ' * Fuentes auto-hospedadas para no depender de fonts.googleapis.com:',
  ' * elimina dos dominios de la ruta critica de render y evita enviar la IP',
  ' * del visitante a Google. Variables y solo subconjunto latin. */',
  '',
].join('\n');

const caras = [...familias.values()].map((f) => [
  '@font-face {',
  "  font-family: '" + f.fam + "';",
  '  font-style: normal;',
  '  font-weight: ' + f.rangoPeso + ';',
  // swap: el texto se pinta de inmediato con la fuente del sistema y se
  // reemplaza al llegar la nuestra. Sin esto quedaria invisible mientras carga.
  '  font-display: swap;',
  '  src: url(/assets/fonts/' + f.archivo + ') format("woff2");',
  '  unicode-range: ' + f.rango + ';',
  '}',
].join('\n')).join('\n\n');

writeFileSync('src/fuentes.css', cabecera + caras + '\n');
console.log('\nsrc/fuentes.css: ' + familias.size + ' @font-face');
