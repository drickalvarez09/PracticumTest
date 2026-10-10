// ---------- notice (the little message at the bottom of the screen) ----------
const notice = document.querySelector('.notice');
let noticeTimer;

function showNotice(message) {
  clearTimeout(noticeTimer); // if one is already showing, restart the timer
  notice.textContent = message;
  notice.classList.add('show');
  noticeTimer = setTimeout(function () {
    notice.classList.remove('show');
  }, 3500);
}


// ---------- mobile menu ----------
const menuButton = document.querySelector('.menu-button');
const nav = document.getElementById('nav');

function setMenu(open) {
  if (open) {
    nav.classList.add('open');
  } else {
    nav.classList.remove('open');
  }
  menuButton.setAttribute('aria-expanded', open);
}

menuButton.addEventListener('click', function () {
  setMenu(!nav.classList.contains('open'));
});

// close the menu after tapping a link
document.querySelectorAll('#nav a').forEach(function (link) {
  link.addEventListener('click', function () {
    setMenu(false);
  });
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') setMenu(false);
});


// ---------- tour packages: filter buttons + search + sort + budget ----------
const cards = Array.from(document.querySelectorAll('.card'));
const filterButtons = document.querySelectorAll('[data-filter]');
const searchBox = document.getElementById('search-box');
const sortSelect = document.getElementById('sort-select');
const budgetRange = document.getElementById('budget');
const budgetText = document.getElementById('budget-output');
const resultCount = document.getElementById('result-count');
const noResults = document.getElementById('no-results');

let activeFilter = 'all';

function formatPrice(number) {
  return '$' + number.toLocaleString('en-US');
}

// goes through every card and hides the ones that don't match
function applyFilters() {
  var searchText = searchBox.value.trim().toLowerCase();
  var maxPrice = Number(budgetRange.value);
  var shownCount = 0;

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var cardText = card.textContent.toLowerCase();
    var price = Number(card.dataset.price);

    var matchesFilter = activeFilter === 'all' || card.dataset.type === activeFilter;
    var matchesSearch = cardText.includes(searchText);
    var matchesBudget = price <= maxPrice;

    if (matchesFilter && matchesSearch && matchesBudget) {
      card.classList.remove('hidden');
      shownCount++;
    } else {
      card.classList.add('hidden');
    }
  }

  noResults.hidden = shownCount !== 0;
  resultCount.textContent = shownCount === 1 ? 'Showing 1 tour' : 'Showing ' + shownCount + ' tours';
}

// sorting uses the CSS "order" property so the HTML doesn't have to move
function sortCards() {
  const sortBy = sortSelect.value;
  const sortedCards = cards.slice(); // copy, so the original order stays safe

  if (sortBy === 'price-low') {
    sortedCards.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
  } else if (sortBy === 'price-high') {
    sortedCards.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
  } else if (sortBy === 'days-short') {
    sortedCards.sort(function (a, b) { return a.dataset.days - b.dataset.days; });
  }
  // "featured" = no sorting, just the original order

  sortedCards.forEach(function (card, index) {
    card.style.order = index;
  });
}

filterButtons.forEach(function (filterButton) {
  filterButton.addEventListener('click', function () {
    activeFilter = filterButton.dataset.filter;
    filterButtons.forEach(function (button) {
      button.classList.toggle('active', button === filterButton);
    });
    applyFilters();
  });
});

searchBox.addEventListener('input', applyFilters);

sortSelect.addEventListener('change', sortCards);

budgetRange.addEventListener('input', function () {
  budgetText.textContent = formatPrice(Number(budgetRange.value));
  applyFilters();
});

applyFilters();
sortCards();


// ---------- "Book" buttons fill in the plan form ----------
const planForm = document.getElementById('plan-form');

cards.forEach(function (card) {
  const bookButton = card.querySelector('a.button');
  bookButton.addEventListener('click', function () {
    // the link itself scrolls down to #plan, we just fill the destination
    planForm.destination.value = card.querySelector('h3').textContent;
    clearError(planForm.destination);
  });
});


// ---------- hero carousel ----------
const carousel = document.querySelector('.carousel');
const dotsBox = carousel.querySelector('.dots');
let slides = Array.from(carousel.querySelectorAll('.slide'));
let dots = [];
let currentSlide = 0;
let autoPlayTimer;

function buildDots() {
  dotsBox.innerHTML = '';
  dots = [];
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.setAttribute('aria-label', 'Show destination ' + (i + 1));
    dot.addEventListener('click', function () {
      showSlide(i);
      startAutoPlay();
    });
    dotsBox.appendChild(dot);
    dots.push(dot);
  }
}

