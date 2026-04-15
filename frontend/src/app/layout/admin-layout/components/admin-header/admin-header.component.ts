import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { AppLang, TranslationService } from '../../../../core/services/translation.service';
import { RouterModule, Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { ArticleService } from '../../../../core/services/article.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, map, catchError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article } from '../../../../core/models/article.model';

import { ThemeService } from '../../../../core/services/theme.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule, AsyncPipe, CommonModule, FormsModule],
  templateUrl: './admin-header.component.html',
})
export class AdminHeaderComponent {
  layoutService = inject(AdminLayoutService);
  profileService = inject(ProfileService);
  articleService = inject(ArticleService);
  elRef = inject(ElementRef);
  public ts: TranslationService = inject(TranslationService);
  public themeService = inject(ThemeService);
  private router = inject(Router);
  userProfile$ = this.profileService.getUserProfile();

  isMobileSearchOpen = signal(false);
  searchQuery = signal('');
  searchResults = signal<Article[]>([]);
  isSearching = signal(false);
  showResults = signal(false);
  langMenuOpen = signal(false);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
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
      }),
      takeUntilDestroyed()
    ).subscribe(results => {
      this.searchResults.set(results.slice(0, 5));
      this.isSearching.set(false);
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery());
  }

  clearSearch() {
    this.showResults.set(false);
    this.searchResults.set([]);
    this.searchQuery.set('');
    this.searchSubject.next('');
  }

  toggleMobileSearch() {
    this.isMobileSearchOpen.update(val => !val);
    if (!this.isMobileSearchOpen()) {
      this.clearSearch();
    }
  }

  toggleLangMenu() {
    this.langMenuOpen.update(v => !v);
  }

  switchLang(lang: AppLang) {
    this.ts.setLang(lang);
    this.langMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.searchResults.set([]);
      this.showResults.set(false);
    }
  }

  cleanUrl(url: string | null | undefined): string {
    if (!url || url === environment.apiBaseUrl + '/') return 'assets/images/avatar-placeholder.png';
    
    if (url.includes('/https://')) {
      return 'https://' + url.split('/https://')[1];
    }
    return url;
  }

  viewAllResults(): void {
    const query = this.searchQuery().trim();
    this.clearSearch();
    this.isMobileSearchOpen.set(false);
    
    if (query) {
      this.router.navigate(['/admin/articles'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/admin/articles']);
    }
  }
}
