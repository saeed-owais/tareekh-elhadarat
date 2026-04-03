import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-books-manage',
  standalone: true,
  imports: [CommonModule, RouterModule,RouterLink],
  templateUrl: './books-manage.component.html'
})
export class BooksManageComponent implements OnInit {
  // Books Data
  books = signal<Book[]>([]);
  isLoading = signal(false);
  
  // Pagination
  pageNumber = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(1);
  
  // Search
  searchQuery = signal('');
  
  // Delete State
  confirmDeleteId = signal<number | null>(null);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);
    const query = this.searchQuery().trim();
    
    const action = query 
      ? this.bookService.searchBooks(query, this.pageNumber(), this.pageSize())
      : this.bookService.getBooksAdmin(this.pageNumber(), this.pageSize());

    action.pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.books.set(response.data);
          this.totalItems.set(response.totalItems);
          this.totalPages.set(response.totalPages);
        },
        error: (err) => this.errorMessage.set(err)
      });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageNumber.set(page);
    this.loadBooks();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.pageNumber.set(1);
    this.loadBooks();
  }

  toggleDelete(id: number, event: Event) {
    event.stopPropagation();
    if (this.confirmDeleteId() === id) {
      this.confirmDeleteId.set(null);
    } else {
      this.confirmDeleteId.set(id);
    }
  }

  confirmDelete(id: number) {
    this.isLoading.set(true);
    this.bookService.deleteBook(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('تم حذف الكتاب بنجاح');
          this.confirmDeleteId.set(null);
          this.loadBooks();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => this.errorMessage.set(err)
      });
  }

  // Helper for Clean URLs as per backend behavior
  cleanUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.includes('/https://')) {
      return 'https://' + url.split('/https://')[1];
    }
    return url;
  }
}
