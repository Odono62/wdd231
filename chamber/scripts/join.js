// set timestamp when form loads and handle modals
document.addEventListener('DOMContentLoaded', () => {
  const ts = new Date().toISOString();
  const tsField = document.querySelector('#timestamp');
  if (tsField) tsField.value = ts;

  // modal handling
  document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-modal');
      const dlg = document.getElementById(id);
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
    });
  });

  document.querySelectorAll('dialog .close').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('dialog').close());
  });
});
