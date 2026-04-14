import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type AppLang = 'ar' | 'en' | 'de';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<AppLang>('ar');
  isRtl = computed(() => this.currentLang() === 'ar');
  dir = computed(() => this.isRtl() ? 'rtl' : 'ltr');

  private translations = signal<Record<string, any>>({});
  private loaded = signal(false);

  constructor(private http: HttpClient) {}

  init(): void {
    const saved = localStorage.getItem('app-lang') as AppLang | null;
    const lang = saved && ['ar', 'en', 'de'].includes(saved) ? saved : 'ar';
    this.setLang(lang);
  }

  setLang(lang: AppLang): void {
    this.currentLang.set(lang);
    localStorage.setItem('app-lang', lang);
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
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  private loadTranslations(lang: AppLang): void {
    this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations.set(data);
        this.loaded.set(true);
      },
      error: (err) => {
        console.error(`Failed to load translations for ${lang}`, err);
      }
    });
  }
}
