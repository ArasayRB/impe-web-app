export interface Site {
  id: number;
  url:string;
  slug: string;
  locale: string;
  title?: string;
  logo?: string;

  domain?: string;
  subdomain?: string | null;
}

/**
 * Sites disponibles en LOCAL
 * (en prod vendrán del backend)
 */
export const LOCAL_SITES: Site[] = [
  {
    id: 1,
    url:'test.ijoba.com',
    slug: 'peluqueria-corte-moderno',
    locale:'es',
    title: '',
    logo: null
  },
  {
    id: 2,
    url:'empresa-1.ijoba.com',
    slug: 'empresa1',
    locale:'es',
    title: 'Empresa 1',
    logo: null
  },
];
