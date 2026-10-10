// Cabecera, navegacion y pie compartidos por las paginas generadas.
export const GA = 'G-1FGGRMWGPE';
export const LINKEDIN = 'https://www.linkedin.com/company/22304283/';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function cabecera({ titulo, descripcion, url, ogTitulo, ogDesc, jsonLd = [] }) {
  return `<!DOCTYPE html>
<html lang="es" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(titulo)}</title>
  <meta name="description" content="${esc(descripcion)}" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#30428A" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Oopart" />
  <meta property="og:locale" content="es_CL" />
  <meta property="og:title" content="${esc(ogTitulo)}" />
  <meta property="og:description" content="${esc(ogDesc)}" />
  <meta property="og:image" content="https://oopart.cl/assets/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(ogTitulo)}" />
  <meta name="twitter:description" content="${esc(ogDesc)}" />
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

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

  <script>window.OOPART_GA_ID = '${GA}';</script>
  <script src="/consent.js"></script>
  <script src="/analytics.js" defer></script>

  <link rel="stylesheet" href="/styles.css" />
${jsonLd.map((j) => `  <script type="application/ld+json">\n  ${JSON.stringify(j, null, 2).split('\n').join('\n  ')}\n  </script>`).join('\n')}
</head>
<body>

<a href="#main" class="skip-link">Saltar al contenido</a>`;
}

const toggle = (id) => `
      <button id="${id}" class="theme-toggle" aria-label="Cambiar a tema oscuro">
        <svg class="icon-moon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="icon-sun" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>`;

export const nav = `
<nav class="nav-wrap fixed top-0 left-0 right-0 z-50">
  <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center shrink-0" aria-label="Oopart — inicio">
      <img src="/assets/logo-lockup-white.png" alt="Oopart" width="400" height="161" class="logo-img logo-on-dark" />
      <img src="/assets/logo-lockup-blue.png" alt="" aria-hidden="true" width="400" height="161" class="logo-img logo-on-light" />
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="/#servicios" class="nav-link text-sm font-body">Servicios</a>
      <a href="/#proceso" class="nav-link text-sm font-body">Proceso</a>
      <a href="/#resultados" class="nav-link text-sm font-body">Resultados</a>
      <a href="/#contacto" class="nav-link text-sm font-body">Contacto</a>
    </div>
    <div class="hidden md:flex items-center gap-3">${toggle('theme-btn')}
      <a href="/#contacto" class="btn-accent inline-flex items-center gap-2 px-4 py-2 text-sm font-body font-medium rounded">Conversemos →</a>
    </div>
    <div class="md:hidden flex items-center gap-2">${toggle('theme-btn-mobile')}
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

export const pie = `
<footer class="py-12 sec-bg footer-top">
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="text-center md:text-left">
        <a href="/" aria-label="Oopart — inicio">
          <img src="/assets/logo-full-white.png" alt="Oopart — Tecnología + Desarrollo" width="480" height="193" class="logo-img logo-foot logo-on-dark" />
          <img src="/assets/logo-full-blue.png" alt="" aria-hidden="true" width="480" height="193" class="logo-img logo-foot logo-on-light" />
        </a>
        <p class="text-xs t-muted font-body mt-3">Out of Place Artefact — Tecnología que transforma.</p>
      </div>
      <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Pie de página">
        <a href="/#servicios" class="nav-link text-xs font-body">Servicios</a>
        <a href="/#proceso" class="nav-link text-xs font-body">Proceso</a>
        <a href="/#resultados" class="nav-link text-xs font-body">Resultados</a>
        <a href="/#contacto" class="nav-link text-xs font-body">Contacto</a>
        <a href="/privacidad/" class="nav-link text-xs font-body">Privacidad</a>
        <a href="${LINKEDIN}" class="nav-link text-xs font-body" target="_blank" rel="noopener">LinkedIn ↗</a>
      </nav>
      <p class="text-xs t-muted font-body">© <span id="year">2026</span> Oopart. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>

<script src="/app.js"></script>

</body>
</html>
`;
