import { defineConfig } from 'astro/config';

// GitHub Pages: reemplaza TU-USUARIO por tu usuario de GitHub.
// Si el repositorio se llama TU-USUARIO.github.io, deja base sin definir.
// Si se llama distinto (ej. "portafolio"), descomenta base: '/portafolio'.
export default defineConfig({
  site: 'https://TU-USUARIO.github.io',
  // base: '/portafolio',
  build: { inlineStylesheets: 'always' },
});
