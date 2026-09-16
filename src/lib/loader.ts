export function showLoader() {
  const el = document.getElementById('globalLoader');
  if (el) el.classList.remove('hidden');
}

export function hideLoader() {
  const el = document.getElementById('globalLoader');
  if (el) el.classList.add('hidden');
}
