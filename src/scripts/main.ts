import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { montarDiagramas } from './diagramas';
import { lluvia } from './lluvia';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrambleTextPlugin);

const $ = <T extends Element>(s: string) => document.querySelector<T>(s)!;
const $$ = <T extends Element>(s: string) => gsap.utils.toArray<T>(s);
const reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Barra de fórmulas */
const refEl = $<HTMLElement>('#barra-ref');
const formulaEl = $<HTMLElement>('#barra-formula');
let filtroFormula = '';

function setFormula(ref: string, texto: string) {
  if (formulaEl.dataset.t === texto && refEl.textContent === ref) return;
  formulaEl.dataset.t = texto;
  refEl.textContent = ref;
  if (reducido()) { formulaEl.textContent = texto; return; }
  gsap.to(formulaEl, { duration: 0.5, overwrite: true, scrambleText: { text: texto, chars: '=;()01ABCDEF', speed: 1.4 } });
}
function zonaActiva(el: HTMLElement) {
  if (el.id === 'indice' && filtroFormula) setFormula('D4', filtroFormula);
  else setFormula(el.dataset.ref!, el.dataset.formula!);
}

/* Pestañas con indicador */
const ind = $<HTMLElement>('.pestanas__ind');
function marcarPestana(id: string) {
  $$<HTMLAnchorElement>('.pestanas a').forEach((a) => {
    if (a.dataset.tab !== id) { a.removeAttribute('aria-current'); return; }
    a.setAttribute('aria-current', 'true');
    gsap.to(ind, { x: a.offsetLeft, width: a.offsetWidth, duration: reducido() ? 0 : 0.45, ease: 'power3.out', overwrite: true });
    const nav = a.parentElement!;
    nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'auto' });
  });
}
const primera = $<HTMLAnchorElement>('.pestanas a');
gsap.set(ind, { x: primera.offsetLeft, width: primera.offsetWidth });

/* Hoja: resaltar fila y columna al pasar el cursor */
const celdas = $<HTMLElement>('#celdas');
celdas.addEventListener('pointerover', (e) => {
  const c = (e.target as Element).closest<HTMLElement>('.celda');
  $$<HTMLElement>('.col.on, .fil.on').forEach((x) => x.classList.remove('on'));
  if (!c) return;
  document.querySelector(`.col[data-c="${c.dataset.c}"]`)?.classList.add('on');
  document.querySelector(`.fil[data-r="${c.dataset.r}"]`)?.classList.add('on');
  setFormula(`${c.dataset.c}${c.dataset.r}`, `="${c.textContent!.trim()}"`);
});
celdas.addEventListener('pointerleave', () => {
  $$<HTMLElement>('.col.on, .fil.on').forEach((x) => x.classList.remove('on'));
  zonaActiva($<HTMLElement>('#inicio'));
});

/* Lluvia de código */
const heroLluvia = lluvia($<HTMLCanvasElement>('#lluvia-hero'), { color: () => '#2fd08a', cabeza: () => '#e6fff2', alfa: 0.6, fs: 14 });
const contLluvia = lluvia($<HTMLCanvasElement>('#lluvia-contacto'), {
  color: () => getComputedStyle($('.contacto')).color, cabeza: () => getComputedStyle($('.contacto')).color, alfa: 0.55, fs: 15,
});
[heroLluvia, contLluvia].forEach((l) => {
  l.size();
  if (reducido()) { l.estatico(); return; }
  ScrollTrigger.create({ trigger: l.canvas, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? l.start() : l.stop()) });
});
let espera = 0;
window.addEventListener('resize', () => {
  clearTimeout(espera);
  espera = window.setTimeout(() => { [heroLluvia, contLluvia].forEach((l) => (reducido() ? l.estatico() : l.size())); }, 200);
});

