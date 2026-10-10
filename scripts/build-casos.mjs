// Genera las paginas de caso de exito desde scripts/casos.json.
// Las paginas resultantes se commitean: Cloudflare no ejecuta build.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const casos = JSON.parse(readFileSync('scripts/casos.json', 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const nav = (activo = '') => `
<nav class="nav-wrap fixed top-0 left-0 right-0 z-50">
  <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center shrink-0" aria-label="Oopart — inicio">
      <img src="/assets/logo-lockup-white.webp" alt="Oopart" width="400" height="161" class="logo-img logo-on-dark" />
      <img src="/assets/logo-lockup-blue.webp" alt="" aria-hidden="true" width="400" height="161" class="logo-img logo-on-light" />
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="/#servicios" class="nav-link text-sm font-body">Servicios</a>
      <a href="/#proceso" class="nav-link text-sm font-body">Proceso</a>
      <a href="/#resultados" class="nav-link text-sm font-body">Resultados</a>
      <a href="/#contacto" class="nav-link text-sm font-body">Contacto</a>
    </div>
    <div class="hidden md:flex items-center gap-3">
      <button id="theme-btn" class="theme-toggle" aria-label="Cambiar a tema oscuro">
        <svg class="icon-moon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="icon-sun" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
      <a href="/#contacto" class="btn-accent inline-flex items-center gap-2 px-4 py-2 text-sm font-body font-medium rounded">Conversemos →</a>
    </div>
    <div class="md:hidden flex items-center gap-2">
      <button id="theme-btn-mobile" class="theme-toggle" aria-label="Cambiar a tema oscuro">
        <svg class="icon-moon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="icon-sun" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
      <button id="menu-btn" class="nav-link p-1" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="md:hidden">
    <div class="flex flex-col px-6 py-4 gap-4">
      <a href="/#servicios" class="nav-link text-sm" data-close>Servicios</a>
      <a href="/#proceso" class="nav-link text-sm" data-close>Proceso</a>
      <a href="/#resultados" class="nav-link text-sm" data-close>Resultados</a>
      <a href="/#contacto" class="nav-link text-sm" data-close>Contacto</a>
      <a href="/#contacto" class="btn-accent inline-flex items-center gap-2 px-4 py-2 text-sm font-body font-medium rounded w-fit" data-close>Conversemos →</a>
    </div>
  </div>
