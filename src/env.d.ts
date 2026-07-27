/// <reference types="astro/client" />

// https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
import type { Site } from '@/lib/site';

declare namespace App {
  interface Locals {
    site: Site;
  }
}