/* Escena del método: fila a documento */
function escena(conFichas: boolean, st: ScrollTrigger.Vars) {
  const pares: [string, string][] = [['#c-dni', '#d-dni'], ['#c-nom', '#d-nom'], ['#c-car', '#d-car'], ['#c-mon', '#d-mon']];
  const capa = $<HTMLElement>('#fichas');
  const pasos = $$<HTMLElement>('#pasos li');
  const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: 'none' } });

  gsap.set('.sucio', { visibility: 'visible', autoAlpha: 1 });
  gsap.set('.limpio', { autoAlpha: 0 });
  gsap.set('.campo i', { visibility: 'visible', autoAlpha: 1 });
  gsap.set('.campo b', { autoAlpha: 0 });
  gsap.set('#sello', { autoAlpha: 0, scale: 1.25, transformOrigin: 'left bottom' });
  gsap.set(pasos, { opacity: 0.32 });

  tl.to(pasos[0], { opacity: 1, duration: 0.5 });
  tl.to(pasos[1], { opacity: 1, duration: 0.5 }, '+=0.3');
  tl.to('.sucio', { autoAlpha: 0, duration: 0.5, stagger: 0.25 }, '<');
  tl.to('.limpio', { autoAlpha: 1, duration: 0.5, stagger: 0.25 }, '<');
  tl.to(pasos[2], { opacity: 1, duration: 0.5 }, '+=0.3');

  pares.forEach(([origen, destino], i) => {
    const pos = i ? '<0.45' : '<';
    const b = $<HTMLElement>(destino);
    if (conFichas) {
      const a = $<HTMLElement>(origen);
      const f = document.createElement('span');
      f.className = 'ficha';
      f.textContent = b.querySelector('b')!.textContent;
      capa.append(f);
      const caja = (el: HTMLElement) => {
        const r = el.getBoundingClientRect(), c = capa.getBoundingClientRect();
        return { x: r.left - c.left, y: r.top - c.top };
      };
      gsap.set(f, { autoAlpha: 0 });
      tl.set(f, { autoAlpha: 1 }, pos);
      tl.fromTo(f, { x: () => caja(a).x, y: () => caja(a).y },
        { x: () => caja(b).x, y: () => caja(b).y, duration: 1, ease: 'power2.inOut', immediateRender: false }, '<');
      tl.set(f, { autoAlpha: 0 }, '>');
      tl.to(b.querySelector('i'), { autoAlpha: 0, duration: 0.05 }, '<');
      tl.to(b.querySelector('b'), { autoAlpha: 1, duration: 0.05 }, '<');
    } else {
      tl.to(b.querySelector('i'), { autoAlpha: 0, duration: 0.4 }, pos);
      tl.to(b.querySelector('b'), { autoAlpha: 1, duration: 0.4 }, '<');
    }
  });

  tl.to(pasos[3], { opacity: 1, duration: 0.5 }, '+=0.2');
  tl.to('#sello', { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<');
  tl.to({}, { duration: 0.6 });
  return tl;
}
const limpiarEscena = () => gsap.set('.sucio,.limpio,.campo i,.campo b,#sello,#pasos li', { clearProps: 'all' });

/* Movimiento. Los ScrollTriggers se crean de arriba hacia abajo. */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const glifos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const entrada = gsap.timeline({ defaults: { ease: 'power3.out' } });
  entrada
    .from('.esquina, .col, .fil', { autoAlpha: 0, duration: 0.3, stagger: 0.025 })
    .from('.letra', { yPercent: 105, duration: 0.6, stagger: 0.035 }, 0.1);
  $$<HTMLElement>('.letra').forEach((l, i) => {
    entrada.to(l, { duration: 0.7, scrambleText: { text: l.textContent!, chars: glifos, speed: 0.9 } }, 0.1 + i * 0.035);
  });
  entrada
    .from('.seleccion', { scaleX: 0.12, transformOrigin: 'left center', duration: 0.6, ease: 'power2.inOut' }, 0.4)
    .fromTo('#retrato img', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 0.35)
    .fromTo('.retrato__scan', { top: '100%', opacity: 1 }, { top: '0%', duration: 1.2, ease: 'power2.inOut' }, 0.35)
    .to('.retrato__scan', { opacity: 0, duration: 0.3 }, 1.5)
    .from('.asa', { scale: 0, duration: 0.25, stagger: 0.03, ease: 'back.out(3)' }, 1.3)
    .from('.retrato__tag, .retrato__linea', { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.1 }, 1.4)
    .from('.hero__pie > *', { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.55);
  $$<HTMLElement>('[data-contar]').forEach((el) => {
    const n = { v: 0 };
    entrada.to(n, { v: Number(el.dataset.contar), duration: 0.9, ease: 'power2.out', snap: { v: 1 }, onUpdate: () => { el.textContent = String(n.v); } }, 0.7);
  });

  const frases = ['automatizando procesos', 'validando 369 filas', 'generando PDF por lote', 'cruzando datos por DNI', 'publicando invitaplus.pages.dev'];
  const tipeo = gsap.timeline({ repeat: -1, delay: 2 });
  frases.slice(1).concat(frases[0]).forEach((f) => {
    tipeo.to({}, { duration: 2.4 }).to('#tipeo', { duration: 0.9, scrambleText: { text: f, chars: '01', speed: 0.7 } });
  });
});

mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px) and (min-height: 660px)', () => {
  const tl = escena(true, { trigger: '#metodo-fijo', pin: true, start: () => `top ${$<HTMLElement>('.barra').offsetHeight}px`, end: '+=1500', scrub: 0.6, invalidateOnRefresh: true });
  return () => { tl.kill(); $<HTMLElement>('#fichas').replaceChildren(); limpiarEscena(); };
});
mm.add('(prefers-reduced-motion: no-preference) and ((max-width: 900px) or (max-height: 659px))', () => {
  const tl = escena(false, { trigger: '#escena', start: 'top 72%', end: 'bottom 62%', scrub: 0.5 });
  return () => { tl.kill(); limpiarEscena(); };
});

/* Secciones activas */
$$<HTMLElement>('main > section').forEach((sec) => {
  ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: (s) => { if (s.isActive) { marcarPestana(sec.id); zonaActiva(sec); } } });
});
$$<HTMLElement>('.caso').forEach((c) => {
  ScrollTrigger.create({ trigger: c, start: 'top 45%', end: 'bottom 45%', onToggle: (s) => { if (s.isActive) zonaActiva(c); } });
});

