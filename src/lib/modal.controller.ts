const modals = new Map<string, HTMLElement>();
const modalState: Record<string, any> = {};

function register(id: string, el: HTMLElement) {
  modals.set(id, el);
}

function open(id: string, context?: any) {console.log('context from modal',context)
  const modal = modals.get(id) || document.getElementById(id);
  if (!modal) return;

  if (context?.from) {
    this.close(context.from);
  }

  modalState[id] = context;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function close(id: string) {
  const modal = modals.get(id) || document.getElementById(id);console.log('modal to closes',id,modal)
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function getContext(id: string) {
  return modalState[id];
}

function setHtmlText(id: string, dataset: string, html: string){
	const modal = modals.get(id) || document.getElementById(id);
  if (!(modal instanceof Element)) return;

	const elementM = modal.querySelector('['+dataset+']');
	if(!elementM) return;console.log('SetText',html,elementM)

	elementM.innerHTML =html;
}

function setContent(id: string, html: string) {
  const modal = modals.get(id) || document.getElementById(id);
  if (!modal) return;

  const container = modal.querySelector('[data-modal-content]');
  if (!container) return;

  container.innerHTML = html;
}

export const modalController = {
  register,
  open,
  close,
	setHtmlText,
  setContent,
  getContext,
};
