export function logInfo(message: string, meta?: any) {
  console.log(
    `[CLIENT] ${message}`,
    meta || {}
  );
}

export function logError(message: string, meta?: any) {
  console.error(
    `[CLIENT ERROR] ${message}`,
    meta || {}
  );
}
