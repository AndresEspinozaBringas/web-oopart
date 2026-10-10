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

import { correoInterno, correoVisitante } from './plantillas.js';

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

    // Diagnostico temporal: permite saber que version esta desplegada y si el
    // secreto llega al runtime, sin revelar su valor. Quitar cuando el
    // formulario quede estable.
    if (url.pathname === '/api/estado') {
      const k = env.RESEND_API_KEY;
      return new Response(JSON.stringify({
        marca: 'diag-1',
        tieneKey: Boolean(k),
        largoKey: k ? String(k).length : 0,
        tieneMailTo: Boolean(env.MAIL_TO),
        tieneMailFrom: Boolean(env.MAIL_FROM),
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/contacto') {
      if (request.method === 'OPTIONS') return preflight(request);
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'METODO_NO_PERMITIDO' }, 405, request);
      }
      return contacto(request, env, ctx);
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

async function contacto(request, env, ctx) {
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

  const interno = correoInterno({
    nombre, email, empresa, desafio: etiquetaDesafio, mensaje, pais, ip,
  });

  async function enviar(cuerpo) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  }

  // 1. El aviso a Oopart es lo critico: si falla, el contacto se perdio.
  try {
    await enviar({
      from: env.MAIL_FROM,
      to: [env.MAIL_TO],
      reply_to: email,             // responder va directo al visitante
      subject: `Contacto web: ${nombre}${empresa ? ` · ${empresa}` : ''}`,
      html: interno.html,
      text: interno.texto,
    });
  } catch (e) {
    console.error('No se pudo avisar a Oopart:', e);
    return json({ ok: false, error: 'ENVIO_FALLIDO' }, 502, request);
  }

  // 2. La respuesta automatica es un extra: si rebota (correo mal escrito o
  //    inexistente) no debe afectar al visitante, que ya fue atendido.
  const visitante = correoVisitante({ nombre, desafio: etiquetaDesafio });
  const acuse = enviar({
    from: env.MAIL_FROM,
    to: [email],
    reply_to: env.MAIL_TO,
    subject: 'Recibimos tu mensaje — Oopart',
    html: visitante.html,
    text: visitante.texto,
  }).catch((e) => console.error('No se pudo enviar el acuse al visitante:', e));

  if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(acuse);

  // Envio nativo del navegador (sin fetch): redirigir, no mostrar JSON crudo
  if ((request.headers.get('Accept') || '').includes('text/html')) {
    return Response.redirect(new URL('/gracias/', request.url).toString(), 303);
  }

  return json({ ok: true }, 200, request);
}
