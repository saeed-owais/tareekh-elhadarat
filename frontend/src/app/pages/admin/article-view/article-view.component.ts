import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../core/services/article.service';
import { AdminArticle } from '../../../core/models/article.model';

@Component({
  selector: 'app-admin-article-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './article-view.component.html'
})
export class AdminArticleViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);

  article = signal<AdminArticle | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle(id);
  }

  loadArticle(id: number): void {
    this.isLoading.set(true);
    this.articleService.loadArticleAdmin(id).subscribe({
      next: (article) => {
        this.article.set(article);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Placeholder for status management (Publish/Draft/Archive)
   * This can be expanded when background endpoints for individual status toggles are ready.
   */
  updateArticleStatus(newStatus: boolean) {
    if (!this.article()) return;
    
    // Simulate update for UI feedback
    const current = this.article()!;
    this.article.set({
      ...current,
      isPublished: newStatus
    });
    
    // In a real scenario, we would call this.articleService.toggleArticle(id) here
    console.log(`Status update requested: ${newStatus ? 'Publish' : 'Unpublish'}`);
  }
}
