/**
 * Plantillas de correo.
 *
 * Reglas de HTML para email, que no es HTML de navegador:
 *  - maquetacion con <table>, no flex ni grid: Outlook no los soporta
 *  - estilos inline: Gmail descarta buena parte de <style>
 *  - ancho maximo 600px, el estandar que no se corta en clientes de escritorio
 *  - el logo lleva alt util: muchos clientes bloquean imagenes por defecto
 */

const AZUL = '#30428A';
const TEXTO = '#0D1526';
const SUAVE = '#5A6880';
const BORDE = '#D2DCEB';
const FONDO = '#F4F7FB';
const LOGO = 'https://oopart.cl/assets/logo-lockup-blue.png';

/**
 * Marca los enlaces con parametros UTM.
 * Sin esto GA4 cuenta esas visitas como "directas" y no hay forma de saber
 * que vinieron del correo de acuse.
 */
function conUtm(url, contenido) {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'correo');
  u.searchParams.set('utm_medium', 'acuse_recibo');
  u.searchParams.set('utm_campaign', 'contacto_web');
  if (contenido) u.searchParams.set('utm_content', contenido);
  return u.toString();
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function envoltorio(contenido, piePersonalizado) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Oopart</title></head>
<body style="margin:0;padding:0;background:${FONDO};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FONDO};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${BORDE};border-radius:10px;overflow:hidden;">
      <tr><td style="padding:28px 32px 0;">
        <img src="${LOGO}" width="150" alt="Oopart — Tecnología + Desarrollo"
             style="display:block;width:150px;height:auto;border:0;">
      </td></tr>
      ${contenido}
      <tr><td style="padding:24px 32px 28px;border-top:1px solid ${BORDE};">
        ${piePersonalizado}
      </td></tr>
    </table>
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
      <tr><td align="center" style="padding:18px 16px;font:12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#8A96AB;">
        Oopart · Out of Place Artefact · Consultoría tecnológica, Chile<br>
        <a href="${conUtm('https://oopart.cl/', 'pie')}" style="color:${AZUL};text-decoration:none;">oopart.cl</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/** Correo que recibe Oopart cuando alguien escribe. */
export function correoInterno({ nombre, email, empresa, desafio, mensaje, pais, ip }) {
  const fila = (etiqueta, valor) => `
    <tr>
      <td style="padding:7px 14px 7px 0;font:13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};white-space:nowrap;vertical-align:top;">${etiqueta}</td>
      <td style="padding:7px 0;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${TEXTO};">${valor}</td>
    </tr>`;

  const contenido = `
      <tr><td style="padding:22px 32px 0;">
        <p style="margin:0 0 6px;font:11px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${SUAVE};">
          Nuevo contacto desde el sitio
        </p>
        <h1 style="margin:0 0 20px;font:600 22px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${TEXTO};">
          ${esc(nombre)}
        </h1>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${fila('Email', `<a href="mailto:${esc(email)}" style="color:${AZUL};">${esc(email)}</a>`)}
          ${fila('Empresa', esc(empresa) || '—')}
          ${fila('Desafío', esc(desafio))}
        </table>
      </td></tr>
      <tr><td style="padding:20px 32px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="background:${FONDO};border-left:3px solid ${AZUL};border-radius:4px;">
          <tr><td style="padding:16px 18px;font:14px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${TEXTO};white-space:pre-wrap;">${esc(mensaje)}</td></tr>
        </table>
      </td></tr>`;

  const pie = `
        <p style="margin:0;font:12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};">
          <strong style="color:${TEXTO};">Responde este correo</strong> y le llega directo a ${esc(nombre.split(' ')[0])}.
          ${pais || ip ? `<br><span style="color:#8A96AB;">${pais ? `Origen: ${esc(pais)}` : ''}${pais && ip ? ' · ' : ''}${ip ? `IP: ${esc(ip)}` : ''}</span>` : ''}
        </p>`;

  const texto =
    `NUEVO CONTACTO DESDE OOPART.CL\n\n` +
    `Nombre:  ${nombre}\nEmail:   ${email}\nEmpresa: ${empresa || '—'}\nDesafío: ${desafio}\n\n` +
    `${mensaje}\n\n---\nResponde este correo y le llega directo.\n`;

  return { html: envoltorio(contenido, pie), texto };
}

