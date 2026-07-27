const modalRegistry: Record<string, Function> = {};

export function registerModal(id: string, handler: Function) {
  modalRegistry[id] = handler;
}

export function resolveModal(id: string) {
  return modalRegistry[id];
}