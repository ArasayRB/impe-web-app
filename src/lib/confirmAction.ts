import { modalController } from '@/lib/modal.controller';
import {showSuccess,showError} from '@/lib/toast';

type ConfirmActionOptions = {
  modalId: string;
  svg?: string;
  title?: string;
  message?: string;
  onConfirm: () => void | Promise<void>;
  successMessage?: string;
  errorMessage?: string;
	onCancel?: () => void;
};

export function confirmAction({
  modalId,
  svg,
  title,
  message,
	onConfirm,
	successMessage,
	errorMessage,
}: ConfirmActionOptions) {

    const modal = document.getElementById(modalId);

  if (!modal) return;

  // svg
  const svgEl = modal.querySelector(
    '[data-confirm-svg]'
  );

  if (svgEl && svg) {
    svgEl.innerHTML = '';
    svgEl.innerHTML = svg;
  }
  
  // title
  const titleEl = modal.querySelector(
    '[data-confirm-title]'
  );

  if (titleEl && title) {
    titleEl.textContent = title;
  }

  // message
  const messageEl = modal.querySelector(
    '[data-confirm-message]'
  );

  if (messageEl && message) {
    messageEl.textContent = message;
  }

  modalController.open(modalId);

  const confirmBtn = modal.querySelector(
    '[data-confirm-action]'
  ) as HTMLButtonElement | null;

  if (!confirmBtn) return;

  const handler = async () => {

    // 🔥 prevent multi click
    if (confirmBtn.disabled) return;

    confirmBtn.disabled = true;

		confirmBtn.classList.add(
				'opacity-50',
				'cursor-not-allowed'
		);

    try {

      await onConfirm();

      modalController.close(modalId);

    	if (successMessage) {
					showSuccess(successMessage);
			}

    } catch (error) {

				showError(
        error.message ?? errorMessage ?? ''
    );

		} finally {

      confirmBtn.disabled = false;

			confirmBtn.classList.remove(
					'opacity-50',
					'cursor-not-allowed'
			);

      confirmBtn.removeEventListener(
        'click',
        handler
      );
    }
  };

  confirmBtn.addEventListener('click', handler);
}
