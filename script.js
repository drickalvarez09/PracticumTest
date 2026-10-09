// Wanderly - script.js
// Everything here is demo only. Nothing is sent to a server.
// The only thing saved is a tiny sign-in note in localStorage.


// ---------- toast (the little message at the bottom) ----------
const toast = document.querySelector('.toast');
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer); // if one is already showing, restart the timer
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 3500);
}


// ---------- mobile menu ----------
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');

function setMenu(open) {
  if (open) {
    nav.classList.add('open');
  } else {
    nav.classList.remove('open');
  }
  menuBtn.setAttribute('aria-expanded', open);
}

menuBtn.addEventListener('click', function () {
  setMenu(!nav.classList.contains('open'));
});

// close the menu after tapping a link
document.querySelectorAll('#nav a').forEach(function (link) {
  link.addEventListener('click', function () {
    setMenu(false);
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') setMenu(false);
});


// ---------- tour packages: filter chips + search + sort + budget ----------
const cards = Array.from(document.querySelectorAll('.card'));
const chips = document.querySelectorAll('[data-filter]');
const searchBox = document.getElementById('tour-search');
const sortSelect = document.getElementById('tour-sort');
const budgetRange = document.getElementById('budget');
const budgetOut = document.getElementById('budget-out');
const resultCount = document.getElementById('result-count');
const emptyMsg = document.getElementById('empty-msg');

let activeType = 'all';

function formatPrice(number) {
  return '$' + number.toLocaleString('en-US');
}

// goes through every card and hides the ones that don't match
function applyFilters() {
  var text = searchBox.value.trim().toLowerCase();
  var maxPrice = Number(budgetRange.value);
  var shown = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var words = card.textContent.toLowerCase();
    var price = Number(card.dataset.price);

    var typeOk = activeType === 'all' || card.dataset.type === activeType;
    var textOk = words.includes(text);
    var priceOk = price <= maxPrice;

    if (typeOk && textOk && priceOk) {
      card.classList.remove('is-hidden');
      shown++;
    } else {
      card.classList.add('is-hidden');
    }
  }

  emptyMsg.hidden = shown !== 0;
  resultCount.textContent = shown === 1 ? 'Showing 1 tour' : 'Showing ' + shown + ' tours';
}

// sorting uses the CSS "order" property so the HTML doesn't have to move
function sortCards() {
  const how = sortSelect.value;
  const list = cards.slice(); // copy, so the original order stays safe

  if (how === 'price-low') {
    list.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
  } else if (how === 'price-high') {
    list.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
  } else if (how === 'days-short') {
    list.sort(function (a, b) { return a.dataset.days - b.dataset.days; });
  }
  // "featured" = no sorting, just the original order

  list.forEach(function (card, index) {
    card.style.order = index;
  });
}

chips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    activeType = chip.dataset.filter;
    chips.forEach(function (c) {
      c.classList.toggle('is-active', c === chip);
    });
    applyFilters();
  });
});

searchBox.addEventListener('input', applyFilters);

sortSelect.addEventListener('change', sortCards);

budgetRange.addEventListener('input', function () {
  budgetOut.textContent = formatPrice(Number(budgetRange.value));
  applyFilters();
});

applyFilters();
sortCards();


// ---------- "Book" buttons fill in the plan form ----------
const planForm = document.getElementById('plan-form');

cards.forEach(function (card) {
  const bookBtn = card.querySelector('a.btn');
  bookBtn.addEventListener('click', function () {
    // the link itself scrolls down to #plan, we just fill the destination
    planForm.dest.value = card.querySelector('h3').textContent;
    clearError(planForm.dest);
  });
});


// ---------- hero carousel ----------
const carousel = document.querySelector('.carousel');
const dotBox = carousel.querySelector('.dots');
let slides = Array.from(carousel.querySelectorAll('.slide'));
let dots = [];
let current = 0;
let autoTimer;

function buildDots() {
  dotBox.innerHTML = '';
  dots = [];
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', 'Show destination ' + (i + 1));
    dot.addEventListener('click', function () {
      goTo(i);
      startAuto();
    });
    dotBox.appendChild(dot);
    dots.push(dot);
  }
}

function goTo(index) {
  // the % trick makes it loop around at both ends
  current = (index + slides.length) % slides.length;
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.toggle('is-active', i === current);
    slides[i].setAttribute('aria-hidden', i !== current);
    dots[i].classList.toggle('is-active', i === current);
  }
}

// if a photo doesn't load, remove its slide so nobody sees an empty one
function removeIfBroken(slide) {
  const img = slide.querySelector('img');

  function remove() {
    slides = slides.filter(function (s) { return s !== slide; });
    slide.remove();
    buildDots();
    goTo(Math.min(current, slides.length - 1));
  }

  img.addEventListener('error', remove);
  if (img.complete && img.naturalWidth === 0) remove();
}

