// Map interactions using Leaflet (lightweight) and Geolocation

function initMap(){
  const mapEl = document.getElementById('map');
  if(!mapEl) return;

  // Include CDN in page for leaflet styles/scripts if available
  const L = window.L;
  if(!L){
    mapEl.innerHTML = '<p>Map library not loaded. Include Leaflet or Google Maps.</p>';
    return;
  }
  const map = L.map('map').setView([0,0],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'© OpenStreetMap contributors'}).addTo(map);

  // load restaurants and add markers
  fetch('data/reviews.json').then(r=>r.json()).then(data=>{
    data.forEach(r=>{
      if(r.coords){
        const m = L.marker([r.coords.lat, r.coords.lng]).addTo(map).bindPopup(`<strong>${r.name}</strong><br>${r.cuisine}`);
      }
    });
  });

  // Geolocation
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((pos)=>{
      const lat = pos.coords.latitude; const lng = pos.coords.longitude;
      map.setView([lat,lng],13);
      L.marker([lat,lng]).addTo(map).bindPopup('You are here').openPopup();
      document.getElementById('nearby-info').textContent = 'Map centered on your location.';
    }, (err)=>{
      console.warn('Geolocation denied or unavailable', err);
      document.getElementById('nearby-info').textContent = 'Allow location to see nearby restaurants.';
    });
  }
}

// init on DOM ready if Leaflet loaded
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMap); else initMap();
