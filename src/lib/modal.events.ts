import { modalController } from '@/lib/modal.controller';
import { resolveModal } from '@/lib/modal.registry';

export function initModalEvents() {
  document.addEventListener('click', (e) => {
    const target = e.target;

    if (!(target instanceof Element)) return;

    // CLOSE
    const closeBtn = target.closest('[data-close-modal]');
    if (closeBtn) {
      const id = closeBtn.getAttribute('data-close-modal');
      if (id) modalController.close(id);
      return;
    }

    // OPEN (opcional)
    const openBtn = target.closest('[data-open-modal]');
    if (openBtn) {
      const id = openBtn.getAttribute('data-open-modal');
      if (!id) return;

      const from = openBtn.getAttribute('data-from');

			// 1. Create context object with button data
  		const context = { from: from || undefined };

      // close current modal if apply
      if (from === 'case') {
        modalController.close('add-case-modal');
      }

      const handler = resolveModal(id);

      if (handler) {
        handler(id, context); // dynamic
      } else {
        modalController.open(id, context); // fallback
      }

      return;
    }
  });
}
