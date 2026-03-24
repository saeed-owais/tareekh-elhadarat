import { Component, inject } from '@angular/core';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  private bookService = inject(BookService);
  books = this.bookService.getBooks();
}
