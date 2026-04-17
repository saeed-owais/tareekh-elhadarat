import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslationService } from './translation.service';

/**
 * Hardcoded fallback SEO data for when translations haven't loaded yet.
 * This prevents raw translation keys (e.g., "seo.articlesTitleseo.titleSuffix")
 * from appearing in Google's index.
 */
const SEO_FALLBACKS: Record<string, { title: string; desc: string }> = {
  home: {
    title: 'تاريخ الشعوب | منصة للوعي الحضاري المعاصر',
    desc: 'منصة تاريخ الشعوب هي مشروع رقمي متكامل لاستكشاف التاريخ الإنساني والحضارات والموروث الثقافي العالمي عبر مقالات وبحوث موثقة.'
  },
  articles: {
    title: 'المقالات - استكشاف الحضارات | تاريخ الشعوب',
    desc: 'تصفح أحدث المقالات الفكرية والبحوث التاريخية المتخصصة في مختلف العصور والحضارات الإنسانية.'
  },
  books: {
    title: 'المكتبة الرقمية - كنوز المعرفة | تاريخ الشعوب',
    desc: 'استكشف مكتبتنا الرقمية التي تضم مجموعة مختارة من الكتب التاريخية والمخطوطات النادرة للتحميل والقراءة.'
  },
  about: {
    title: 'من نحن - رؤيتنا ورسالتنا | تاريخ الشعوب',
    desc: 'تعرف على رؤية منصة تاريخ الشعوب وأهدافها في تعزيز الوعي الحضاري والثقافي وبناء جسور المعرفة.'
  },
  contact: {
    title: 'تواصل معنا - استفسارات واقتراحات | تاريخ الشعوب',
    desc: 'يسعدنا تواصلكم معنا للاستفسارات والمقترحات حول منصة تاريخ الشعوب وفريق عملنا.'
  },
  writeWithUs: {
    title: 'اكتب معنا - انضم لكتابنا | تاريخ الشعوب',
    desc: 'انضم إلى فريق كتابنا وشارك أفكارك وبحوثك التاريخية مع جمهور مهتم بالوعي الحضاري والفكري.'
  },
  search: {
    title: 'نتائج البحث | تاريخ الشعوب',
    desc: 'ابحث في محتوى منصة تاريخ الشعوب عن المقالات والكتب والمواضيع التاريخية التي تهمك.'
  },
  profile: {
    title: 'الملف الشخصي | تاريخ الشعوب',
    desc: 'إدارة ملفك الشخصي ومتابعة نشاطاتك ومقالاتك المفضلة ومساهماتك في المنصة.'
  },
  terms: {
    title: 'الشروط والأحكام والخصوصية | تاريخ الشعوب',
    desc: 'اطلع على الشروط والأحكام وسياسة الخصوصية المنظمة لاستخدام منصة تاريخ الشعوب وحقوقك.'
  },
  login: {
    title: 'تسجيل الدخول | تاريخ الشعوب',
    desc: 'سجل دخولك إلى حسابك في منصة تاريخ الشعوب للوصول إلى ميزاتك الخاصة ومكتبتك الشخصية.'
  },
  register: {
    title: 'إنشاء حساب جديد | تاريخ الشعوب',
    desc: 'أنشئ حساباً جديداً في منصة تاريخ الشعوب وانضم إلى مجتمع الوعي الحضاري والثقافي.'
  },
  articleDetail: {
    title: 'مقال | تاريخ الشعوب',
    desc: 'اقرأ المقال الفكري والتاريخي على منصة تاريخ الشعوب.'
  },
  bookDetail: {
    title: 'كتاب | تاريخ الشعوب',
    desc: 'تفاصيل الكتاب على منصة تاريخ الشعوب.'
  }
};

