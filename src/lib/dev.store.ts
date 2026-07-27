import { atom } from 'nanostores';

// Priority: 1. Var in .env (casted) o 2. Astro native mode
const rawDev = import.meta.env.PUBLIC_DEV ?? import.meta.env.DEV;
const isDevBool = String(rawDev).toLowerCase() === 'true' || rawDev === true || rawDev === '1';

export const devMode = atom(isDevBool);
