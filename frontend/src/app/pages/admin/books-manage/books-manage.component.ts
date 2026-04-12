import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { TranslationService } from '../../../core/services/translation.service';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-books-manage',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './books-manage.component.html'
})
export class BooksManageComponent implements OnInit {
  // Books Data
  books = signal<Book[]>([]);
  isLoading = signal(false);
  
  // Pagination State
  pageNumber = signal(1);
  pageSize = signal(10);
  
  // Search & Sort State
  searchQuery = signal('');
  sortKey = signal<string>('title');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // 1. Filtered & Sorted books
  filteredBooks = computed(() => {
    let data = [...this.books()];
    const query = this.searchQuery().toLowerCase().trim();

    // Filter
    if (query) {
      data = data.filter(b => 
        b.title.toLowerCase().includes(query) || 
        b.author.toLowerCase().includes(query) ||
        (b.about && b.about.toLowerCase().includes(query))
      );
    }

    // Sort
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      data.sort((a: any, b: any) => {
        const valA = a[key] || '';
        const valB = b[key] || '';
        if (typeof valA === 'string') return valA.localeCompare(valB, 'ar') * dir;
        return (valA > valB ? 1 : -1) * dir;
      });
    }

    return data;
  });

  // 2. Paged results (Final display)
  pagedBooks = computed(() => {
    const start = (this.pageNumber() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredBooks().slice(start, end);
  });

  // Computed stats
  totalItems = computed(() => this.filteredBooks().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  
  // Delete State
  confirmDeleteId = signal<number | null>(null);
  successMessage = signal('');
  errorMessage = signal('');

  public ts: TranslationService = inject(TranslationService);

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading.set(true);
    // Fetch a large pool for client-side search/sort context
    this.bookService.getBooksAdmin(1, 1000)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => this.books.set(response.data),
        error: (err) => this.errorMessage.set(err)
      });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageNumber.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSort(key: string) {
    if (this.sortKey() === key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
    this.pageNumber.set(1); // Reset to first page on sort
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

  cleanUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.includes('/https://')) return 'https://' + url.split('/https://')[1];
    return url;
  }
}
