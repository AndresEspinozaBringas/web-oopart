// Google Analytics 4.
// consent.js debe cargarse ANTES: el define dataLayer, gtag y el estado de
// consentimiento por defecto (todo denegado). Aqui solo se carga la libreria
// y se configura la propiedad; sin consentimiento GA4 no escribe cookies.
// Para desactivarlo del todo, vacia OOPART_GA_ID en el <head>.
(function () {
  var id = window.OOPART_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
  if (typeof window.gtag !== 'function') return;   // consent.js no se cargo

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
})();