// auto-advance every 6 seconds (not if the person prefers less motion)
function startAuto() {
  clearInterval(autoTimer);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  autoTimer = setInterval(function () {
    goTo(current + 1);
  }, 6000);
}

buildDots();
slides.slice().forEach(removeIfBroken);
goTo(0);
startAuto();

carousel.querySelector('.arrow-prev').addEventListener('click', function () {
  goTo(current - 1);
  startAuto();
});
carousel.querySelector('.arrow-next').addEventListener('click', function () {
  goTo(current + 1);
  startAuto();
});

// pause while the mouse is over it or something inside has focus
carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
carousel.addEventListener('mouseleave', startAuto);
carousel.addEventListener('focusin', function () { clearInterval(autoTimer); });

carousel.setAttribute('tabindex', '0'); // so keyboard users can reach it
carousel.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});


// ---------- sign in / sign up popup ----------
const dialog = document.getElementById('auth');
const authBtn = document.getElementById('auth-btn');
const greet = document.getElementById('greet');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const modeTabs = document.querySelectorAll('[data-mode]');
// --- "database": just an object saved in localStorage, like { username: firstName }
// NOTE: passwords are NOT saved anywhere, this is only a demo
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('wanderly-users')) || {};
  } catch (err) {
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem('wanderly-users', JSON.stringify(users));
  } catch (err) {
    // storage blocked (private mode?) - the site still works, it just forgets
  }
}

function getCurrentUser() {
  try {
    return localStorage.getItem('wanderly-current');
  } catch (err) {
    return null;
  }
}

function setCurrentUser(name) {
  try {
    if (name) {
      localStorage.setItem('wanderly-current', name);
    } else {
      localStorage.removeItem('wanderly-current');
    }
  } catch (err) {}
  updateHeader();
}

// changes the header between "Sign in" and "Hi, Name / Sign out"
function updateHeader() {
  const name = getCurrentUser();
  if (name) {
    greet.textContent = 'Hi, ' + name + '!';
    greet.hidden = false;
    authBtn.textContent = 'Sign out';
  } else {
    greet.hidden = true;
    authBtn.textContent = 'Sign in';
  }
}

function setMode(mode) {
  const signingUp = mode === 'up';
  modeTabs.forEach(function (tab) {
    tab.classList.toggle('is-active', tab.dataset.mode === mode);
  });
  signinForm.hidden = signingUp;
  signupForm.hidden = !signingUp;
  document.getElementById('auth-title').textContent = signingUp ? 'Create your account' : 'Welcome back';
}

function showFormError(form, message) {
  const box = form.querySelector('.form-error');
  box.textContent = message;
  box.hidden = false;
}

function resetDialog() {
  signinForm.reset();
  signupForm.reset();
  signinForm.querySelector('.form-error').hidden = true;
  signupForm.querySelector('.form-error').hidden = true;

  // reset sign-in password visibility
  var pwSignin = document.getElementById('password-field');
  pwSignin.type = 'password';
  document.getElementById('show-pw-signin').checked = false;

  // reset sign-up password visibility
  var pwSignup = signupForm.querySelector('input[name="password"]');
  var confirmSignup = signupForm.querySelector('input[name="confirm"]');
  if (pwSignup) pwSignup.type = 'password';
  if (confirmSignup) confirmSignup.type = 'password';
  document.getElementById('show-pw-signup').checked = false;

  setMode('in');
}

function closeDialog() {
  dialog.close();
  resetDialog();
}


authBtn.addEventListener('click', function () {
  if (getCurrentUser()) {
    setCurrentUser(null);
    showToast('You have been signed out.');
  } else {
    dialog.showModal();
  }
});

modeTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    setMode(tab.dataset.mode);
  });
});

document.querySelectorAll('[data-close]').forEach(function (btn) {
  btn.addEventListener('click', closeDialog);
});

// clicking the dark area outside the popup closes it
dialog.addEventListener('click', function (e) {
  if (e.target === dialog) closeDialog();
});
dialog.addEventListener('cancel', resetDialog); // Esc key

// Sign-in show password
const showPwSignin = document.getElementById('show-pw-signin');
const passwordField = document.getElementById('password-field');

showPwSignin.addEventListener('change', function () {
  passwordField.type = this.checked ? 'text' : 'password';
});

// Sign-up show password
const showPwSignup = document.getElementById('show-pw-signup');

showPwSignup.addEventListener('change', function () {
  const newType = this.checked ? 'text' : 'password';
  const pwInputs = signupForm.querySelectorAll('input[name="password"], input[name="confirm"]');
  pwInputs.forEach(function (input) {
    input.type = newType;
  });
});


signinForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = signinForm.username.value.trim();
  const password = signinForm.password.value;

  if (username === '' || password === '') {
    showFormError(signinForm, 'Please fill in your username and password.');
    return;
  }

  const users = getUsers();
  if (!users[username.toLowerCase()]) {
    showFormError(signinForm, 'We could not find that username. Try the Sign up tab first.');
    return;
  }

  setCurrentUser(users[username.toLowerCase()]);
  closeDialog();
  showToast('Welcome back, ' + users[username.toLowerCase()] + '!');
});

signupForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const f = signupForm;

  // check the easy stuff first, one message at a time
  const required = ['first', 'last', 'gender', 'birthdate', 'email', 'phone', 'street', 'city', 'country', 'username', 'password'];
  for (let i = 0; i < required.length; i++) {
    if (f[required[i]].value.trim() === '') {
      showFormError(f, 'Please fill in every field (missing: ' + required[i] + ').');
      return;
    }
  }

  if (!f.email.value.includes('@') || !f.email.value.includes('.')) {
    showFormError(f, 'That email does not look right.');
    return;
  }

  // age check: must be at least 13
  const birth = new Date(f.birthdate.value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthday = today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthday) age = age - 1;
  if (isNaN(age) || age < 13 || age > 120) {
    showFormError(f, 'You need to be at least 13 to sign up.');
    return;
  }

  const username = f.username.value.trim();
  if (username.length < 4 || username.includes(' ')) {
    showFormError(f, 'Username needs 4+ characters and no spaces.');
    return;
  }

  if (f.password.value.length < 6) {
    showFormError(f, 'Password needs at least 6 characters.');
    return;
  }
  if (f.password.value !== f.confirm.value) {
    showFormError(f, 'The two passwords do not match.');
    return;
  }

  const users = getUsers();
  if (users[username.toLowerCase()]) {
    showFormError(f, 'That username is taken, pick another one.');
    return;
  }

  const firstName = f.first.value.trim();
  users[username.toLowerCase()] = firstName;
  saveUsers(users);
  setCurrentUser(firstName);
  closeDialog();
  showToast('Account created. Welcome, ' + firstName + '!');
});

updateHeader();


// ---------- plan your trip form ----------
const notes = planForm.notes;
const notesCount = document.getElementById('notes-count');

// you can't plan a trip in the past, so block earlier months
const now = new Date();
const thisMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
planForm.month.min = thisMonth;

function setError(input, message) {
  const label = input.closest('label');
  label.querySelector('.error').textContent = message;
  input.classList.add('invalid');
}

function clearError(input) {
  const label = input.closest('label');
  label.querySelector('.error').textContent = '';
  input.classList.remove('invalid');
}

// live character counter for the notes box
notes.addEventListener('input', function () {
  notesCount.textContent = notes.value.length + '/200';
});

// remove the red error as soon as the person starts fixing the field
['fullname', 'email', 'dest', 'month'].forEach(function (name) {
  planForm[name].addEventListener('input', function () {
    clearError(planForm[name]);
  });
});

planForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let ok = true;

  const fullname = planForm.fullname.value.trim();
  const email = planForm.email.value.trim();
  const dest = planForm.dest.value.trim();
  const month = planForm.month.value;

  if (fullname.length < 2) {
    setError(planForm.fullname, 'Please tell us your name.');
    ok = false;
  }

  // very simple email check, good enough for a demo
  if (!email.includes('@') || !email.includes('.') || email.indexOf('@') > email.lastIndexOf('.')) {
    setError(planForm.email, 'Enter a valid email so we can reach you.');
    ok = false;
  }

  if (dest === '') {
    setError(planForm.dest, 'Where do you want to go?');
    ok = false;
  }

  if (month === '') {
    setError(planForm.month, 'Pick a month.');
    ok = false;
  } else if (month < thisMonth) {
    setError(planForm.month, 'That month already passed!');
    ok = false;
  }

  if (!ok) {
    // jump to the first field with a problem
    planForm.querySelector('.invalid').focus();
    return;
  }

  const firstName = fullname.split(' ')[0];
  showToast('Thanks ' + firstName + '! A planner will email you a ' + dest + ' draft in 48 hours.');
  planForm.reset();
  notesCount.textContent = '0/200';
});


// ---------- scroll fade-in for sections ----------
// adds a gentle entrance animation as sections scroll into view
if ('IntersectionObserver' in window) {
  var fadeTargets = document.querySelectorAll('.section, .plan, .hero');
  fadeTargets.forEach(function (el) {
    el.classList.add('fade-section');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(function (el) {
    observer.observe(el);
  });
} else {
  // fallback for older browsers: just show everything
  document.querySelectorAll('.fade-section').forEach(function (el) {
    el.classList.add('is-visible');
  });
}
