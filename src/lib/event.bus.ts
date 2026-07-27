const listeners: Record<string, Function[]> = {};

export function emit(event: string, payload: any) {
  (listeners[event] || []).forEach((fn) => fn(payload));
}

export function on(event: string, fn: Function) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(fn);
}