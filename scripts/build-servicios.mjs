// Genera las paginas de servicio desde scripts/servicios.json.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { cabecera, nav, pie, esc } from './comun.mjs';

const servicios = JSON.parse(readFileSync('scripts/servicios.json', 'utf8'));
const casos = JSON.parse(readFileSync('scripts/casos.json', 'utf8'));

for (const s of servicios) {
  const url = `https://oopart.cl/servicios/${s.slug}/`;
  const otros = servicios.filter((o) => o.slug !== s.slug);
  const caso = casos.find((c) => c.slug === s.caso.slug);

  const head = cabecera({
    titulo: s.titleSeo,
    descripcion: s.descripcion,
    url,
    ogTitulo: `${s.nombre} — Oopart`,
    ogDesc: s.resumen,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.nombre,
        description: s.descripcion,
        provider: { '@type': 'Organization', name: 'Oopart', url: 'https://oopart.cl/' },
        areaServed: { '@type': 'Country', name: 'Chile' },
        url,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: s.nombre,
          itemListElement: s.incluye.map((i) => ({
            '@type': 'Offer', itemOffered: { '@type': 'Service', name: i.titulo },
          })),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://oopart.cl/' },
          { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://oopart.cl/#servicios' },
          { '@type': 'ListItem', position: 3, name: s.nombre, item: url },
        ],
      },
    ],
  });

  const cuerpo = `
${nav}
<main id="main">

<section class="hero-grid relative flex items-center pt-16 overflow-hidden" style="min-height:auto">
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="max-w-6xl mx-auto px-6 py-16 md:py-20 w-full">
    <nav class="breadcrumb reveal" aria-label="Ruta de navegación">
      <a href="/">Inicio</a> <span aria-hidden="true">/</span>
      <a href="/#servicios">Servicios</a> <span aria-hidden="true">/</span>
      <span>${esc(s.nombre)}</span>
    </nav>
    <div class="max-w-3xl mt-6">
      <h1 class="font-display font-semibold text-3xl md:text-5xl mb-6 t-text reveal">${esc(s.nombre)}</h1>
      <p class="text-lg font-body font-light leading-relaxed mb-8 max-w-2xl reveal t-muted2" style="transition-delay:.15s">${esc(s.resumen)}</p>
      <div class="flex flex-col sm:flex-row gap-4 reveal" style="transition-delay:.25s">
        <a href="/#contacto" class="btn-accent inline-flex items-center justify-center gap-2 px-6 py-3 font-body font-medium text-sm rounded">Conversemos sobre tu caso</a>
        <a href="/casos/${esc(caso.slug)}/" class="btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 font-body text-sm rounded">Ver un caso real</a>
      </div>
    </div>
  </div>
</section>

<section class="py-20 band">
  <div class="max-w-6xl mx-auto px-6">
    <div class="prosa reveal">
      <span class="eyebrow">El problema</span>
      <h2 class="font-display font-bold text-2xl md:text-3xl t-text mt-2 mb-6" style="margin-top:.5rem">Por dónde partimos</h2>
      ${s.intro.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="py-20 sec-bg">
  <div class="max-w-6xl mx-auto px-6">
    <div class="mb-12 reveal">
      <span class="eyebrow">Qué incluye</span>
      <h2 class="font-display font-bold text-2xl md:text-3xl t-text mt-2">Dos frentes, un mismo equipo</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${s.incluye.map((i, n) => `<article class="service-card rounded-xl p-8 reveal" style="transition-delay:${n * 0.1}s">
        <h3 class="font-display font-semibold text-xl t-text mb-3">${esc(i.titulo)}</h3>
        <p class="t-muted2 text-sm font-body leading-relaxed">${esc(i.texto)}</p>
      </article>`).join('\n      ')}
    </div>
    <div class="mt-10 reveal">
      <p class="text-xs font-body tracking-widest uppercase t-muted mb-4">Tecnologías que solemos usar</p>
      <ul class="flex flex-wrap gap-3 list-none">
        ${s.tecnologias.map((t) => `<li class="tech-pill px-3 py-1.5 rounded-full text-xs font-body">${esc(t)}</li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</section>

<section class="py-20 band">
  <div class="max-w-6xl mx-auto px-6">
    <div class="prosa reveal">
      <span class="eyebrow">Cómo lo abordamos</span>
      <h2 class="font-display font-bold text-2xl md:text-3xl t-text mt-2 mb-6" style="margin-top:.5rem">El método</h2>
      <p>${esc(s.comoLoHacemos)}</p>
      <p>Esto es parte del proceso de cinco pasos que seguimos en todos los proyectos:
        <a href="/#proceso">descubrimiento, diseño, implementación, medición y mejora continua</a>.</p>
    </div>
  </div>
</section>

<section class="py-20 sec-bg">
  <div class="max-w-6xl mx-auto px-6">
    <div class="demo-cta reveal">
      <div>
        <span class="eyebrow">Un caso real</span>
        <h2 class="font-display font-bold text-xl md:text-2xl t-text mt-2 mb-3">${esc(caso.titulo)}</h2>
        <p class="t-muted2 font-body leading-relaxed max-w-2xl">${esc(s.caso.titular)}</p>
      </div>
      <a href="/casos/${esc(caso.slug)}/" class="btn-accent inline-flex items-center justify-center gap-2 px-6 py-3 font-body font-medium text-sm rounded shrink-0">${esc(s.caso.texto)} →</a>
    </div>
  </div>
</section>

<section class="py-20 band">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="font-display font-bold text-2xl t-text mb-8 reveal">Las otras áreas</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${otros.map((o, n) => `<a href="/servicios/${o.slug}/" class="service-card rounded-xl p-6 reveal" style="transition-delay:${n * 0.08}s">
        <h3 class="font-display font-semibold text-base t-text mb-2">${esc(o.nombre)}</h3>
        <p class="text-sm t-muted2 font-body leading-relaxed mb-3">${esc(o.resumen)}</p>
        <p class="text-xs t-accent font-body">Ver el servicio →</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="py-20 sec-bg">
  <div class="max-w-6xl mx-auto px-6">
    <div class="cta-block text-center py-14 px-6 rounded-xl reveal">
      <p class="t-muted2 text-sm font-body mb-2">¿Esto se parece a lo que necesitas?</p>
      <h2 class="font-display font-bold text-2xl md:text-3xl t-text mb-6">Conversemos sin compromiso</h2>
      <a href="/#contacto" class="btn-accent inline-flex items-center justify-center gap-2 px-6 py-3 font-body font-medium text-sm rounded">Escríbenos →</a>
    </div>
  </div>
</section>

</main>
${pie}`;

  mkdirSync(`servicios/${s.slug}`, { recursive: true });
  writeFileSync(`servicios/${s.slug}/index.html`, head + cuerpo);
  console.log(`servicios/${s.slug}/index.html`);
}
console.log(`\n${servicios.length} paginas de servicio generadas`);
