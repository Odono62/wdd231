// Handle fetching and rendering reviews

const API = 'data/reviews.json';
let reviews = [];
let filtered = [];
const state = { search: '', cuisine: '', sort: '' };

document.addEventListener('DOMContentLoaded', () => {
  const reviewsList = document.getElementById('reviews-list');
  const search = document.getElementById('search');
  const filterCuisine = document.getElementById('filter-cuisine');
  const sortRating = document.getElementById('sort-rating');
  const sortNewest = document.getElementById('sort-newest');
  const skeleton = document.getElementById('skeleton');

  if(skeleton) skeleton.hidden = false;

  fetch(API)
    .then(r => r.json())
    .then(data => {
      reviews = data;
      filtered = [...reviews];
      populateCuisineFilter(reviews);
      renderReviews(filtered);
      if(skeleton) skeleton.hidden = true;
    })
    .catch(err => {
      console.error('Failed to load reviews', err);
      if(skeleton) skeleton.hidden = true;
      if(reviewsList) reviewsList.innerHTML = '<p>Failed to load reviews.</p>';
    });

  function populateCuisineFilter(data){
    const options = [...new Set(data.map(r => r.cuisine))].sort();
    options.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filterCuisine.appendChild(opt);
    });
  }

  function applyFilters(){
    filtered = reviews.filter(r => {
      const text = `${r.name} ${r.cuisine} ${r.address} ${r.review}`.toLowerCase();
      const matchesSearch = text.includes(state.search);
      const matchesCuisine = state.cuisine ? r.cuisine === state.cuisine : true;
      return matchesSearch && matchesCuisine;
    });
    if(state.sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
    if(state.sort === 'newest') filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
    renderReviews(filtered);
  }

  function renderReviews(list){
    if(!reviewsList) return;
    reviewsList.innerHTML = '';
    if(!list.length){
      reviewsList.innerHTML = '<p class="no-results">No matching restaurants found.</p>';
      return;
    }
    list.forEach(r => {
      const card = document.createElement('article');
      card.className = 'review-card';
      card.innerHTML = `
        <img data-src="${r.photo}" alt="${r.name}" class="lazy">
        <div class="meta">
          <h3>${r.name}</h3>
          <p class="muted">${r.cuisine} • ${r.address}</p>
          <p class="rating">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</p>
          <p class="price">${r.price}</p>
          <p class="review-text">${r.review}</p>
          <p class="visited">Visited: ${new Date(r.date).toLocaleDateString()}</p>
          <button class="fav-btn" data-id="${r.id}" aria-pressed="false">♡</button>
        </div>
      `;
      reviewsList.appendChild(card);
    });
    loadLazyImages();
    restoreFavorites();
  }

  function loadLazyImages(){
    const imgs = document.querySelectorAll('img.lazy');
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            obs.unobserve(img);
          }
        });
      }, {rootMargin:'100px'});
      imgs.forEach(img => io.observe(img));
    } else {
      imgs.forEach(img => img.src = img.dataset.src);
    }
  }

  function restoreFavorites(){
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    favs.forEach(id => {
      const button = document.querySelector(`.fav-btn[data-id="${id}"]`);
      if(button){ button.textContent = '♥'; button.setAttribute('aria-pressed','true'); }
    });
  }

  search.addEventListener('input', () => {
    state.search = search.value.toLowerCase();
    applyFilters();
  });

  filterCuisine.addEventListener('change', () => {
    state.cuisine = filterCuisine.value;
    applyFilters();
  });

  sortRating.addEventListener('click', () => {
    state.sort = 'rating';
    applyFilters();
  });

  sortNewest.addEventListener('click', () => {
    state.sort = 'newest';
    applyFilters();
  });
});