function showSlide(index) {
  // the % trick makes it loop around at both ends
  currentSlide = (index + slides.length) % slides.length;
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.toggle('active', i === currentSlide);
    slides[i].setAttribute('aria-hidden', i !== currentSlide);
    dots[i].classList.toggle('active', i === currentSlide);
  }
}

// if a photo doesn't load, remove its slide so nobody sees an empty one
function removeBrokenSlide(slide) {
  const img = slide.querySelector('img');

  function remove() {
    slides = slides.filter(function (s) { return s !== slide; });
    slide.remove();
    buildDots();
    showSlide(Math.min(currentSlide, slides.length - 1));
  }

  img.addEventListener('error', remove);
  if (img.complete && img.naturalWidth === 0) remove();
}

// auto-advance every 6 seconds (not if the person prefers less motion)
function startAutoPlay() {
  clearInterval(autoPlayTimer);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  autoPlayTimer = setInterval(function () {
    showSlide(currentSlide + 1);
  }, 6000);
}

buildDots();
slides.slice().forEach(removeBrokenSlide);
showSlide(0);
startAutoPlay();

carousel.querySelector('.arrow-prev').addEventListener('click', function () {
  showSlide(currentSlide - 1);
  startAutoPlay();
});
carousel.querySelector('.arrow-next').addEventListener('click', function () {
  showSlide(currentSlide + 1);
  startAutoPlay();
});

// pause while the mouse is over it or something inside has focus
carousel.addEventListener('mouseenter', function () { clearInterval(autoPlayTimer); });
carousel.addEventListener('mouseleave', startAutoPlay);
carousel.addEventListener('focusin', function () { clearInterval(autoPlayTimer); });

carousel.setAttribute('tabindex', '0'); // so keyboard users can reach it
carousel.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') showSlide(currentSlide - 1);
  if (event.key === 'ArrowRight') showSlide(currentSlide + 1);
});


// ---------- sign in / sign up popup ----------
const loginPopup = document.getElementById('login-popup');
const loginButton = document.getElementById('login-button');
const greeting = document.getElementById('greeting');
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
    greeting.textContent = 'Hi, ' + name + '!';
    greeting.hidden = false;
    loginButton.textContent = 'Sign out';
  } else {
    greeting.hidden = true;
    loginButton.textContent = 'Sign in';
  }
}

function setMode(mode) {
  const signingUp = mode === 'signup';
  modeTabs.forEach(function (tab) {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  signinForm.hidden = signingUp;
  signupForm.hidden = !signingUp;
  document.getElementById('login-title').textContent = signingUp ? 'Create your account' : 'Welcome back';
}

function showFormError(form, message) {
  const box = form.querySelector('.form-error');
  box.textContent = message;
  box.hidden = false;
}

function resetPopup() {
  signinForm.reset();
  signupForm.reset();
  signinForm.querySelector('.form-error').hidden = true;
  signupForm.querySelector('.form-error').hidden = true;

  // reset sign-in password visibility
  var signinPasswordInput = document.getElementById('signin-password');
  signinPasswordInput.type = 'password';
  document.getElementById('show-password-signin').checked = false;

  // reset sign-up password visibility
  var signupPasswordInput = signupForm.querySelector('input[name="password"]');
  var signupConfirmInput = signupForm.querySelector('input[name="confirm"]');
  if (signupPasswordInput) signupPasswordInput.type = 'password';
  if (signupConfirmInput) signupConfirmInput.type = 'password';
  document.getElementById('show-password-signup').checked = false;

  setMode('signin');
}

function closePopup() {
  loginPopup.close();
  resetPopup();
}


loginButton.addEventListener('click', function () {
  if (getCurrentUser()) {
    setCurrentUser(null);
    showNotice('You have been signed out.');
  } else {
    loginPopup.showModal();
  }
});

modeTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    setMode(tab.dataset.mode);
  });
});

document.querySelectorAll('[data-close]').forEach(function (button) {
  button.addEventListener('click', closePopup);
});

// clicking the dark area outside the popup closes it
loginPopup.addEventListener('click', function (event) {
  if (event.target === loginPopup) closePopup();
});
loginPopup.addEventListener('cancel', resetPopup); // Esc key

// Sign-in show password
const showSigninPassword = document.getElementById('show-password-signin');
const signinPassword = document.getElementById('signin-password');

showSigninPassword.addEventListener('change', function () {
  signinPassword.type = this.checked ? 'text' : 'password';
});

