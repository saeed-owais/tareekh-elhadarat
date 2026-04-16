import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { finalize } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit {
  public ts = inject(TranslationService);
  private seoService = inject(SeoService);
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
        next: (data) => {
          this.book.set(data);
          this.seoService.updateMetadataByKey('bookDetail', {
            title: data.title,
            description: data.about?.substring(0, 160) + '...',
            image: data.poster
          });

          // Set JSON-LD structured data
          this.seoService.setJsonLd({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": data.title,
            "description": data.about?.substring(0, 160) + '...',
            "image": data.poster,
            "author": {
              "@type": "Person",
              "name": data.author
            },
            "publisher": {
              "@type": "Organization",
              "name": this.ts.t('site.name')
            },
            "datePublished": data.releaseDate,
            "numberOfPages": data.pageCount,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          });
        },
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
