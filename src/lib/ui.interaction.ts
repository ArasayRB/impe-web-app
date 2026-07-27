const activeRequests = new Set<string>();

export function lockElement(el: HTMLElement) {
  const id = el.dataset.requestId || crypto.randomUUID();

  el.dataset.requestId = id;

  if (activeRequests.has(id)) return false;

  activeRequests.add(id);

  el.setAttribute('disabled', 'true');
  el.classList.add('opacity-50', 'pointer-events-none');

  return true;
}

export function unlockElement(el: HTMLElement) {
  const id = el.dataset.requestId;
  if (!id) return;

  activeRequests.delete(id);

  el.removeAttribute('disabled');
  el.classList.remove('opacity-50', 'pointer-events-none');
}