/** Respuesta automática para quien escribió. */
export function correoVisitante({ nombre, desafio }) {
  const pila = [
    ['Inteligencia Artificial', 'Soluciones que aprenden de tu negocio y automatizan lo que hoy consume tiempo.', conUtm('https://oopart.cl/#servicios', 'ia')],
    ['Gemelos digitales', 'Tu planta o centro de distribución en 3D, con datos reales. Hay una demo abierta.', conUtm('https://oopart.cl/gemelos-digitales/', 'gemelos')],
    ['Integración de sistemas', 'Conectamos tu ecosistema para que opere sin fricciones, con seguridad y a escala.', conUtm('https://oopart.cl/#servicios', 'integracion')],
  ];

  const tarjetas = pila.map(([titulo, bajada, url]) => `
          <tr><td style="padding:0 0 14px;">
            <a href="${url}" style="text-decoration:none;color:inherit;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BORDE};border-radius:8px;">
                <tr><td style="padding:14px 16px;">
                  <p style="margin:0 0 4px;font:600 15px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${TEXTO};">${titulo}</p>
                  <p style="margin:0;font:13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};">${bajada}</p>
                </td></tr>
              </table>
            </a>
          </td></tr>`).join('');

  const contenido = `
      <tr><td style="padding:22px 32px 0;">
        <h1 style="margin:0 0 14px;font:600 22px/1.35 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${TEXTO};">
          Gracias por escribirnos, ${esc(nombre.split(' ')[0])}
        </h1>
        <p style="margin:0 0 14px;font:15px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};">
          Recibimos tu mensaje sobre <strong style="color:${TEXTO};">${esc(desafio.toLowerCase())}</strong> y lo estamos revisando.
          Te respondemos <strong style="color:${TEXTO};">en menos de 24 horas hábiles</strong>, con una persona del equipo, no con una plantilla.
        </p>
        <p style="margin:0 0 22px;font:15px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};">
          Mientras tanto, por si sirve de contexto, esto es lo que hacemos:
        </p>
      </td></tr>
      <tr><td style="padding:0 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${tarjetas}</table>
      </td></tr>
      <tr><td style="padding:10px 32px 24px;">
        <p style="margin:0 0 6px;font:13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};">
          Si prefieres ver resultados antes que promesas:
        </p>
        <p style="margin:0;font:14px/1.9 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
          <a href="${conUtm('https://oopart.cl/casos/humphreys/', 'caso_humphreys')}" style="color:${AZUL};">Un proceso de 30 días que bajó a 5</a><br>
          <a href="${conUtm('https://oopart.cl/casos/isapre-fundacion/', 'caso_isapre')}" style="color:${AZUL};">Una venta que se cerraba en 3 días y ahora toma 30 minutos</a>
        </p>
      </td></tr>`;

  const pie = `
        <p style="margin:0;font:13px/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:${SUAVE};">
          Puedes responder este correo directamente: llega a nuestro equipo.<br>
          <a href="mailto:aespinoza@oopart.cl" style="color:${AZUL};">aespinoza@oopart.cl</a>
        </p>`;

  const texto =
    `Gracias por escribirnos, ${nombre.split(' ')[0]}\n\n` +
    `Recibimos tu mensaje sobre ${desafio.toLowerCase()} y lo estamos revisando.\n` +
    `Te respondemos en menos de 24 horas hábiles.\n\n` +
    `Lo que hacemos:\n` +
    pila.map(([t, b, u]) => `- ${t}: ${b}\n  ${u}`).join('\n') + `\n\n` +
    `Casos:\n- https://oopart.cl/casos/humphreys/\n- https://oopart.cl/casos/isapre-fundacion/\n\n` +
    `Puedes responder este correo: llega a nuestro equipo.\naespinoza@oopart.cl\n`;

  return { html: envoltorio(contenido, pie), texto };
}
