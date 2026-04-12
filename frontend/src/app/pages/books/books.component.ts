import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { finalize } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  public ts = inject(TranslationService);
  // Data
  books = signal<Book[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  
  // Pagination
  pageNumber = signal(1);
  pageSize = signal(12);
  totalPages = signal(1);
  totalItems = signal(0);

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);
    this.bookService.getBooksUser(this.pageNumber(), this.pageSize())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.books.set(response.data);
          this.totalPages.set(response.totalPages);
          this.totalItems.set(response.totalItems);
        },
        error: (err) => this.errorMessage.set(err)
      });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageNumber.set(page);
    this.loadBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cleanUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.includes('/https://')) {
      return 'https://' + url.split('/https://')[1];
    }
    return url;
  }
}
