import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const $ = <T extends Element>(s: string) => document.querySelector<T>(s)!;
const $$ = <T extends Element>(s: string) => gsap.utils.toArray<T>(s);
const reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Barra de fórmulas */
const refEl = $<HTMLElement>('#barra-ref');
const formulaEl = $<HTMLElement>('#barra-formula');
let filtroFormula = '';

function setFormula(ref: string, texto: string) {
  if (formulaEl.textContent === texto && refEl.textContent === ref) return;
  refEl.textContent = ref;
  formulaEl.textContent = texto;
  if (!reducido()) gsap.fromTo(formulaEl, { opacity: 0.2 }, { opacity: 1, duration: 0.25, overwrite: true });
}

function zonaActiva(el: HTMLElement) {
  if (el.id === 'indice' && filtroFormula) setFormula('D4', filtroFormula);
  else setFormula(el.dataset.ref!, el.dataset.formula!);
}

function marcarPestana(id: string) {
  $$<HTMLAnchorElement>('.pestanas a').forEach((a) => {
    if (a.dataset.tab === id) {
      a.setAttribute('aria-current', 'true');
      const nav = a.parentElement!;
      nav.scrollTo({ left: a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, behavior: 'auto' });
    } else a.removeAttribute('aria-current');
  });
}

/* Escena: fila a documento */
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
    if (conFichas) {
      const a = $<HTMLElement>(origen);
      const b = $<HTMLElement>(destino);
      const f = document.createElement('span');
      f.className = 'ficha';
      f.textContent = b.querySelector('b')!.textContent;
      capa.append(f);
      const caja = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        const c = capa.getBoundingClientRect();
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
      tl.to(b0(destino, 'i'), { autoAlpha: 0, duration: 0.4 }, pos);
      tl.to(b0(destino, 'b'), { autoAlpha: 1, duration: 0.4 }, '<');
    }
  });

  tl.to(pasos[3], { opacity: 1, duration: 0.5 }, '+=0.2');
  tl.to('#sello', { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<');
  tl.to({}, { duration: 0.6 });
  return tl;
}
const b0 = (id: string, tag: string) => document.querySelector(`${id} ${tag}`);

/* Movimiento */
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  const entrada = gsap.timeline({ defaults: { ease: 'power3.out' } });
  entrada
    .from('.letra', { yPercent: 105, duration: 0.7, stagger: 0.035 })
    .from('.seleccion', { scaleX: 0.2, transformOrigin: 'left center', duration: 0.6, ease: 'power2.inOut' }, 0.3);
  $$<HTMLElement>('[data-contar]').forEach((el) => {
    const n = { v: 0 };
    entrada.to(n, { v: Number(el.dataset.contar), duration: 0.8, ease: 'power2.out', snap: { v: 1 },
      onUpdate: () => { el.textContent = String(n.v); } }, 0.5);
  });
});
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 901px) and (min-height: 660px)', () => {
  const tl = escena(true, { trigger: '#metodo-fijo', pin: true, start: () => `top ${$<HTMLElement>('.barra').offsetHeight}px`, end: '+=1500', scrub: 0.6, invalidateOnRefresh: true });
  return () => { tl.kill(); $<HTMLElement>('#fichas').replaceChildren(); gsap.set('.sucio,.limpio,.campo i,.campo b,#sello,#pasos li', { clearProps: 'all' }); };
});
mm.add('(prefers-reduced-motion: no-preference) and ((max-width: 900px) or (max-height: 659px))', () => {
  const tl = escena(false, { trigger: '#escena', start: 'top 72%', end: 'bottom 62%', scrub: 0.5 });
  return () => { tl.kill(); gsap.set('.sucio,.limpio,.campo i,.campo b,#sello,#pasos li', { clearProps: 'all' }); };
});

/* Secciones activas: se crean después del pin para usar posiciones correctas */
$$<HTMLElement>('main > section').forEach((sec) => {
  ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%',
    onToggle: (s) => { if (s.isActive) { marcarPestana(sec.id); zonaActiva(sec); } } });
});
$$<HTMLElement>('.caso').forEach((c) => {
  ScrollTrigger.create({ trigger: c, start: 'top 45%', end: 'bottom 45%',
    onToggle: (s) => { if (s.isActive) zonaActiva(c); } });
});

/* Navegación */
function irA(hash: string) {
  const destino = document.querySelector<HTMLElement>(hash);
  if (!destino) return;
  const alto = $<HTMLElement>('.barra').offsetHeight;
  gsap.to(window, { duration: reducido() ? 0 : 0.8, ease: 'power2.inOut', scrollTo: { y: destino, offsetY: alto, autoKill: true } });
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
filas.forEach((f) => f.addEventListener('toggle', () => ScrollTrigger.refresh()));

$$<HTMLButtonElement>('[data-tec]').forEach((b) => b.addEventListener('click', () => {
  elegirArea(''); estado.value = ''; buscar.value = b.dataset.tec!; filtrar(); irA('#indice');
}));

/* Copiar correo */
const copiar = $<HTMLButtonElement>('#copiar');
copiar.addEventListener('click', async () => {
  const inicial = 'Copiar correo';
  try { await navigator.clipboard.writeText(copiar.dataset.correo!); copiar.textContent = 'Copiado'; }
  catch {
    const r = document.createRange(); r.selectNodeContents($('#correo'));
    getSelection()?.removeAllRanges(); getSelection()?.addRange(r);
    copiar.textContent = 'Correo seleccionado';
  }
  setTimeout(() => { copiar.textContent = inicial; }, 1800);
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
