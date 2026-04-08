import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { CommentService } from '../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { AddCommentRequest } from '../../core/models/add-comment.model';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private commentService = inject(CommentService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  article = signal<Article | null>(null);
  isLoading = signal(true);
  comments = signal<Comment[]>([]);
  isSaved = signal(false);
  isLoggedIn = signal(false);
  commentSubmitted = signal(false);
  commentForm!: FormGroup;

  private viewTimer : any = null;

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle(id);
    this.checkIfSaved(id);
    if (this.isLoggedIn()) {
      this.initForm();
    }
  }

  ngOnDestroy(): void {
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
    }
  }

  private loadArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article.set(article);
        this.isLoading.set(false);
        this.comments.set(this.commentService.getCommentsByPostId(article.id));

        // Mark as viewed after half of reading time (minutes * 60 * 1000 / 2)
        const delayMs = article.readTimeInMiniutes > 0 
          ? (article.readTimeInMiniutes * 60 * 1000) / 2 
          : 30000;

        this.viewTimer = setTimeout(() => {
          this.articleService.markArticleViewed(article.id).subscribe();
        }, delayMs);
      },
      error: () => {
        this.article.set(null);
        this.isLoading.set(false);
      }
    });
  }

  private checkIfSaved(id: number): void {
    this.profileService.getSavedArticles().subscribe({
      next: (articles) => {
        this.isSaved.set(articles.some(a => a.articleId === id));
      }
    });
  }

  toggleSave(): void {
    const article = this.article();
    if (!article) return;

    if (this.isSaved()) {
      this.profileService.removeSavedArticle(article.id).subscribe({
        next: () => this.isSaved.set(false)
      });
    } else {
      this.profileService.saveArticle(article.id).subscribe({
        next: () => this.isSaved.set(true)
      });
    }
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.article()) {
      const user = this.authService.getUser();
      if (!user || !user.id) return;

      const request: AddCommentRequest = {
        articleId: this.article()!.id,
        userId: user.id,
        content: this.commentForm.value.content
      };

      this.commentService.addComment(request).subscribe({
        next: () => {
          this.commentSubmitted.set(true);
          this.commentForm.reset();
        },
        error: (err) => {
          console.error('Comment error:', err);
        }
      });
    }
  }
}
