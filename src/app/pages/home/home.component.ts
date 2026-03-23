import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PostService } from '../../core/services/post.service';
import { CategoryService } from '../../core/services/category.service';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { SubscriberService } from '../../core/services/subscriber.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private postService = inject(PostService);
  private categoryService = inject(CategoryService);
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private subscriberService = inject(SubscriberService);

  featuredPost = this.postService.getFeaturedPost();
  latestPosts = this.postService.getLatestPosts();
  popularPosts = this.postService.getPopularPosts();
  categories = this.categoryService.getCategories();
  books = this.bookService.getBooks();
  authors = this.authorService.getAuthors();

  // Arabic number labels for popular posts
  arabicNumbers = ['١', '٢', '٣', '٤'];

  subscriptionEmail = '';
  subscriptionMessage = '';
  subscriptionSuccess = false;

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
