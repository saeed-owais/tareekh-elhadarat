import { Component, inject, OnDestroy, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../core/services/scroll.service';
import { TranslationService, AppLang } from '../../core/services/translation.service';

import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  mobileMenuOpen = signal(false);
  searchOpen = signal(false);
  searchQuery = signal('');
  searchResults = signal<Article[]>([]);
  isSearching = signal(false);
  showResults = signal(false);
  langMenuOpen = signal(false);

  private eRef = inject(ElementRef);

  private authService = inject(AuthService);
  private router = inject(Router);
  private articleService = inject(ArticleService);
  public scrollService = inject(ScrollService);
  public ts = inject(TranslationService);
  public themeService = inject(ThemeService);

  private searchSubject = new Subject<string>();
  private searchSub: Subscription;

  constructor() {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query.trim()) {
          this.isSearching.set(false);
          this.showResults.set(false);
          return of([]);
        }
        this.isSearching.set(true);
        this.showResults.set(true);
        return this.articleService.searchArticles(query).pipe(
          map(response => response.data),
          catchError(() => of([]))
        );
      })
    ).subscribe(results => {
      this.searchResults.set(results.slice(0, 5)); // Limit to top 5 results for dropdown
      this.isSearching.set(false);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get user() {
    return this.authService.getUser();
  }

  get isAdmin(): boolean {
    const role = this.user?.role;
    return role === 'Admin' || role === 'admin';
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery());
  }

  onSearch(): void {
    this.viewAllResults();
  }

  toggleMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    if (this.mobileMenuOpen()) this.closeSearch();
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleSearch(): void {
    this.searchOpen.set(!this.searchOpen());
    if (this.searchOpen()) {
      this.mobileMenuOpen.set(false);
      setTimeout(() => document.getElementById('navbar-search-input')?.focus(), 100);
    } else {
      this.closeSearch();
    }
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.showResults.set(false);
    this.searchResults.set([]);
    this.searchQuery.set('');
  }

  goToArticle(id: number): void {
    this.closeSearch();
    this.router.navigate(['/articles', id]);
  }

  viewAllResults(): void {
    const query = this.searchQuery().trim();
    this.closeSearch();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/search']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  cleanUrl(url: string | null | undefined): string {
    if (!url || url === 'https://modawanty.runasp.net/') return 'assets/images/avatar-placeholder.png';
    
    if (url.includes('/https://')) {
      return 'https://' + url.split('/https://')[1];
    }
    return url;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.searchOpen()) {
      const targetElement = event.target as HTMLElement;
      const isInsideSearchOverlay = targetElement.closest('.search-overlay-container');
      const isSearchToggleBtn = targetElement.closest('.search-toggle-btn');
      
      if (!isInsideSearchOverlay && !isSearchToggleBtn) {
        this.closeSearch();
      }
    }
    // Close language menu when clicking outside
    if (this.langMenuOpen()) {
      const targetElement = event.target as HTMLElement;
      const isInsideLangMenu = targetElement.closest('.lang-menu-container');
      if (!isInsideLangMenu) {
        this.langMenuOpen.set(false);
      }
    }
  }

  toggleLangMenu(): void {
    this.langMenuOpen.set(!this.langMenuOpen());
  }

  switchLang(lang: AppLang): void {
    this.ts.setLang(lang);
    this.langMenuOpen.set(false);
  }
}
