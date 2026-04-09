import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { ArticleService } from '../../../../core/services/article.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article } from '../../../../core/models/article.model';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './admin-header.component.html',
})
export class AdminHeaderComponent {
  layoutService = inject(AdminLayoutService);
  profileService = inject(ProfileService);
  articleService = inject(ArticleService);
  elRef = inject(ElementRef);
  userProfile$ = this.profileService.getUserProfile();
  
  isMobileSearchOpen = signal(false);
  searchQuery = signal('');
  searchResults = signal<Article[]>([]);
  isSearching = signal(false);
  hasSearched = signal(false);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(query => {
        this.hasSearched.set(query.trim().length > 0);
        if (!query.trim()) {
          return of({ data: [] as Article[] });
        }
        this.isSearching.set(true);
        return this.articleService.searchArticles(query, 1, 6);
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: (res) => {
        this.searchResults.set(res.data);
        this.isSearching.set(false);
      },
      error: () => {
        this.isSearching.set(false);
        this.searchResults.set([]);
      }
    });
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.hasSearched.set(false);
    this.searchSubject.next('');
  }

  toggleMobileSearch() {
    this.isMobileSearchOpen.update(val => !val);
    if (!this.isMobileSearchOpen()) {
      this.clearSearch();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.searchResults.set([]);
      this.hasSearched.set(false);
    }
  }
}
