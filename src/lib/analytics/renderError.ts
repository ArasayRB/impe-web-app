export function renderError(
  root: HTMLElement,
  error: any
) {

  root.innerHTML = `
    <div
      class="
        p-4 pt-16
        bg-red-50
        border
        border-red-200
        rounded-lg
      "
    >
      <h3
        class="
          text-red-700
          font-semibold
        "
      >
        Error
      </h3>

      <p class="mt-2 text-red-600">
        ${
          error?.message ||
          'Unexpected error'
        }
      </p>
    </div>
  `;
}