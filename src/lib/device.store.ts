// src/lib/device.store.ts


export function initDevice() {
  let device = localStorage.getItem('device_hash');

  if (!device) {
    device = crypto.randomUUID();
    localStorage.setItem('device_hash', device);
    document.cookie = `device_hash=${device}; path=/; samesite=lax`;
  }

  return device;
}
