import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages — prerendered at build time (generates real HTML for Google)
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'articles', renderMode: RenderMode.Prerender },
  { path: 'books', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'write-with-us', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  { path: 'search', renderMode: RenderMode.Prerender },

  // Dynamic and auth pages — client-side only
  { path: 'articles/:id', renderMode: RenderMode.Client },
  { path: 'books/:id', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: 'auth/**', renderMode: RenderMode.Client },
  { path: 'reset-password', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  // Catch-all fallback
  { path: '**', renderMode: RenderMode.Client }
];