/* Diagramas de cada caso */
montarDiagramas(reducido());

/* Entradas por scroll */
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Títulos que se decodifican desde binario, palabra por palabra
  $$<HTMLElement>('main h2').forEach((h) => {
    ScrollTrigger.create({
      trigger: h, start: 'top 88%', once: true,
      onEnter: () => {
        const palabras = h.textContent!.trim().split(/\s+/);
        h.textContent = '';
        palabras.forEach((w, i) => {
          if (i) h.append(' ');
          const s = document.createElement('span');
          s.textContent = w;
          h.append(s);
          gsap.to(s, { duration: 0.8, delay: i * 0.06, scrambleText: { text: w, chars: '01', speed: 0.8 } });
        });
      },
    });
  });

  $$<HTMLElement>('.caso').forEach((c) => {
    const st = { trigger: c, start: 'top 78%', once: true };
    gsap.from(c.querySelectorAll('.registro > div'), { x: 28, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: st });
    gsap.from(c.querySelectorAll('.caso__cab > *'), { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', scrollTrigger: st });
  });

  gsap.from('.lista__cab, .fila', { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.025, ease: 'power2.out', scrollTrigger: { trigger: '#lista', start: 'top 85%', once: true } });
  gsap.from('.barras__b i', { scaleX: 0, duration: 0.9, stagger: 0.04, ease: 'power3.out', scrollTrigger: { trigger: '.barras', start: 'top 80%', once: true } });
  gsap.from('.exp li, .form li', { x: -22, autoAlpha: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '.tray', start: 'top 80%', once: true } });
  gsap.from('.contacto__in > :not(h2)', { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.contacto', start: 'top 75%', once: true } });
});

/* Navegación */
function irA(hash: string) {
  const destino = document.querySelector<HTMLElement>(hash);
  if (!destino) return;
  gsap.to(window, { duration: reducido() ? 0 : 0.9, ease: 'power3.inOut', scrollTo: { y: destino, offsetY: $<HTMLElement>('.barra').offsetHeight, autoKill: true } });
}
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  irA(a.getAttribute('href')!);
});

/* Índice */
const filas = $$<HTMLDetailsElement>('.fila');
const chips = $$<HTMLButtonElement>('.chip');
const buscar = $<HTMLInputElement>('#f-buscar');
const estado = $<HTMLSelectElement>('#f-estado');
const conteo = $<HTMLElement>('#conteo');
const vacio = $<HTMLElement>('#vacio');
let area = '';

function filtrar() {
  const q = buscar.value.trim().toLowerCase();
  let n = 0;
  filas.forEach((f) => {
    const ok = (!area || f.dataset.area === area) && (!estado.value || f.dataset.estado === estado.value) && (!q || f.dataset.buscar!.includes(q));
    f.hidden = !ok;
    if (ok) n += 1;
  });
  conteo.textContent = String(n);
  vacio.hidden = n > 0;
  const partes: string[] = [];
  if (area) partes.push(`área="${area}"`);
  if (estado.value) partes.push(`estado="${estado.value}"`);
  if (q) partes.push(`buscar="${buscar.value.trim()}"`);
  filtroFormula = partes.length ? `=FILTRAR(proyectos; ${partes.join('; ')}) → ${n}` : '';
  zonaActiva($<HTMLElement>('#indice'));
  if (!reducido()) gsap.fromTo(filas.filter((f) => !f.hidden).slice(0, 12), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.025, overwrite: true });
  ScrollTrigger.refresh();
}
function elegirArea(valor: string) {
  area = valor;
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.area === valor)));
}
chips.forEach((c) => c.addEventListener('click', () => { elegirArea(c.dataset.area!); filtrar(); }));
buscar.addEventListener('input', filtrar);
estado.addEventListener('change', filtrar);
$('#limpiar').addEventListener('click', () => { elegirArea(''); buscar.value = ''; estado.value = ''; filtrar(); });
filas.forEach((f) => f.addEventListener('toggle', () => {
  if (f.open && !reducido()) gsap.from(f.querySelectorAll('.pipe li, .fila__txt > *'), { y: 10, autoAlpha: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' });
  ScrollTrigger.refresh();
}));

$$<HTMLButtonElement>('[data-tec]').forEach((b) => b.addEventListener('click', () => {
  elegirArea(''); estado.value = ''; buscar.value = b.dataset.tec!; filtrar(); irA('#indice');
}));

/* Copiar correo */
const copiar = $<HTMLButtonElement>('#copiar');
copiar.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(copiar.dataset.correo!); copiar.textContent = 'Copiado'; }
  catch {
    const r = document.createRange(); r.selectNodeContents($('#correo'));
    getSelection()?.removeAllRanges(); getSelection()?.addRange(r);
    copiar.textContent = 'Correo seleccionado';
  }
  setTimeout(() => { copiar.textContent = 'Copiar correo'; }, 1800);
});

$<HTMLImageElement>('#retrato img').addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => { ScrollTrigger.refresh(); marcarPestana(document.querySelector<HTMLAnchorElement>('.pestanas a[aria-current]')?.dataset.tab ?? 'inicio'); });