</nav>`;

const pie = `
<footer class="py-12 sec-bg footer-top">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="text-center md:text-left">
        <a href="/" aria-label="Oopart — inicio">
          <img src="/assets/logo-full-white.webp" alt="Oopart — Tecnología + Desarrollo" width="480" height="193" class="logo-img logo-foot logo-on-dark" loading="lazy" decoding="async" />
          <img src="/assets/logo-full-blue.webp" alt="" aria-hidden="true" width="480" height="193" class="logo-img logo-foot logo-on-light" loading="lazy" decoding="async" />
        </a>
        <p class="text-xs t-muted font-body mt-3">Out of Place Artefact — Tecnología que transforma.</p>
      </div>
      <nav class="flex gap-6" aria-label="Pie de página">
        <a href="/#servicios" class="nav-link text-xs font-body">Servicios</a>
        <a href="/#proceso" class="nav-link text-xs font-body">Proceso</a>
        <a href="/#resultados" class="nav-link text-xs font-body">Resultados</a>
        <a href="/#contacto" class="nav-link text-xs font-body">Contacto</a>
        <a href="/privacidad/" class="nav-link text-xs font-body">Privacidad</a>
      </nav>
      <p class="text-xs t-muted font-body">© <span id="year">2026</span> Oopart. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>`;

for (const c of casos) {
  const otros = casos.filter((o) => o.slug !== c.slug);
  const url = `https://oopart.cl/casos/${c.slug}/`;

  const html = `<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(c.titleSeo)}</title>
  <meta name="description" content="${esc(c.descripcion)}" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#30428A" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Oopart" />
  <meta property="og:locale" content="es_CL" />
  <meta property="og:title" content="${esc(c.titulo)} — ${esc(c.cliente)}" />
  <meta property="og:description" content="${esc(c.resumen)}" />
  <meta property="og:image" content="https://oopart.cl/assets/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(c.titulo)} — ${esc(c.cliente)}" />
  <meta name="twitter:description" content="${esc(c.resumen)}" />
  <meta name="twitter:image" content="https://oopart.cl/assets/og-image.png" />

  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" href="/assets/icon-512.png" type="image/png" sizes="512x512" />
  <link rel="apple-touch-icon" href="/assets/icon-180.png" />

  <script>
    (function () {
      var t = 'light';
      try { t = localStorage.getItem('oopart-theme') || 'light'; } catch (e) {}
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.classList.add('js');
    })();
  </script>

  <!-- Fuentes auto-hospedadas (ver scripts/fuentes.mjs). Los @font-face viven
       dentro de styles.css; el preload le avisa al navegador que las pida ya,
       sin esperar a terminar de parsear la hoja de estilos. -->
  <link rel="preload" href="/assets/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/assets/fonts/ibm-plex-sans.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Google Analytics 4: pon aqui el identificador de medicion (G-XXXXXXXXXX) para activarlo -->
  <script>window.OOPART_GA_ID = 'G-1FGGRMWGPE';</script>
  <script>window.OOPART_CLARITY_ID = 'yvkufc95j3';</script>
  <script src="/consent.js" defer></script>
  <script src="/analytics.js" defer></script>

  <link rel="stylesheet" href="/styles.css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(c.titulo + ' — ' + c.cliente)},
    "description": ${JSON.stringify(c.descripcion)},
    "about": ${JSON.stringify(c.industria)},
    "author": { "@type": "Organization", "name": "Oopart", "url": "https://oopart.cl/" },
    "publisher": { "@type": "Organization", "name": "Oopart", "logo": { "@type": "ImageObject", "url": "https://oopart.cl/assets/icon-512.png" } },
    "mainEntityOfPage": ${JSON.stringify(url)}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://oopart.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Casos de éxito", "item": "https://oopart.cl/#resultados" },
      { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(c.cliente)}, "item": ${JSON.stringify(url)} }
    ]
  }
  </script>
</head>
<body>

<a href="#main" class="skip-link">Saltar al contenido</a>
${nav()}
<main id="main">

<section class="hero-grid relative flex items-center pt-16 overflow-hidden" style="min-height:auto">
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="max-w-6xl mx-auto px-6 py-16 md:py-20 w-full">
    <nav class="breadcrumb reveal-ya" aria-label="Ruta de navegación">
      <a href="/">Inicio</a> <span aria-hidden="true">/</span>
      <a href="/#resultados">Casos de éxito</a> <span aria-hidden="true">/</span>
      <span>${esc(c.cliente)}</span>
    </nav>

    <div class="max-w-3xl mt-6">
      <span class="tag reveal-ya">${esc(c.industria)}</span>
      <p class="text-sm t-muted font-body mb-3 mt-2 reveal-ya">${c.clienteUrl ? `<a href="${c.clienteUrl}" target="_blank" rel="noopener" class="link-accent">${esc(c.cliente)} ↗</a>` : esc(c.cliente)}</p>

      <h1 class="font-display font-semibold text-3xl md:text-5xl mb-6 t-text reveal-ya" style="animation-delay:.1s">${esc(c.titulo)}</h1>

      <p class="text-lg font-body font-light leading-relaxed mb-8 max-w-2xl reveal-ya t-muted2" style="animation-delay:.2s">${esc(c.resumen)}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl reveal-ya" style="animation-delay:.3s">
        ${c.metricas.map((m) => `<div class="metric"><p class="metric-v">${esc(m.v)}</p><p class="metric-l">${esc(m.l)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="py-20 band">
  <div class="max-w-6xl mx-auto px-6">
    <div class="max-w-3xl">
      <div class="reveal">
        <span class="eyebrow">El desafío</span>
        <h2 class="font-display font-bold text-2xl md:text-3xl t-text mt-2 mb-6">Qué estaba pasando</h2>
        ${c.desafio.map((p) => `<p class="t-muted2 font-body leading-relaxed mb-4">${esc(p)}</p>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="py-20 sec-bg">
  <div class="max-w-6xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 reveal">
        <span class="eyebrow">La solución</span>
        <h2 class="font-display font-bold text-2xl md:text-3xl t-text mt-2 mb-6">Qué construimos</h2>
        ${c.solucion.map((p) => `<p class="t-muted2 font-body leading-relaxed mb-4">${esc(p)}</p>`).join('\n        ')}
      </div>
      <aside class="reveal" style="transition-delay:.15s">
        <h3 class="text-xs font-body tracking-widest uppercase t-muted mb-4">Capacidades aplicadas</h3>
        <ul class="sub-services">
          ${c.capacidades.map((x) => `<li>${esc(x)}</li>`).join('\n          ')}
        </ul>
        ${c.sitio ? `<p class="case-link mt-6"><a href="${c.sitio.url}" target="_blank" rel="noopener">${esc(c.sitio.texto)} →</a></p>` : ''}
      </aside>
    </div>
  </div>
</section>

<section class="py-20 band">
  <div class="max-w-6xl mx-auto px-6">
    <div class="reveal">
      <span class="eyebrow">Resultados</span>
      <h2 class="font-display font-bold text-2xl md:text-3xl t-text mt-2 mb-6">Qué cambió</h2>
      <p class="t-muted2 font-body leading-relaxed max-w-2xl mb-10">${esc(c.cierre)}</p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${c.metricas.map((m) => `<div class="metric"><p class="metric-v">${esc(m.v)}</p><p class="metric-l">${esc(m.l)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="py-20 sec-bg">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="font-display font-bold text-2xl t-text mb-8 reveal">Otros casos</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${otros.map((o, i) => `<a href="/casos/${o.slug}/" class="service-card rounded-xl p-6 reveal" style="transition-delay:${i * 0.08}s">
        <span class="tag">${esc(o.industria)}</span>
        <p class="text-xs t-muted font-body mb-2 mt-1">${esc(o.cliente)}</p>
        <h3 class="font-display font-semibold text-base t-text mb-2">${esc(o.titulo)}</h3>
        <p class="text-xs t-accent font-body">Ver el caso →</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="py-20 band">
  <div class="max-w-6xl mx-auto px-6">
    <div class="cta-block text-center py-14 px-6 rounded-xl reveal">
      <p class="t-muted2 text-sm font-body mb-2">¿Tienes un problema parecido?</p>
      <h2 class="font-display font-bold text-2xl md:text-3xl t-text mb-6">Conversemos sobre tu caso</h2>
      <a href="/#contacto" class="btn-accent inline-flex items-center justify-center gap-2 px-6 py-3 font-body font-medium text-sm rounded">Escríbenos →</a>
    </div>
  </div>
</section>

</main>
${pie}
<script src="/app.js"></script>

</body>
</html>
`;

  mkdirSync(`casos/${c.slug}`, { recursive: true });
  writeFileSync(`casos/${c.slug}/index.html`, html);
  console.log(`casos/${c.slug}/index.html`);
}
console.log(`\n${casos.length} paginas generadas`);
