import { Component, inject, OnInit, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslationService } from './core/services/translation.service';
import { SeoService } from './core/services/seo.service';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'تاريخ الشعوب';
  private translationService = inject(TranslationService);
  private seoService = inject(SeoService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private currentSeoKey = 'home';

  constructor() {
    this.translationService.init();

    // Re-apply SEO metadata when language changes
    effect(() => {
      // Access currentLang to track the signal
      const lang = this.translationService.currentLang();
      if (lang) {
        this.updateSeo();
      }
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.currentSeoKey = data['seoKey'] || 'home';
      this.updateSeo();
    });
  }

  private updateSeo() {
    this.seoService.updateMetadataByKey(this.currentSeoKey);
  }
}
