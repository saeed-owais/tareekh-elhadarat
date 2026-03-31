import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery = signal(''); // Input value
  currentQuery = signal(''); // Query we are showing results for
  articles = signal<Article[]>([]);
  isLoading = signal(false);

  // Pagination state
  currentPage = signal(1);
  pageSize = 9;

  paginatedArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.articles().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.articles().length / this.pageSize));

  pageNumbers = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  private queryParamsSub!: Subscription;

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      if (q) {
        this.searchQuery.set(q);
        this.currentQuery.set(q);
        this.performSearch(q);
      } else {
        this.searchQuery.set('');
        this.currentQuery.set('');
        this.articles.set([]);
      }
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSub?.unsubscribe();
  }

  private performSearch(query: string) {
    console.log("query", query);

    this.isLoading.set(true);
    this.currentPage.set(1);
    this.articleService.searchArticles(query).subscribe({
      next: (results) => {
        console.log("results", results);

        this.articles.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.articles.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onSearchSubmit() {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
