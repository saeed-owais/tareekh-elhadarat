import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type AppLang = 'ar' | 'en' | 'de';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<AppLang>('ar');
  isRtl = computed(() => this.currentLang() === 'ar');
  dir = computed(() => this.isRtl() ? 'rtl' : 'ltr');

  private translations = signal<Record<string, any>>({});
  private loaded = signal(false);

  /** Public read-only signal indicating whether translations have been loaded */
  isLoaded = computed(() => this.loaded());

  /** Resolvers for waiting on translation load */
  private loadResolvers: (() => void)[] = [];

  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);

  constructor(private http: HttpClient) {}

  init(): void {
    let lang: AppLang = 'ar';
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('app-lang') as AppLang | null;
      lang = saved && ['ar', 'en', 'de'].includes(saved) ? saved : 'ar';
    }
    this.setLang(lang);
  }

  setLang(lang: AppLang): void {
    this.currentLang.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('app-lang', lang);
    }
    this.applyDirToDocument(lang);
    this.loadTranslations(lang);
  }

  t(key: string, params?: Record<string, string>): string {
    const parts = key.split('.');
    let value: any = this.translations();
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return key; // fallback to key
      }
    }
    
    let result = typeof value === 'string' ? value : key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{{${k}}}`, v);
      });
    }

    return result;
  }

  private applyDirToDocument(lang: AppLang): void {
    const html = this.doc.documentElement;
    if (html) {
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }

  private loadTranslations(lang: AppLang): void {
    this.loaded.set(false);
    this.http.get<Record<string, any>>(`${environment.i18nPrefix}${lang}.json`).subscribe({
      next: (data) => {
        this.translations.set(data);
        this.loaded.set(true);
        // Resolve any waiting promises
        this.loadResolvers.forEach(resolve => resolve());
        this.loadResolvers = [];
      },
      error: (err) => {
        console.error(`Failed to load translations for ${lang}`, err);
      }
    });
  }

  /** Returns a Promise that resolves when translations are loaded */
  waitForTranslations(): Promise<void> {
    if (this.loaded()) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.loadResolvers.push(resolve);
    });
  }
}
