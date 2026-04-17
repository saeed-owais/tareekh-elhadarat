import { Component, inject, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
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
import { ScrollService } from '../../core/services/scroll.service';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

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
  private scrollService = inject(ScrollService);
  public ts = inject(TranslationService);
  private seoService = inject(SeoService);

  article = signal<Article | null>(null);
  isLoading = signal(true);
  comments = signal<Comment[]>([]);
  isSaved = signal(false);
  isLoggedIn = signal(false);
  commentSubmitted = signal(false);
  showCopiedMessage = signal(false);
  commentForm!: FormGroup;

  private viewTimer: any = null;

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
    this.scrollService.resetProgress();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const current = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Find the article element
    const content = document.querySelector('.article-content') as HTMLElement;
    if (!content) return;

    const rect = content.getBoundingClientRect();
    const contentTop = rect.top + current;
    const contentHeight = content.offsetHeight;
    
    // The progress should start when the content is near the top of the viewport
    // and reach 100% when the bottom of the content reached the bottom of the viewport
    const start = contentTop - 100;
    const end = contentTop + contentHeight - 150;

    let progress = 0;
    if (current > start) {
      progress = ((current - start) / (end - start)) * 100;
    }
    
    // Safeguard against NaN or Infinity
    if (isNaN(progress) || !isFinite(progress)) progress = 0;
    

    this.scrollService.updateProgress(Math.min(100, Math.max(0, progress)));
  }

  private loadArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article.set(article);
        this.isLoading.set(false);

        // Update SEO Metadata
        const plainDescription = article.content 
          ? article.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
          : '';
        
        this.seoService.updateMetadataByKey('articleDetail', {
          title: article.title,
          description: plainDescription,
          image: article.imageUrl
        });

        // Set JSON-LD structured data
        this.seoService.setJsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": plainDescription,
          "image": article.imageUrl,
          "author": {
            "@type": "Organization",
            "name": this.ts.t('site.name')
          },
          "publisher": {
            "@type": "Organization",
            "name": this.ts.t('site.name'),
            "logo": {
              "@type": "ImageObject",
              "url": window.location.origin + "/assets/images/logo.png"
            }
          },
          "datePublished": new Date().toISOString(), // Fallback if no specific date
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          }
        });

        // Populate comments from the article object itself if available
        if (article.comments) {
          this.comments.set(article.comments);
        }

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
      content: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
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

  share(platform: string): void {
    const article = this.article();
    if (!article) return;

    const url = window.location.href;
    const text = article.title;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
          text
        )}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }

  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.showCopiedMessage.set(true);
      setTimeout(() => this.showCopiedMessage.set(false), 2000);
    });
  }

  nativeShare(): void {
    if (navigator.share) {
      const article = this.article();
      if (!article) return;
      navigator.share({
        title: article.title,
        text: article.title,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error));
    } else {
      this.copyLink();
    }
  }

  printArticle(): void {
    window.print();
  }
}
