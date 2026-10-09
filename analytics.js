// Google Analytics 4.
// Para activarlo: pon tu identificador de medicion en OOPART_GA_ID, en el
// <head> de cada pagina. Mientras este vacio no se carga nada, no se deja
// ninguna cookie y no se envia ningun dato.
(function () {
  var id = window.OOPART_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { anonymize_ip: true });
})();
