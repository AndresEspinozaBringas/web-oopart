/**
 * Worker de oopart.cl
 *
 * Sirve el sitio estatico y expone un unico endpoint propio: POST /api/contacto,
 * que valida el formulario y envia el correo por Resend.
 *
 * Reemplaza a Formspree, que clasificaba como spam los envios legitimos y no
 * entregaba los correos.
 *
 * Variables (en wrangler.jsonc):   MAIL_TO, MAIL_FROM
 * Secreto (en el panel de Cloudflare): RESEND_API_KEY
 */

const ORIGENES = ['https://oopart.cl', 'https://www.oopart.cl'];
const LIMITE_CUERPO = 50 * 1024;       // 50 KB: un formulario de texto nunca pesa mas
const LIMITE_CAMPO = 5000;

const DESAFIOS = {
  ia: 'Implementar IA en su empresa',
  integracion: 'Integrar sistemas',
  automatizacion: 'Automatizar procesos',
  assessment: 'Assessment tecnológico',
  otro: 'Otro',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contacto') {
      if (request.method === 'OPTIONS') return preflight(request);
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'METODO_NO_PERMITIDO' }, 405, request);
      }
      return contacto(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

function origenPermitido(request) {
  const o = request.headers.get('Origin');
  return !o || ORIGENES.includes(o);
}

function cors(request) {
  const o = request.headers.get('Origin');
  const cabeceras = { 'Content-Type': 'application/json; charset=utf-8' };
  if (o && ORIGENES.includes(o)) {
    cabeceras['Access-Control-Allow-Origin'] = o;
    cabeceras['Vary'] = 'Origin';
  }
  return cabeceras;
}

function json(cuerpo, estado, request) {
  return new Response(JSON.stringify(cuerpo), { status: estado, headers: cors(request) });
}

function preflight(request) {
  return new Response(null, {
    status: 204,
    headers: {
      ...cors(request),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
    },
  });
}

function limpiar(v, max = LIMITE_CAMPO) {
  return String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function escapar(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function contacto(request, env) {
  if (!origenPermitido(request)) {
    return json({ ok: false, error: 'ORIGEN_NO_PERMITIDO' }, 403, request);
  }

  const largo = Number(request.headers.get('Content-Length') || 0);
  if (largo > LIMITE_CUERPO) {
    return json({ ok: false, error: 'CUERPO_DEMASIADO_GRANDE' }, 413, request);
  }

  let datos;
  try {
    const tipo = request.headers.get('Content-Type') || '';
    if (tipo.includes('application/json')) {
      datos = await request.json();
    } else {
      datos = Object.fromEntries(await request.formData());
    }
  } catch {
    return json({ ok: false, error: 'CUERPO_INVALIDO' }, 400, request);
  }

  // Honeypot: invisible para personas, los bots lo rellenan.
  // Se responde ok para no darle al bot informacion de que fue detectado.
  if (limpiar(datos._gotcha)) {
    return json({ ok: true }, 200, request);
  }

  const nombre = limpiar(datos.nombre, 200);
  const email = limpiar(datos.email, 320);
  const empresa = limpiar(datos.empresa, 200);
  const desafio = limpiar(datos.desafio, 50);
  const mensaje = limpiar(datos.mensaje, LIMITE_CAMPO);

  const faltan = [];
  if (!nombre) faltan.push('nombre');
  if (!email) faltan.push('email');
  if (!mensaje) faltan.push('mensaje');
  if (faltan.length) {
    return json({ ok: false, error: 'CAMPOS_REQUERIDOS', campos: faltan }, 422, request);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: 'EMAIL_INVALIDO' }, 422, request);
  }

  if (!env.RESEND_API_KEY) {
    console.error('Falta el secreto RESEND_API_KEY');
    return json({ ok: false, error: 'SERVICIO_NO_CONFIGURADO' }, 503, request);
  }

  const etiquetaDesafio = DESAFIOS[desafio] || desafio || 'Sin especificar';
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const pais = request.cf?.country || '';

  const cuerpoHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:620px;line-height:1.6;color:#0D1526">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5A6880">
        Nuevo contacto desde oopart.cl
      </p>
      <h2 style="margin:0 0 20px;font-size:20px">${escapar(nombre)}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:6px 12px 6px 0;color:#5A6880;width:110px">Email</td>
            <td style="padding:6px 0"><a href="mailto:${escapar(email)}">${escapar(email)}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5A6880">Empresa</td>
            <td style="padding:6px 0">${escapar(empresa) || '—'}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#5A6880">Desafío</td>
            <td style="padding:6px 0">${escapar(etiquetaDesafio)}</td></tr>
      </table>
      <div style="margin:20px 0;padding:16px;background:#F4F7FB;border-left:3px solid #30428A;border-radius:4px">
        <p style="margin:0;white-space:pre-wrap">${escapar(mensaje)}</p>
      </div>
      <p style="margin:0;font-size:12px;color:#8A96AB">
        Responde a este correo para contestarle directamente.${pais ? ` · Origen: ${escapar(pais)}` : ''}${ip ? ` · IP: ${escapar(ip)}` : ''}
      </p>
    </div>`;

  const cuerpoTexto =
    `Nuevo contacto desde oopart.cl\n\n` +
    `Nombre:  ${nombre}\nEmail:   ${email}\nEmpresa: ${empresa || '—'}\nDesafío: ${etiquetaDesafio}\n\n` +
    `${mensaje}\n`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [env.MAIL_TO],
        reply_to: email,             // responder va directo al visitante
        subject: `Contacto web: ${nombre}${empresa ? ` · ${empresa}` : ''}`,
        html: cuerpoHtml,
        text: cuerpoTexto,
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      console.error('Resend rechazo el envio:', res.status, detalle);
      return json({ ok: false, error: 'ENVIO_FALLIDO' }, 502, request);
    }
  } catch (e) {
    console.error('Error llamando a Resend:', e);
    return json({ ok: false, error: 'ENVIO_FALLIDO' }, 502, request);
  }

  // Envio nativo del navegador (sin fetch): redirigir, no mostrar JSON crudo
  if ((request.headers.get('Accept') || '').includes('text/html')) {
    return Response.redirect(new URL('/gracias/', request.url).toString(), 303);
  }

  return json({ ok: true }, 200, request);
}
