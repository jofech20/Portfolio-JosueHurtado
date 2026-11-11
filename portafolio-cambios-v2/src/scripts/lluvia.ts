import { gsap } from 'gsap';

// Lluvia de código estilo Matrix en un canvas. Solo caracteres ASCII para no depender de fuentes CJK.
const GLIFOS = '0101010110ABCDEF2345678=+<>{};$#%&*/';

export function lluvia(canvas: HTMLCanvasElement, opts: { color: () => string; cabeza: () => string; alfa: number; fs?: number }) {
  const ctx = canvas.getContext('2d')!;
  const fs = opts.fs ?? 14;
  let w = 0, h = 0, filas = 0;
  let cols: { y: number; v: number; l: number; c: string[] }[] = [];
  const glifo = () => GLIFOS[(Math.random() * GLIFOS.length) | 0];
  const columna = (inicio: boolean) => ({
    y: inicio ? Math.random() * filas * 1.4 - filas * 0.4 : -Math.random() * 12,
    v: 0.18 + Math.random() * 0.42,
    l: 6 + ((Math.random() * 18) | 0),
    c: Array.from({ length: filas }, glifo),
  });

  function size() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    filas = Math.ceil(h / fs) + 1;
    cols = Array.from({ length: Math.ceil(w / fs) }, () => columna(true));
  }

  function dibujar(avanzar = true) {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${fs}px "IBM Plex Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    const color = opts.color(), cabeza = opts.cabeza();
    cols.forEach((c, i) => {
      const x = i * fs + fs / 2, top = Math.floor(c.y);
      for (let k = 0; k < c.l; k++) {
        const f = top - k;
        if (f < 0 || f >= filas) continue;
        if (Math.random() < 0.03) c.c[f] = glifo();
        ctx.globalAlpha = (k === 0 ? 1 : 1 - k / c.l) * opts.alfa;
        ctx.fillStyle = k === 0 ? cabeza : color;
        ctx.fillText(c.c[f], x, f * fs + fs);
      }
      if (avanzar) {
        c.y += c.v;
        if (top - c.l > filas) cols[i] = columna(false);
      }
    });
    ctx.globalAlpha = 1;
  }

  let activo = false, n = 0;
  const tick = () => { if (++n % 2 === 0) dibujar(); };
  return {
    canvas,
    size,
    estatico() { size(); dibujar(false); },
    start() { if (!activo) { activo = true; gsap.ticker.add(tick); } },
    stop() { activo = false; gsap.ticker.remove(tick); },
  };
}
