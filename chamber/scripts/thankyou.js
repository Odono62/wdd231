// parse query string and display required fields
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const required = ['firstName','lastName','email','phone','organization','timestamp'];
  const summary = document.getElementById('summary');
  if (!summary) return;

  const card = document.createElement('div');
  card.className = 'summary-card';
  const ul = document.createElement('dl');
  required.forEach(key => {
    const val = params.get(key) || '(not provided)';
    const dt = document.createElement('dt');
    dt.textContent = key === 'timestamp' ? 'Submitted' : key.replace(/([A-Z])/g, ' $1').replace(/^./, s=>s.toUpperCase());
    const dd = document.createElement('dd');
    dd.textContent = val;
    ul.appendChild(dt);
    ul.appendChild(dd);
  });
  card.appendChild(ul);
  summary.appendChild(card);
});
