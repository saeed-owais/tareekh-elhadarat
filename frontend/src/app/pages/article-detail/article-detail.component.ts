import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../core/models/article.model';
import { CommentService } from '../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';

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
  private fb = inject(FormBuilder);

  article = signal<Article | null>(null);
  isLoading = signal(true);
  comments = signal<Comment[]>([]);
  commentForm!: FormGroup;

  private viewTimer : any = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle(id);
    this.initForm();
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

        // Mark as viewed after 30 seconds
        this.viewTimer = setTimeout(() => {
          this.articleService.markArticleViewed(article.id).subscribe();
        }, 30000);
      },
      error: () => {
        this.article.set(null);
        this.isLoading.set(false);
      }
    });
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      authorName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.article) {
      const formValue = this.commentForm.value;
      this.commentService.addComment({
        postId: this.article()!.id,
        authorName: formValue.authorName,
        email: formValue.email,
        content: formValue.content
      });
      // Refresh comments
      this.comments.set(this.commentService.getCommentsByPostId(this.article()!.id));
      this.commentForm.reset();
    } else {
      Object.keys(this.commentForm.controls).forEach(key => {
        this.commentForm.get(key)?.markAsTouched();
      });
    }
  }
}