// Sign-up show password
const showSignupPassword = document.getElementById('show-password-signup');

showSignupPassword.addEventListener('change', function () {
  const inputType = this.checked ? 'text' : 'password';
  const passwordInputs = signupForm.querySelectorAll('input[name="password"], input[name="confirm"]');
  passwordInputs.forEach(function (input) {
    input.type = inputType;
  });
});


signinForm.addEventListener('submit', function (event) {
  event.preventDefault();
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
  closePopup();
  showNotice('Welcome back, ' + users[username.toLowerCase()] + '!');
});

signupForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const form = signupForm;

  // check the easy stuff first, one message at a time
  const requiredFields = ['first', 'last', 'gender', 'birthdate', 'email', 'phone', 'street', 'city', 'country', 'username', 'password'];
  for (let i = 0; i < requiredFields.length; i++) {
    if (form[requiredFields[i]].value.trim() === '') {
      showFormError(form, 'Please fill in every field (missing: ' + requiredFields[i] + ').');
      return;
    }
  }

  if (!form.email.value.includes('@') || !form.email.value.includes('.')) {
    showFormError(form, 'That email does not look right.');
    return;
  }

  // age check: must be at least 13
  const birthDate = new Date(form.birthdate.value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthday = today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hadBirthday) age = age - 1;
  if (isNaN(age) || age < 13 || age > 120) {
    showFormError(form, 'You need to be at least 13 to sign up.');
    return;
  }

  const username = form.username.value.trim();
  if (username.length < 4 || username.includes(' ')) {
    showFormError(form, 'Username needs 4+ characters and no spaces.');
    return;
  }

  if (form.password.value.length < 6) {
    showFormError(form, 'Password needs at least 6 characters.');
    return;
  }
  if (form.password.value !== form.confirm.value) {
    showFormError(form, 'The two passwords do not match.');
    return;
  }

  const users = getUsers();
  if (users[username.toLowerCase()]) {
    showFormError(form, 'That username is taken, pick another one.');
    return;
  }

  const firstName = form.first.value.trim();
  users[username.toLowerCase()] = firstName;
  saveUsers(users);
  setCurrentUser(firstName);
  closePopup();
  showNotice('Account created. Welcome, ' + firstName + '!');
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
  label.querySelector('.field-error').textContent = message;
  input.classList.add('has-error');
}

function clearError(input) {
  const label = input.closest('label');
  label.querySelector('.field-error').textContent = '';
  input.classList.remove('has-error');
}

// live character counter for the notes box
notes.addEventListener('input', function () {
  notesCount.textContent = notes.value.length + '/200';
});

// remove the red error as soon as the person starts fixing the field
['fullname', 'email', 'destination', 'month'].forEach(function (name) {
  planForm[name].addEventListener('input', function () {
    clearError(planForm[name]);
  });
});

planForm.addEventListener('submit', function (event) {
  event.preventDefault();
  let isValid = true;

  const fullname = planForm.fullname.value.trim();
  const email = planForm.email.value.trim();
  const destination = planForm.destination.value.trim();
  const month = planForm.month.value;

  if (fullname.length < 2) {
    setError(planForm.fullname, 'Please tell us your name.');
    isValid = false;
  }

  // very simple email check, good enough for a demo
  if (!email.includes('@') || !email.includes('.') || email.indexOf('@') > email.lastIndexOf('.')) {
    setError(planForm.email, 'Enter a valid email so we can reach you.');
    isValid = false;
  }

  if (destination === '') {
    setError(planForm.destination, 'Where do you want to go?');
    isValid = false;
  }

  if (month === '') {
    setError(planForm.month, 'Pick a month.');
    isValid = false;
  } else if (month < thisMonth) {
    setError(planForm.month, 'That month already passed!');
    isValid = false;
  }

  if (!isValid) {
    // jump to the first field with a problem
    planForm.querySelector('.has-error').focus();
    return;
  }

  const firstName = fullname.split(' ')[0];
  showNotice('Thanks ' + firstName + '! A planner will email you a ' + destination + ' draft in 48 hours.');
  planForm.reset();
  notesCount.textContent = '0/200';
});


// ---------- scroll fade-in for sections ----------
// adds a gentle entrance animation as sections scroll into view
if ('IntersectionObserver' in window) {
  var fadeTargets = document.querySelectorAll('.section, .plan, .hero');
  fadeTargets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(function (el) {
    observer.observe(el);
  });
} else {
  // fallback for older browsers: just show everything
  document.querySelectorAll('.fade-in').forEach(function (el) {
    el.classList.add('visible');
  });
}
