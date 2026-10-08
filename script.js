/* =========================================================
   Wanderly: all behavior lives here. Nothing is saved or sent;
   forms only show a message (demo version).
   Sections: helpers, toast, mobile menu, filter, carousel,
   sign-in popup, plan form.
   ========================================================= */
(() => {
  /* ---------- 1. Helpers: short names for finding elements ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* ---------- 2. Toast: small message that pops up at the bottom ---------- */
  const toast = $('.toast');
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);                 // restart the timer if a toast is already showing
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  /* ---------- 3. Mobile menu: open/close the nav on small screens ---------- */
  const menuBtn = $('.menu-btn');
  const nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  }
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- 4. Package filter: show only cards matching the chip ---------- */
  const chips = $$('[data-filter]');
  chips.forEach(chip => chip.addEventListener('click', () => {
    const type = chip.dataset.filter;
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    $$('.card').forEach(card => {
      card.classList.toggle('is-hidden', type !== 'all' && card.dataset.type !== type);
    });
  }));

  /* ---------- 5. Hero carousel: arrows + dots cross-fade between slides ---------- */
  const carousel = $('.carousel');
  const dotBox = $('.dots', carousel);
  let slides = $$('.slide', carousel);
  let dots = [];
  let current = 0;

  // build one dot button per slide (called again if a slide is removed)
  function buildDots() {
    dotBox.innerHTML = '';
    dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Show destination ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotBox.append(dot);
      return dot;
    });
  }

  // show one slide, hide the rest
  function goTo(index) {
    current = (index + slides.length) % slides.length;   // wraps from last back to first
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', i !== current);
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  // if a photo fails to load, drop its slide so visitors never see a blank one
  function dropIfBroken(slide) {
    const img = $('img', slide);
    const remove = () => {
      slides = slides.filter(s => s !== slide);
      slide.remove();
      buildDots();
      goTo(Math.min(current, slides.length - 1));
    };
    img.addEventListener('error', remove);
    if (img.complete && img.naturalWidth === 0) remove();   // already failed before this script ran
  }

  buildDots();
  slides.forEach(dropIfBroken);
  goTo(0);

  $('.arrow-prev', carousel).addEventListener('click', () => goTo(current - 1));
  $('.arrow-next', carousel).addEventListener('click', () => goTo(current + 1));
  carousel.setAttribute('tabindex', '0');                // lets keyboard users focus it, then use arrow keys
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ---------- 6. Sign-in / sign-up popup (two separate forms) ---------- */
  const dialog = $('#auth');
  const signinForm = $('#signin-form');
  const signupForm = $('#signup-form');
  const modeTabs = $$('[data-mode]');

  // show the sign-in form or the sign-up form
  function setMode(mode) {
    const signingUp = mode === 'up';
    modeTabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.mode === mode));
    signinForm.hidden = signingUp;
    signupForm.hidden = !signingUp;
    $('#auth-title').textContent = signingUp ? 'Create your account' : 'Welcome back';
  }

  function resetDialog() {
    signinForm.reset();
    signupForm.reset();
    setMode('in');
  }

  function closeDialog() {
    dialog.close();
    resetDialog();
  }

  $('[data-open-dialog]').addEventListener('click', () => dialog.showModal());
  modeTabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
  $$('[data-close]').forEach(btn => btn.addEventListener('click', closeDialog));   // works even with empty fields
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); }); // click outside to close
  dialog.addEventListener('cancel', resetDialog);                                     // Esc key

  signinForm.addEventListener('submit', e => {
    e.preventDefault();                                  // no backend yet, so just show a message
    closeDialog();
    showToast('Demo only: you are signed in (not really!).');
  });

  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const firstName = e.target.first.value;
    closeDialog();
    showToast(`Demo only: welcome, ${firstName}! Account not really created.`);
  });

  /* ---------- 7. Plan your trip form ---------- */
  $('#plan-form').addEventListener('submit', e => {
    e.preventDefault();
    showToast(`Thanks! A planner will draft your ${e.target.dest.value} trip.`);
    e.target.reset();
  });
})();
