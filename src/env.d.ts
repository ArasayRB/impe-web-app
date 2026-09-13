/// <reference types="astro/client" />

import type { Site } from '@/lib/site';

declare global {
  namespace App {
    interface Locals {
      isPublicWebsite?: boolean;
      publicHost?: string;
      site: Site;
    }
  }
}
