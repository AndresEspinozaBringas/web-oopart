// Consent Mode v2.
// Se carga ANTES que analytics.js: deja todo el almacenamiento denegado por
// defecto, de modo que GA4 no escribe cookies ni identificadores hasta que
// la persona acepta. Si acepta, se actualiza el estado; si rechaza, GA4
// sigue sin cookies.
(function () {
  'use strict';

  var CLAVE = 'oopart-consent';
  var MESES_VIGENCIA = 12;

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // 1. Por defecto, todo denegado (debe ir antes de cualquier config)
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',   // preferencias propias, p. ej. el tema
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function leer() {
    try {
      var g = JSON.parse(localStorage.getItem(CLAVE));
      if (!g || !g.fecha) return null;
      var meses = (Date.now() - g.fecha) / (1000 * 60 * 60 * 24 * 30);
      return meses > MESES_VIGENCIA ? null : g;   // caduca y se vuelve a preguntar
    } catch (e) { return null; }
  }

  function guardar(acepta) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({ acepta: acepta, fecha: Date.now() }));
    } catch (e) {}
  }

  var clarityCargado = false;
  function cargarClarity() {
    var id = window.OOPART_CLARITY_ID;
    if (clarityCargado || !id || !/^[a-z0-9]+$/.test(id)) return;
    clarityCargado = true;
    // Microsoft Clarity: mapas de calor y grabacion de sesiones.
    // Solo se carga si la persona acepto; sin aceptacion no se inyecta nada.
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);
  }

  // analytics.js consulta esto al arrancar: corre despues que nosotros (ambos
  // con defer, en orden), asi que una decision ya guardada no alcanza a
  // notificarse por evento y tiene que poder preguntarse.
  window.oopartAnaliticaPermitida = function () {
    var g = leer();
    return !!(g && g.acepta);
  };

  function aplicar(acepta) {
    if (acepta) cargarClarity();
    // Avisamos para que analytics.js baje gtag.js (196 KB) solo ahora. Antes lo
    // cargaba siempre y quien rechazaba pagaba ese peso igual.
    document.dispatchEvent(new CustomEvent('oopart:consentimiento', {
      detail: { analitica: acepta }
    }));
    gtag('consent', 'update', {
      analytics_storage: acepta ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
  }

  // 2. Si ya hay una decisión vigente, aplicarla de inmediato
  var guardado = leer();
  if (guardado) aplicar(guardado.acepta);

  // 3. Banner: solo si no hay decisión vigente
  function montarBanner() {
    if (leer()) return;

    var b = document.createElement('div');
    b.className = 'consent-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-modal', 'false');
    b.setAttribute('aria-labelledby', 'consent-titulo');
    b.setAttribute('aria-describedby', 'consent-texto');
    b.innerHTML =
      '<div class="consent-inner">' +
        '<div class="consent-copy">' +
          '<p id="consent-titulo" class="consent-title">Cookies de medición</p>' +
          '<p id="consent-texto" class="consent-text">Usamos Google Analytics para saber qué contenido resulta útil. ' +
          'No usamos cookies de publicidad ni compartimos tus datos con terceros con fines comerciales. ' +
          'Puedes rechazarlas y el sitio funciona igual. ' +
          'Lee <a href="/privacidad/">cómo tratamos tus datos</a>.</p>' +
        '</div>' +
        '<div class="consent-actions">' +
          '<button type="button" class="consent-btn consent-btn-no" data-consent="no">Rechazar</button>' +
          '<button type="button" class="consent-btn consent-btn-si" data-consent="si">Aceptar</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(b);
    // setTimeout y no requestAnimationFrame: rAF no corre en pestanas de fondo
    // y el banner se quedaria sin aparecer.
    setTimeout(function () { b.classList.add('visible'); }, 50);

    b.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var acepta = btn.getAttribute('data-consent') === 'si';
      guardar(acepta);
      aplicar(acepta);
      b.classList.remove('visible');
      setTimeout(function () { b.remove(); }, 300);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montarBanner);
  } else {
    montarBanner();
  }

  // 4. Permite reabrir la decisión desde la página de privacidad
  window.oopartAbrirConsentimiento = function () {
    try { localStorage.removeItem(CLAVE); } catch (e) {}
    var previo = document.querySelector('.consent-banner');
    if (previo) previo.remove();
    montarBanner();
  };
})();
