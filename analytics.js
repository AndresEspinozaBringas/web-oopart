// Google Analytics 4.
// consent.js debe cargarse ANTES: el define dataLayer, gtag y el estado de
// consentimiento por defecto (todo denegado).
//
// gtag.js pesa 196 KB. Antes lo bajabamos siempre y dejabamos que Consent Mode
// evitara las cookies: es el patron "avanzado" de Google, valido, pero su
// beneficio real (modelado de conversiones) necesita cientos de eventos
// semanales para activarse. Con el trafico actual pagabamos el peso sin recibir
// nada, y tambien lo pagaba quien rechazaba. Ahora la libreria baja solo cuando
// hay consentimiento. Si algun dia el volumen lo justifica, basta con llamar a
// cargar() sin esperar el evento.
//
// Para desactivarlo del todo, vacia OOPART_GA_ID en el <head>.
(function () {
  var id = window.OOPART_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
  if (typeof window.gtag !== 'function') return;   // consent.js no se cargo

  var cargado = false;

  function cargar() {
    if (cargado) return;                 // aceptar dos veces no debe duplicar la libreria
    cargado = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true });
  }

  // Visitante que ya habia aceptado en una visita anterior: consent.js aplico su
  // decision antes de que existiera este archivo, asi que hay que preguntarsela.
  if (typeof window.oopartAnaliticaPermitida === 'function' && window.oopartAnaliticaPermitida()) {
    cargar();
    return;
  }

  // Visitante que acepta ahora, en el banner.
  document.addEventListener('oopart:consentimiento', function (e) {
    if (e.detail && e.detail.analitica) cargar();
  });
})();
