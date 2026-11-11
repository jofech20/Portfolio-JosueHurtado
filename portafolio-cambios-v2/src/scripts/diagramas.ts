import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Tl = gsap.core.Timeline;
const qa = (r: Element, s: string) => Array.from(r.querySelectorAll<SVGGraphicsElement>(s));
const q = (r: Element, s: string) => r.querySelector<SVGGraphicsElement>(s)!;
const nueva = () => gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3, defaults: { ease: 'power2.out' } });

function contar(tl: Tl, el: Element, hasta: number, pos: gsap.Position, dur: number, fmt: (v: number) => string) {
  const o = { v: 0 };
  tl.call(() => { o.v = 0; el.textContent = fmt(0); }, [], 0.01);
  tl.to(o, { v: hasta, duration: dur, ease: 'power1.out', onUpdate: () => { el.textContent = fmt(Math.round(o.v)); } }, pos);
}
function cerrar(tl: Tl, fuera: gsap.TweenTarget, espera = 1.8) {
  tl.addLabel('fin');
  tl.to(fuera, { opacity: 0, duration: 0.4, ease: 'power1.in' }, `fin+=${espera}`);
}

const constructores: Record<string, (r: HTMLElement) => Tl> = {
  'bases-personal'(r) {
    const tl = nueva();
    const n = [0, 1, 2].map((i) => qa(r, `.n[data-n="${i}"]`));
    const e = [1, 2].map((i) => qa(r, `.e[data-e="${i}"]`));
    const pk = q(r, '.pk'), tiles = qa(r, '.tile'), ctr = q(r, '.ctr');
    gsap.set(n.flat(), { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(e.flat(), { opacity: 0 });
    gsap.set(pk, { opacity: 0 });
    gsap.set(tiles, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });
    tl.to(n[0], { scale: 1, duration: 0.35, ease: 'back.out(2.5)' });
    tl.to(e[0], { opacity: 1, duration: 0.25 });
    tl.to(n[1], { scale: 1, duration: 0.35, stagger: 0.12, ease: 'back.out(2.5)' }, '<0.1');
    tl.to(e[1], { opacity: 1, duration: 0.25 });
    tl.to(n[2], { scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(2.5)' }, '<0.1');
    tl.fromTo(pk, { x: 0, opacity: 1 }, { x: 42, duration: 0.45, ease: 'power1.inOut', immediateRender: false });
    tl.set(pk, { opacity: 0 });
    tl.to(tiles, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06 });
    contar(tl, ctr, 15, '<', 0.3 + 14 * 0.06, (v) => (v === 15 ? '15+ bases' : `${v} bases`));
    cerrar(tl, [...n.flat(), ...e.flat(), ...tiles]);
    return tl;
  },

  'contratos-cartas'(r) {
    const tl = nueva();
    const hl = q(r, '.hl'), campos = qa(r, '.campo-a'), cards = qa(r, '.card'), sobre = q(r, '.sobre'), ctr = q(r, '.ctr');
    gsap.set(campos, { opacity: 0 });
    gsap.set(cards, { opacity: 0, x: 200, y: 70, transformOrigin: '50% 50%' });
    gsap.set(sobre, { transformOrigin: '50% 50%' });
    tl.call(() => { ctr.textContent = '0 documentos'; }, [], 0.01);
    cards.forEach((c, i) => {
      tl.to(hl, { y: i * 24, duration: 0.3 }, i ? '+=0.15' : 0.05);
      tl.to(campos, { opacity: 1, duration: 0.15, stagger: 0.06 });
      tl.to(campos, { opacity: 0, duration: 0.2 }, '+=0.1');
      tl.fromTo(c, { x: 200, y: 70, opacity: 0, scale: 0.8 },
        { x: 300 + i * 7, y: 40 + i * 12, opacity: 1, scale: 1, duration: 0.55, ease: 'power3.inOut', immediateRender: false }, '<');
      tl.call(() => { ctr.textContent = `${i + 1} ${i ? 'documentos' : 'documento'}`; });
    });
    tl.fromTo(sobre, { scale: 1 }, { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false });
    cerrar(tl, cards);
    return tl;
  },

  muestreo(r) {
    const tl = nueva();
    const picks = qa(r, '.pick'), rev = qa(r, '.rev'), barra = q(r, '.dbar'), pct = q(r, '.pct'), ctr = q(r, '.ctr');
    gsap.set(picks, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(rev, { opacity: 0, x: -10 });
    gsap.set(barra, { scaleX: 0, transformOrigin: '0% 50%' });
    tl.to(picks, { scale: 1, duration: 0.3, stagger: { each: 0.09, from: 'random' }, ease: 'back.out(3)' });
    contar(tl, ctr, 10, '<', 0.3 + 9 * 0.09, (v) => `Muestra: ${v} de 80`);
    tl.to(rev, { opacity: 1, x: 0, duration: 0.3, stagger: 0.1 });
    tl.to(barra, { scaleX: 8 / 9, duration: 0.9 });
    contar(tl, pct, 89, '<', 0.9, (v) => `${v}%`);
    cerrar(tl, [...picks, ...rev, barra]);
    return tl;
  },

  incentivos(r) {
    const tl = nueva();
    const barras = qa(r, '.dbar'), pcts = qa(r, '.pct'), tiers = qa(r, '.tier');
    const vals = [112, 96, 131, 78], mapa = [1, 2, 0, 2];
    gsap.set(barras, { scaleY: 0, transformOrigin: '50% 100%' });
    gsap.set(tiers, { opacity: 0 });
    barras.forEach((b, i) => {
      tl.to(b, { scaleY: 1, duration: 0.6, ease: 'power3.out' }, i * 0.18);
      contar(tl, pcts[i], vals[i], i * 0.18, 0.6, (v) => `${v}%`);
    });
    barras.forEach((b, i) => {
      tl.to(tiers[mapa[i]], { opacity: 1, duration: 0.2 }, '+=0.2');
      tl.fromTo(b, { opacity: 1 }, { opacity: 0.4, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, '<');
    });
    cerrar(tl, [...barras, ...tiers]);
    return tl;
  },

  'validador-ocr'(r) {
    const tl = nueva();
    const scan = q(r, '.scan'), caja = q(r, '.caja'), num = q(r, '.num'), val = q(r, '.val'), res = q(r, '.res'), outs = qa(r, '.out');
    const datos = [
      ['07654321', '07654321', '✓ está en el Excel', 'd-a'],
      ['41208867', '41208867', '✓ está en el Excel', 'd-a'],
      ['0?6 5?2', '????????', '✗ no se pudo validar', 'd-w'],
    ];
    gsap.set(caja, { opacity: 0 });
    gsap.set(outs, { opacity: 0, x: -12 });
    datos.forEach(([pagina, lectura, txt, cls], i) => {
      tl.call(() => { num.textContent = pagina; val.textContent = '--------'; res.textContent = 'leyendo…'; res.setAttribute('class', 'res'); }, [], i ? '+=0.3' : 0.01);
      tl.fromTo(scan, { y: 0 }, { y: 184, duration: 1.2, ease: 'none', immediateRender: false });
      tl.to(caja, { opacity: 1, duration: 0.15 }, '<0.55');
      tl.to(val, { duration: 0.6, scrambleText: { text: lectura, chars: '0123456789', speed: 0.8 } }, '<');
      tl.call(() => { res.textContent = txt; res.setAttribute('class', `res ${cls}`); }, [], '>');
      tl.to(outs[i], { opacity: 1, x: 0, duration: 0.35 }, '+=0.1');
      tl.to(caja, { opacity: 0, duration: 0.2 }, '<');
    });
    cerrar(tl, outs);
    return tl;
  },

  anomalias(r) {
    const tl = nueva();
    const cinta = q(r, '.cinta'), curva = q(r, '.curva') as SVGPathElement, zona = q(r, '.zona'), pico = q(r, '.pico');
    const alerta = q(r, '.alerta'), etq = q(r, '.etq');
    const L = curva.getTotalLength();
    const t = (x: number) => (2.8 * (x - 30)) / 350;
    gsap.set(curva, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set(zona, { opacity: 0 });
    gsap.set(pico, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set([alerta, etq], { opacity: 0 });
    tl.to(cinta, { x: -116, duration: 3.4, ease: 'none' }, 0);
    tl.to(curva, { strokeDashoffset: 0, duration: 2.8, ease: 'none' }, 0);
    tl.to(zona, { opacity: 0.16, duration: 0.3 }, t(215));
    tl.to(pico, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, t(255));
    tl.to([alerta, etq], { opacity: 1, duration: 0.2, repeat: 2, yoyo: true }, '<');
    cerrar(tl, [zona, pico, alerta, etq, curva], 1.4);
    return tl;
  },

  invita(r) {
    const tl = nueva();
    const tip = qa(r, '.tipeo'), pub = q(r, '.pub'), pk = q(r, '.pk'), solapa = q(r, '.solapa');
    const tarjeta = q(r, '.tarjeta'), ctr = q(r, '.ctr'), prog = q(r, '.prog');
    gsap.set(tip, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(solapa, { scaleY: 1, transformOrigin: '50% 0%' });
    gsap.set(tarjeta, { y: 0 });
    gsap.set(prog, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(pk, { opacity: 0 });
    gsap.set(pub, { transformOrigin: '50% 50%' });
    tl.to(tip, { scaleX: 1, duration: 0.5, stagger: 0.25, ease: 'power1.inOut' });
    tl.fromTo(pub, { scale: 1 }, { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1, immediateRender: false });
    tl.fromTo(pk, { x: 0, opacity: 1 }, { x: 16, duration: 0.3, immediateRender: false });
    tl.set(pk, { opacity: 0 });
    tl.to(solapa, { scaleY: -1, duration: 0.5, ease: 'power2.inOut' });
    tl.to(tarjeta, { y: -84, duration: 0.7, ease: 'power3.out' });
    tl.to(prog, { scaleX: 48 / 60, duration: 1.2, ease: 'power1.out' }, '+=0.1');
    contar(tl, ctr, 48, '<', 1.2, (v) => String(v));
    cerrar(tl, [...tip, prog, tarjeta]);
    return tl;
  },
};

export function montarDiagramas(reducido: boolean) {
  document.querySelectorAll<HTMLElement>('[data-diag]').forEach((fig) => {
    const crear = constructores[fig.dataset.diag!];
    if (!crear) return;
    const tl = crear(fig);
    if (reducido) { tl.seek('fin', false); return; }
    ScrollTrigger.create({
      trigger: fig.closest('.caso') ?? fig,
      start: 'top 85%',
      end: 'bottom 15%',
      onToggle: (s) => (s.isActive ? tl.play() : tl.pause()),
    });
  });
}