const SITE_URL = 'https://tareekhalshuob.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_KEYWORDS = 'تاريخ الشعوب, Tareekh Alshuob, Geschichte der Völker, تاريخ, حضارات, ثقافة, كتب متنوعة, مقالات فكرية, بحوث تاريخية, موروث شعبي, موروث عالمي, تاريخ إنساني';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private translationService = inject(TranslationService);

  /** Safely get current URL, returns SITE_URL as fallback during prerendering */
  private getCurrentUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.href;
    }
    return SITE_URL + '/';
  }

  updateMetadata(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
  }) {
    const defaultTitle = this.safeTranslate('seo.homeTitle', SEO_FALLBACKS['home'].title);
    const defaultDesc = this.safeTranslate('seo.homeDesc', SEO_FALLBACKS['home'].desc);
    const finalTitle = config.title || defaultTitle;
    const finalDesc = config.description || defaultDesc;

    this.titleService.setTitle(finalTitle);

    const currentUrl = config.url || this.getCurrentUrl();
    const ogImage = config.image || DEFAULT_OG_IMAGE;
    // Ensure absolute URL for OG image
    const absoluteImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}/${ogImage}`;

    const tags = [
      { name: 'description', content: finalDesc },
      { name: 'keywords', content: config.keywords || this.safeTranslate('site.keywords', DEFAULT_KEYWORDS) },
      
      // Open Graph
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: finalDesc },
      { property: 'og:image', content: absoluteImage },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: config.type || 'website' },
      { property: 'og:site_name', content: 'تاريخ الشعوب' },
      { property: 'og:locale', content: this.getOgLocale() },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: finalDesc },
      { name: 'twitter:image', content: absoluteImage }
    ];

    tags.forEach(tag => {
      this.metaService.updateTag(tag as any);
    });

    this.updateCanonicalURL(currentUrl);
    this.updateHreflangTags();
    this.updateWebsiteSchema();
  }

  /**
   * Safely translate a key, returning the fallback if the translation
   * hasn't loaded yet (returns the raw key).
   */
  private safeTranslate(key: string, fallback: string): string {
    const result = this.translationService.t(key);
    // If the result equals the key, translations haven't loaded yet — use fallback
    if (result === key) {
      return fallback;
    }
    return result;
  }

  /**
   * Get OG locale based on current language.
   */
  private getOgLocale(): string {
    const lang = this.translationService.currentLang();
    const localeMap: Record<string, string> = { ar: 'ar_AR', en: 'en_US', de: 'de_DE' };
    return localeMap[lang] || 'ar_AR';
  }

  /**
   * Updates metadata using a translation key from the 'seo' object in i18n files.
   * @param seoKey The key (e.g., 'home', 'articles')
   * @param customData Optional custom data to override or complement localized strings
   */
  updateMetadataByKey(seoKey: string, customData?: { title?: string; description?: string; image?: string; url?: string }) {
    const fallback = SEO_FALLBACKS[seoKey] || SEO_FALLBACKS['home'];

    const localizedTitle = this.safeTranslate(`seo.${seoKey}Title`, fallback.title);
    const localizedDesc = this.safeTranslate(`seo.${seoKey}Desc`, fallback.desc);
    const titleSuffix = this.safeTranslate('seo.titleSuffix', ' | تاريخ الشعوب');

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

  updateHreflangTags() {
    const langs = ['ar', 'en', 'de'];
    const currentUrl = this.getCurrentUrl().split('?')[0];

    // Remove existing hreflang tags
    const existingTags = this.document.querySelectorAll('link[hreflang]');
    existingTags.forEach(tag => this.document.head.removeChild(tag));

    // Add new ones
    langs.forEach(lang => {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', currentUrl); // Since paths are currently not language-prefixed
      this.document.head.appendChild(link);
    });

    // Add x-default (using Arabic as default)
    const xDefault = this.document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', currentUrl);
    this.document.head.appendChild(xDefault);
  }

  updateWebsiteSchema() {
    const lang = this.translationService.currentLang();
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "تاريخ الشعوب",
      "alternateName": ["Tareekh Alshuob", "History of Peoples", "Geschichte der Völker", "تاريخ الشعوب - منصة للوعي الحضاري المعاصر"],
      "url": `${SITE_URL}/`,
      "description": "منصة تاريخ الشعوب لاستكشاف التاريخ الإنساني والحضارات والموروث الثقافي العالمي.",
      "inLanguage": lang,
      "publisher": {
        "@type": "Organization",
        "name": "تاريخ الشعوب",
        "url": `${SITE_URL}/`,
        "logo": {
          "@type": "ImageObject",
          "url": DEFAULT_OG_IMAGE
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    this.setJsonLd(schema);
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
