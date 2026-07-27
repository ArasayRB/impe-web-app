type TwoFAErrorType =
  | 'INVALID_CODE'
  | 'EXPIRED'
  | 'LOCKED'
  | 'INVALID_SESSION'
  | 'UNKNOWN';
export function map2FAError(message: string): TwoFAErrorType {
  const msg = message.toLowerCase();

  if (msg.includes('invalid code')) return 'INVALID_CODE';

  if (
    msg.includes('expired') ||
    msg.includes('already used')
  ) return 'EXPIRED';

  if (msg.includes('too many attempts')) return 'LOCKED';

  if (
    msg.includes('invalid challenge') ||
    msg.includes('invalid 2fa') ||
    msg.includes('not enabled')
  ) return 'INVALID_SESSION';

  return 'UNKNOWN';
}