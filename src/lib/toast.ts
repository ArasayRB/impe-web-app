// lib/toast.ts
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  duration: 3000,
  position: {
    x: 'right',
    y: 'top',
  },

  dismissible: true,

  types: [
    {
      type: 'success',
      background: '#16a34a',
    },
    {
      type: 'error',
      background: '#dc2626',
    },
  ],
});

export function showSuccess(message: string) {
  notyf.success(message);
}

export function showError(message: string) {
  notyf.error(message);
}

export function showInfo(message: string) {
  notyf.open({
    type: 'success',
    message,
  });
}
