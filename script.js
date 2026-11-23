const $ = (s, r = document) => r.querySelector(s);
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Écran de respiration ---------- */
const loader = $('#loader'), title = $('#loaderTitle'), sub = $('#loaderSub'), skipBtn = $('#skip');
const video = $('.hero-video');
const blocks = [...document.querySelectorAll('.site-header, main, footer')];
blocks.forEach(b => b.inert = true);
skipBtn.focus();

let skipped = false, wakers = [];
const wait = ms => new Promise(res => {
  if (skipped) return res();
  const t = setTimeout(done, ms); function done() { clearTimeout(t); res(); } wakers.push(done);
});
skipBtn.onclick = () => { skipped = true; wakers.forEach(f => f()); };

async function phase(t, s, ms, inhale) {
  loader.classList.add('swap'); await wait(400);
  title.textContent = t; sub.textContent = s; loader.classList.remove('swap');
  loader.style.setProperty('--dur', ms + 'ms');
  loader.classList.toggle('inhale', !!inhale);
  await wait(ms);
}
const pageReady = new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }));
const videoReady = new Promise(r => { if (video.readyState >= 3) return r(); video.addEventListener('canplay', r, { once: true }); setTimeout(r, 4000); });

(async function run() {
  let ready = false; Promise.all([pageReady, videoReady]).then(() => ready = true);
  await phase('Installez-vous confortablement', 'Redressez doucement le dos, laissez retomber vos épaules.', 3000);
  await phase('Inspirez', 'Lentement, par le nez.', 3600, true);
  await phase('Expirez', 'Doucement, jusqu’au bout du souffle.', 4000, false);
  while (!ready && !skipped) {
    await phase('Encore une respiration', 'Inspirez…', 3000, true);
    await phase('Encore une respiration', 'Expirez…', 3400, false);
  }
  loader.classList.add('done');
  blocks.forEach(b => b.inert = false);
  root.classList.remove('loading'); root.classList.add('ready');
  $('#accueil').focus({ preventScroll: true });
  setTimeout(() => loader.remove(), 1400);
})();

/* ---------- Vidéo : pause hors écran / mouvement réduit ---------- */
if (reduce) video.removeAttribute('autoplay'), video.pause();
else new IntersectionObserver(([e]) => e.isIntersecting ? video.play().catch(() => {}) : video.pause()).observe(video);

/* ---------- En-tête : se cache en descendant, revient en remontant ---------- */
const header = $('.site-header'), nav = $('#nav'), toggle = $('.menu-toggle');
let last = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('hide', y > last && y > 120 && !nav.classList.contains('open'));
  last = y;
}, { passive: true });
toggle.onclick = () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
};
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });

/* ---------- Lien actif + apparitions douces ---------- */
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

const rev = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 120 + 'ms'; rev.observe(el); });

/* ---------- Carrousel ---------- */
const track = $('.track'), slides = [...track.children], dotsBox = $('.dots');
let idx = 0;
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Projet ' + (i + 1));
  b.onclick = () => go(i); dotsBox.append(b);
});
function go(i) {
  idx = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${idx * 100}%)`;
  [...dotsBox.children].forEach((d, k) => d.setAttribute('aria-selected', k === idx));
  slides.forEach((s, k) => s.inert = k !== idx);
}
$('.next').onclick = () => go(idx + 1);
$('.prev').onclick = () => go(idx - 1);
$('.carousel').addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
let x0 = null;
track.addEventListener('pointerdown', e => x0 = e.clientX);
track.addEventListener('pointerup', e => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) go(idx + (e.clientX < x0 ? 1 : -1)); x0 = null; });
go(0);

/* ---------- Copier l’e-mail ---------- */
const copy = $('#copy');
copy.onclick = async () => {
  try { await navigator.clipboard.writeText('maximeprosciutti22@gmail.com'); copy.textContent = 'Adresse copiée'; }
  catch { copy.textContent = 'Copie impossible'; }
  setTimeout(() => copy.textContent = 'Copier l’adresse', 2200);
};
