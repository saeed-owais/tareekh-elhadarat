import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit {
  book = signal<Book | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    public router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(Number(id));
    }
  }

  loadBook(id: number) {
    this.isLoading.set(true);
    this.bookService.getBookById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.book.set(data),
        error: (err) => this.errorMessage.set(err)
      });
  }

  cleanUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.includes('/https://')) {
      return 'https://' + url.split('/https://')[1];
    }
    return url;
  }
}
