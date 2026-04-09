import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { StatisticsService } from '../../../core/services/statistics.service';
import { Article } from '../../../core/models/article.model';
import { finalize, forkJoin, of, catchError } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  // Stats Signals
  usersCount = signal(0);
  articlesCount = signal(0);
  booksCount = signal(0);
  commentsCount = signal(0);
  viewsCount = signal(0);
  
  // Lists Signals
  mostViewedArticles = signal<Article[]>([]);
  newestArticles = signal<Article[]>([]);
  
  isLoading = signal(false);

  constructor(
    private statsService: StatisticsService,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading.set(true);
    
    // Fetch all counts in parallel with individual error resilience
    forkJoin({
      users: this.statsService.getUsersCount().pipe(catchError(() => of(0))),
      articles: this.statsService.getArticlesCount().pipe(catchError(() => of(0))),
      books: this.statsService.getBooksCount().pipe(catchError(() => of(0))),
      comments: this.statsService.getCommentsCount().pipe(catchError(() => of(0))),
      views: this.statsService.getViewsCount().pipe(catchError(() => of(0))),
      mostViewed: this.articleService.getMostViewedArticles().pipe(catchError(() => of([]))),
      newest: this.articleService.getNewestArticles().pipe(catchError(() => of([])))
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        this.usersCount.set(data.users);
        this.articlesCount.set(data.articles);
        this.booksCount.set(data.books);
        this.commentsCount.set(data.comments);
        this.viewsCount.set(data.views);
        this.mostViewedArticles.set(data.mostViewed);
        this.newestArticles.set(data.newest);
      },
      error: (err) => console.error('Dashboard fatal error:', err)
    });
  }

  // Helper for Clean URLs if needed (though articles are usually handled by service)
  formatLargeNumber(num: number | undefined | null): string {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  }
}
