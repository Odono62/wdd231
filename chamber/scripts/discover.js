import { places } from '../data/places.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('places-list');
  if (!container) return;

  places.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';

    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.src = p.image;
    img.alt = p.title;
    fig.appendChild(img);

    const h2 = document.createElement('h2'); h2.textContent = p.title;
    const addr = document.createElement('address'); addr.textContent = p.address;
    const desc = document.createElement('p'); desc.textContent = p.description;
    const btn = document.createElement('button'); btn.textContent = 'Learn more'; btn.setAttribute('aria-expanded','false');

    card.appendChild(fig);
    card.appendChild(h2);
    card.appendChild(addr);
    card.appendChild(desc);
    card.appendChild(btn);

    container.appendChild(card);
  });

  // localStorage visit logic
  const visitKey = 'discover_last_visit';
  const now = Date.now();
  const last = parseInt(localStorage.getItem(visitKey), 10);
  const msgEl = document.getElementById('visit-message');
  if (isNaN(last)){
    msgEl.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const msPerDay = 1000*60*60*24;
    const days = Math.floor((now - last)/msPerDay);
    if (days < 1) msgEl.textContent = 'Back so soon! Awesome!';
    else msgEl.textContent = `You last visited ${days} ${days===1? 'day' : 'days'} ago.`;
  }
  localStorage.setItem(visitKey, String(now));
});
