# web-oopart

Sitio de [oopart.cl](https://oopart.cl) — una sola página estática.

## Despliegue

Cloudflare Workers (`wrangler.jsonc`, en la rama `cloudflare/workers-autoconfig-2`)
sirve el repositorio como archivos estáticos. Un push a `master` publica.

`.assetsignore` excluye los fuentes de build y los originales de marca.

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | La página completa |
| `styles.css` | **Generado.** No editar a mano |
| `src/input.css` | Fuente de estilos: tokens de color y componentes |
| `tailwind.config.js` | Config de Tailwind |
| `assets/` | Logos, favicons e imagen Open Graph (publicados) |
| `brand/` | Originales del logo en JPEG (no se publican) |

## Editar estilos

`styles.css` está compilado. Si cambias `src/input.css` **o agregas clases de
Tailwind nuevas en `index.html`**, hay que regenerarlo:

```bash
npm install
npm run build
```

Durante el desarrollo, `npm run watch` recompila al guardar.

Commitea siempre el `styles.css` resultante: Cloudflare no ejecuta build.

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
