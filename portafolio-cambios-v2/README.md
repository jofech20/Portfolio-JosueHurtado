# Portafolio de Josué Hurtado

Sitio estático con Astro y GSAP. No necesita servidor ni base de datos.

## Editar

- `src/data/sitio.ts`: correo, LinkedIn, GitHub, experiencia y formación. Los enlaces vacíos no se muestran.
- `src/data/proyectos.ts`: proyectos, casos y el flujo de cada uno. Las cifras del hero, el índice y el stack se calculan desde aquí.
- `public/josue.webp`: tu foto del hero (fondo transparente).
- `src/components/Diagrama.astro` y `src/scripts/diagramas.ts`: diagramas animados de los casos.
- `astro.config.mjs`: `site` debe ser tu dominio final.
- `wrangler.jsonc`: `name` es el nombre del proyecto en Cloudflare.

## Probar en tu PC

```bash
npm install
npm run dev
```

## Publicar en Cloudflare

1. Sube esta carpeta a un repositorio de GitHub.
2. Ejecuta `npx wrangler login` una vez.
3. Ejecuta `npm run deploy`.
4. En Cloudflare, abre el proyecto y añade tu dominio en Domains & Routes.
5. Reemplaza `public/og.png` si cambias el hero. Es la imagen que muestra LinkedIn al compartir el enlace.

## Antes de cada publicación

Revisa `src/data/proyectos.ts` y confirma que no aparezcan empresas, clientes, personas, archivos internos ni cifras privadas.
