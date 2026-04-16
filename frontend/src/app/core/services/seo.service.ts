import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private translationService = inject(TranslationService);

  updateMetadata(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
  }) {
    const defaultTitle = this.translationService.t('seo.homeTitle');
    const defaultDesc = this.translationService.t('seo.homeDesc');
    const defaultImage = 'assets/images/logo.png';
    const finalTitle = config.title || defaultTitle;
    const finalDesc = config.description || defaultDesc;

    this.titleService.setTitle(finalTitle);

    const tags = [
      { name: 'description', content: finalDesc },
      { name: 'keywords', content: config.keywords || this.translationService.t('site.keywords') || 'history, civilizations, culture, books, articles' },
      
      // Open Graph
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: finalDesc },
      { property: 'og:image', content: config.image || defaultImage },
      { property: 'og:url', content: config.url || window.location.href },
      { property: 'og:type', content: config.type || 'website' },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: finalDesc },
      { name: 'twitter:image', content: config.image || defaultImage }
    ];

    tags.forEach(tag => {
      this.metaService.updateTag(tag as any);
    });

    this.updateCanonicalURL(config.url || window.location.href);
    this.clearJsonLd();
  }

  /**
   * Updates metadata using a translation key from the 'seo' object in i18n files.
   * @param seoKey The key (e.g., 'home', 'articles')
   * @param customData Optional custom data to override or complement localized strings
   */
  updateMetadataByKey(seoKey: string, customData?: { title?: string; description?: string; image?: string; url?: string }) {
    const localizedTitle = this.translationService.t(`seo.${seoKey}Title`);
    const localizedDesc = this.translationService.t(`seo.${seoKey}Desc`);
    const titleSuffix = this.translationService.t('seo.titleSuffix');

    let title = customData?.title || localizedTitle;
    
    // Append suffix if it's not the home page and not already present
    if (seoKey !== 'home' && !title.includes(titleSuffix)) {
      title = `${title}${titleSuffix}`;
    }

    this.updateMetadata({
      title,
      description: customData?.description || localizedDesc,
      image: customData?.image,
      url: customData?.url
    });
  }

  updateCanonicalURL(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setJsonLd(schema: any) {
    let script = this.document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  clearJsonLd() {
    const script = this.document.querySelector('script[type="application/ld+json"]');
    if (script) {
      this.document.head.removeChild(script);
    }
  }
}
