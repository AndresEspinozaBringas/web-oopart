(function () {
  'use strict';

  var html = document.documentElement;

  // ── TEMA ──
  function labelFor(theme) {
    return theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  }
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('oopart-theme', theme); } catch (e) {}
    ['theme-btn', 'theme-btn-mobile'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.setAttribute('aria-label', labelFor(theme));
    });
  }
  applyTheme(html.getAttribute('data-theme') || 'light');

  ['theme-btn', 'theme-btn-mobile'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', function () {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  // ── REVEAL (respeta prefers-reduced-motion y degrada sin IntersectionObserver) ──
  var reveals = document.querySelectorAll('.reveal');
  var quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (quiet || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ── MENÚ MÓVIL ──
  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {

  function setMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(!menu.classList.contains('open'));
  });
  menu.querySelectorAll('[data-close]').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  }

  // ── AÑO DEL FOOTER ──
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ── FORMULARIO ──
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;          // paginas sin formulario de contacto

  function showStatus(kind, msg) {
    status.textContent = msg;
    status.classList.remove('hidden', 'is-ok', 'is-err');
    status.classList.add(kind === 'ok' ? 'is-ok' : 'is-err');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    var original = btn.textContent;

    status.classList.add('hidden');          // limpiar resultado anterior
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    function restaurar() {
      btn.textContent = original;
      btn.disabled = false;
    }

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok) {
            form.reset();
            showStatus('ok', '✓ Mensaje enviado. Te contactaremos dentro de 24 horas hábiles.');
          } else {
            // mostrar el motivo real en vez de un error generico
            var motivo = (data.errors || []).map(function (x) { return x.message; }).join('. ')
                       || data.error || '';
            showStatus('err', motivo
              ? 'No se pudo enviar: ' + motivo + ' Si persiste, escríbenos a aespinoza@oopart.cl'
              : 'No pudimos enviar el mensaje. Escríbenos directo a aespinoza@oopart.cl');
          }
          restaurar();
        });
      })
      .catch(function () {
        // La peticion no salió (sin conexion, o un bloqueador de contenido
        // corto formspree.io). El envio nativo del navegador no pasa por
        // fetch, asi que el mensaje igual llega: no se pierde.
        showStatus('err', 'Enviando por otra vía…');
        form.submit();
      });
  });
})();
