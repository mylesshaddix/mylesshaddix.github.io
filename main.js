document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

// Fade sections in as they scroll into view
const revealer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

// Lightbox
const box = document.createElement('div');
box.className = 'lightbox';
box.setAttribute('role', 'dialog');
box.setAttribute('aria-modal', 'true');
box.innerHTML = '<button class="close" aria-label="Close">&times;</button>' +
  '<button class="nav-btn prev" aria-label="Previous">&#8249;</button>' +
  '<button class="nav-btn next" aria-label="Next">&#8250;</button>' +
  '<div class="stage"></div><div class="title"></div>';
document.body.appendChild(box);
const stage = box.querySelector('.stage');
const titleEl = box.querySelector('.title');
const prevBtn = box.querySelector('.prev');
const nextBtn = box.querySelector('.next');
let gallery = null, index = 0, lastFocus = null;

function openBox(node, title) {
  lastFocus = document.activeElement;
  stage.replaceChildren(node);
  titleEl.textContent = title || '';
  prevBtn.hidden = nextBtn.hidden = !gallery;
  box.classList.add('open');
  document.body.style.overflow = 'hidden';
  box.querySelector('.close').focus({ preventScroll: true });
}
function closeBox() {
  if (!box.classList.contains('open')) return;
  const v = stage.querySelector('video');
  if (v) v.pause();
  box.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => stage.replaceChildren(), 300);
  gallery = null;
  if (lastFocus) lastFocus.focus({ preventScroll: true });
}
function showPhoto(i) {
  index = (i + gallery.length) % gallery.length;
  const src = gallery[index];
  const img = document.createElement('img');
  img.src = src.src;
  img.alt = src.alt;
  if (box.classList.contains('open')) stage.replaceChildren(img);
  else openBox(img);
}
box.addEventListener('click', e => {
  if (e.target.closest('.close') || e.target === box) closeBox();
  else if (e.target.closest('.prev')) showPhoto(index - 1);
  else if (e.target.closest('.next')) showPhoto(index + 1);
});
document.addEventListener('keydown', e => {
  if (!box.classList.contains('open')) return;
  if (e.key === 'Escape') closeBox();
  if (gallery && e.key === 'ArrowLeft') showPhoto(index - 1);
  if (gallery && e.key === 'ArrowRight') showPhoto(index + 1);
});
// Swipe between photos on phones
let touchX = null;
box.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
box.addEventListener('touchend', e => {
  if (!gallery || touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showPhoto(index + (dx < 0 ? 1 : -1));
  touchX = null;
});

// Films: short muted preview loops while on screen, full film on click
function startPreview(v) {
  if (!v.src) v.src = v.dataset.src;
  v.play().then(() => v.classList.add('playing')).catch(() => {});
}
function stopPreview(v) {
  v.pause();
  v.classList.remove('playing');
}
const films = [...document.querySelectorAll('.film-media')];
function previewOnly(media) {
  films.forEach(m => { if (m !== media) stopPreview(m.querySelector('video')); });
  startPreview(media.querySelector('video'));
}

films.forEach(media => {
  const preview = media.querySelector('video');
  // Computer: preview while the cursor is over the film
  media.addEventListener('mouseenter', () => startPreview(preview));
  media.addEventListener('mouseleave', () => stopPreview(preview));
  // Phone: touching or swiping across a film plays its preview, a tap opens the full film
  media.addEventListener('touchstart', () => previewOnly(media), { passive: true });

  media.addEventListener('click', () => {
    stopPreview(preview);
    const v = document.createElement('video');
    v.src = media.dataset.video;
    v.poster = media.querySelector('img').src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.setAttribute('controlslist', 'nodownload');
    gallery = null;
    openBox(v, media.dataset.title);
  });
});

// Stop a preview once its film scrolls off screen
const offscreen = new IntersectionObserver(entries => {
  entries.forEach(e => { if (!e.isIntersecting) stopPreview(e.target.querySelector('video')); });
});
films.forEach(m => offscreen.observe(m));

// Photos
const photoImgs = [...document.querySelectorAll('.photos img')];
photoImgs.forEach((img, i) => {
  img.closest('button').addEventListener('click', () => {
    gallery = photoImgs;
    showPhoto(i);
  });
});

// Contact form: send without leaving the page
const form = document.querySelector('.contact form');
if (form) {
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = 'Sending...';
    submit.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = 'Thanks, message sent. I\'ll get back to you soon.';
    } catch {
      status.textContent = 'Something went wrong. Email mylesshaddix@gmail.com directly.';
    } finally {
      submit.disabled = false;
    }
  });
}
