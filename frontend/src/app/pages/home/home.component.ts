import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { SubscriberService } from '../../core/services/subscriber.service';
import { Article } from '../../core/models/article.model';
import { Category } from '../../core/models/category.model';

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

  featuredArticle = signal<Article | null>(null);
  latestArticles = signal<Article[]>([]);
  popularArticles = signal<Article[]>([]);
  categories = signal<Category[]>([]);
  books = this.bookService.getBooks();
  authors = this.authorService.getAuthors();

  isLoadingArticles = signal(true);

  // Arabic number labels for popular posts
  arabicNumbers = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '١٠'];

  subscriptionEmail = '';
  subscriptionMessage = '';
  subscriptionSuccess = false;

  ngOnInit(): void {
    this.loadCategories();
    this.loadSpecialArticle();
    this.loadNewestArticles();
    this.loadMostViewedArticles();
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

  onSubscribe(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput) {
      const result = this.subscriberService.subscribe(emailInput.value);
      this.subscriptionMessage = result.message;
      this.subscriptionSuccess = result.success;
      if (result.success) {
        emailInput.value = '';
      }
    }
  }
}
