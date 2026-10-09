# web-oopart

Sitio de [oopart.cl](https://oopart.cl) — una sola página estática.

## Despliegue

Cloudflare Workers (`wrangler.jsonc`, en la rama `cloudflare/workers-autoconfig-2`)
sirve el repositorio como archivos estáticos. Un push a `master` publica.

`.assetsignore` excluye los fuentes de build y los originales de marca.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Portada |
| `gemelos-digitales/index.html` | Página del servicio de gemelos digitales |
| `app.js` | JS compartido por todas las páginas |
| `analytics.js` | Carga GA4 **solo** si hay un ID configurado |
| `styles.css` | **Generado.** No editar a mano |
| `src/input.css` | Fuente de estilos: tokens de color y componentes |
| `tailwind.config.js` | Config de Tailwind (lista las páginas a escanear) |
| `robots.txt`, `sitemap.xml` | SEO. Al crear una página, agrégala al sitemap |
| `assets/` | Logos, favicons e imágenes Open Graph (publicados) |
| `brand/` | Originales del logo en JPEG (no se publican) |

## Google Analytics

Está preparado pero **apagado**. Para activarlo, pon el identificador de
medición en el `<head>` de cada página:

```html
<script>window.OOPART_GA_ID = 'G-XXXXXXXXXX';</script>
```

Mientras esté vacío no se carga nada, no se deja ninguna cookie y no se
envía ningún dato.

## Agregar una página

1. Crea `mi-pagina/index.html` (copia la estructura de `gemelos-digitales/`)
2. Agrégala a `content` en `tailwind.config.js`, o sus clases no se compilan
3. Agrégala a `sitemap.xml`
4. `npm run build` y commitea el resultado

## Editar estilos

`styles.css` está compilado. Si cambias `src/input.css` **o agregas clases de
Tailwind nuevas en `index.html`**, hay que regenerarlo:

```bash
npm install
npm run build
```

Durante el desarrollo, `npm run watch` recompila al guardar.

Commitea siempre el `styles.css` resultante **y el `index.html`**: Cloudflare
no ejecuta build.

`npm run build` tambien escribe el hash del CSS en su `<link>`
(`styles.css?v=51d14d7a`). Sin eso, quien ya visito el sitio sigue viendo
el CSS viejo desde su cache y no recibe los cambios. Por eso el build toca
los dos archivos.

## Logos

Los PNG de `assets/` se derivaron de `brand/logo3.jpeg` (tinta blanca sobre
negro), usando su luminancia como canal alfa — por eso no tienen halos de
compresión. El código de manual de marca `OOPVR7` fue recortado.

- `logo-lockup-*` — ícono + wordmark, para la barra de navegación
- `logo-full-*` — logo completo con tagline, para el pie
- `logo-mark-*` — solo el ícono
- Variantes `-white` (tema oscuro) y `-blue` (tema claro)

Si en algún momento consigues el **SVG vectorial original**, conviene
reemplazarlos: sería más nítido y mucho más liviano.

## Formulario

El formulario de contacto va a [Formspree](https://formspree.io) (`mwvadpor`).
Incluye un honeypot (`_gotcha`) contra spam.
