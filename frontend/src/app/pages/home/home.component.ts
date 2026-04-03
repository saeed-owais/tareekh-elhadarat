import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { SubscriberService } from '../../core/services/subscriber.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { Article } from '../../core/models/article.model';
import { Category } from '../../core/models/category.model';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private subscriberService = inject(SubscriberService);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);

  @ViewChild('categoriesSlider') categoriesSlider!: ElementRef<HTMLDivElement>;

  featuredArticle = signal<Article | null>(null);
  latestArticles = signal<Article[]>([]);
  popularArticles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  books = signal<Book[]>([]);
  authors = this.authorService.getAuthors();
  
  // Favorites
  savedArticleIds = signal<number[]>([]);
  isLoggedIn = signal(false);

  isLoadingArticles = signal(true);

  // Arabic number labels for popular posts
  arabicNumbers = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'];

  subscriptionEmail = signal('');
  subscriptionMessage = signal('');
  subscriptionSuccess = signal(false);

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    this.loadCategories();
    this.loadSpecialArticle();
    this.loadNewestArticles();
    this.loadMostViewedArticles();
    this.loadBooks();
    
    if (this.isLoggedIn()) {
      this.loadSavedArticles();
    }
  }

  private loadSavedArticles(): void {
    this.profileService.getSavedArticles().subscribe({
      next: (articles) => {
        this.savedArticleIds.set(articles.map(a => a.articleId));
      }
    });
  }

  toggleHeart(articleId: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.isLoggedIn()) return;

    if (this.savedArticleIds().includes(articleId)) {
      this.profileService.removeSavedArticle(articleId).subscribe({
        next: () => {
          this.savedArticleIds.update(ids => ids.filter(id => id !== articleId));
        }
      });
    } else {
      this.profileService.saveArticle(articleId).subscribe({
        next: () => {
          this.savedArticleIds.update(ids => [...ids, articleId]);
        }
      });
    }
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats.filter(c => c.isAvailable));
      }
    });
  }

  private loadSpecialArticle(): void {
    this.articleService.getSpecialArticle().subscribe({
      next: (article) => {
        this.featuredArticle.set(article);
      },
      error: () => {
        this.featuredArticle.set(null);
      }
    });
  }

  private loadNewestArticles(): void {
    this.articleService.getNewestArticles().subscribe({
      next: (articles) => {
        this.latestArticles.set(articles);
        this.isLoadingArticles.set(false);
      },
      error: () => {
        this.isLoadingArticles.set(false);
      }
    });
  }

  private loadMostViewedArticles(): void {
    this.articleService.getMostViewedArticles().subscribe({
      next: (articles) => {
        this.popularArticles.set(articles);
      }
    });
  }

  private loadBooks(): void {
    this.bookService.getBooksUser(1, 4).subscribe({
      next: (response) => {
        this.books.set(response.data);
      }
    });
  }

  scrollCategories(direction: 'left' | 'right'): void {
    const el = this.categoriesSlider?.nativeElement;
    if (!el) return;
    const scrollAmount = 200;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  onSubscribe(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput) {
      const result = this.subscriberService.subscribe(emailInput.value);
      this.subscriptionMessage.set(result.message);
      this.subscriptionSuccess.set(result.success);
      if (result.success) {
        emailInput.value = '';
        this.subscriptionEmail.set('');
      } else {
        this.subscriptionEmail.set(emailInput.value);
      }
    }
  }
}
