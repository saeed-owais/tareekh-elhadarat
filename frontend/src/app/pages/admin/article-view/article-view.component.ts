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

  changeStatus(newStatus: 'published' | 'draft' | 'pending' | 'rejected') {
    if (this.article()) {
       // Mock logic for status change if API not yet ready
       // this.article().isPublished = newStatus === 'published';
    }
  }
}
