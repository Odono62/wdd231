// Main JS for site-wide interactions

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const scrollTop = document.getElementById('scroll-top');
  const yearEl = document.getElementById('year');
  const lastModifiedEl = document.getElementById('last-modified');
  const newsletter = document.getElementById('newsletter-form');
  const contactForm = document.getElementById('contact-form');
  const gemsList = document.getElementById('gems-list');

  const hiddenGems = [
    {name:'Sunrise Deli', city:'Downtown', tagline:'Fresh breakfast bowls', img:'images/placeholder.svg'},
    {name:'Spice Lane', city:'Old Market', tagline:'Secret curry favorites', img:'images/placeholder.svg'},
    {name:'Brick Oven Bites', city:'Harbour', tagline:'Wood-fired pizza and pasta', img:'images/placeholder.svg'}
  ];

  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
  else if(prefersDark) document.documentElement.setAttribute('data-theme','dark');

  if(themeToggle){
    const updateThemeButton = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
      themeToggle.setAttribute('aria-pressed', theme === 'dark');
    };
    updateThemeButton();
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeButton();
    });
  }

  if(navToggle && siteNav){
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  if(yearEl) yearEl.textContent = new Date().getFullYear();
  if(lastModifiedEl) lastModifiedEl.textContent = new Date(document.lastModified).toLocaleDateString();

  if(scrollTop){
    window.addEventListener('scroll', () => {
      scrollTop.style.display = window.scrollY > 320 ? 'block' : 'none';
    });
    scrollTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  }

  if(newsletter){
    newsletter.addEventListener('submit', e => {
      e.preventDefault();
      const email = newsletter.querySelector('input[type=email]').value;
      localStorage.setItem('newsletter', email);
      alert('Thanks for subscribing!');
      newsletter.reset();
    });
  }

  if(contactForm){
    contactForm.addEventListener('submit', e => {
      if(!contactForm.checkValidity()) return;
      e.preventDefault();
      alert('Message sent! I will reply soon.');
      contactForm.reset();
    });
  }

  if(gemsList){
    hiddenGems.forEach(gem => {
      const card = document.createElement('article');
      card.className = 'gem-card';
      card.innerHTML = `
        <img data-src="${gem.img}" alt="${gem.name}" class="lazy">
        <div>
          <h4>${gem.name}</h4>
          <p>${gem.city}</p>
          <p>${gem.tagline}</p>
        </div>
      `;
      gemsList.appendChild(card);
    });
  }

  const lazyImages = document.querySelectorAll('img.lazy');
  const loadImage = img => { img.src = img.dataset.src; img.classList.remove('lazy'); };
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          loadImage(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, {rootMargin:'100px'});
    lazyImages.forEach(img => io.observe(img));
  } else {
    lazyImages.forEach(loadImage);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', event => {
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        event.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
      }
    });
  });

  document.body.addEventListener('click', event => {
    if(event.target.matches('.fav-btn')){
      const id = event.target.dataset.id;
      const favs = JSON.parse(localStorage.getItem('favs') || '[]');
      const index = favs.indexOf(id);
      if(index > -1){
        favs.splice(index,1);
        event.target.textContent = '♡';
        event.target.setAttribute('aria-pressed','false');
      } else {
        favs.push(id);
        event.target.textContent = '♥';
        event.target.setAttribute('aria-pressed','true');
      }
      localStorage.setItem('favs', JSON.stringify(favs));
    }
  });

  const storedFavs = JSON.parse(localStorage.getItem('favs') || '[]');
  storedFavs.forEach(id => {
    const button = document.querySelector(`.fav-btn[data-id="${id}"]`);
    if(button){ button.textContent = '♥'; button.setAttribute('aria-pressed','true'); }
  });
});
