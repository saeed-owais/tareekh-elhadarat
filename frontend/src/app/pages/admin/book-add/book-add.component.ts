import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { finalize } from 'rxjs';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-book-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-add.component.html'
})
export class BookAddComponent {
  // Form Data
  title = signal('');
  author = signal('');
  pageCount = signal<number | null>(null);
  releaseDate = signal('');
  about = signal('');
  
  // File State
  posterFile = signal<File | null>(null);
  bookFile = signal<File | null>(null);
  posterPreview = signal<string | null>(null);
  
  // UI State
  isLoading = signal(false);
  isUploading = signal(false);
  uploadProgress = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  public ts: TranslationService = inject(TranslationService);

  constructor(
    private bookService: BookService,
    public router: Router
  ) {}

  onPosterSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.posterFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.posterPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onBookFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bookFile.set(file);
    }
  }

  async onSubmit() {
    if (!this.title() || !this.author() || !this.pageCount() || !this.releaseDate() || !this.about() || !this.posterFile() || !this.bookFile()) {
      this.errorMessage.set(this.ts.t('admin.bookAdd.requiredFieldsMsg'));
      return;
    }

    this.isLoading.set(true);
    this.isUploading.set(true);
    this.errorMessage.set('');
    this.uploadProgress.set(this.ts.t('admin.bookAdd.uploadingMsg'));

    try {
      this.uploadProgress.set(this.ts.t('admin.bookAdd.uploadingMsg'));

      // Send book data with the PDF file directly to backend
      const formData = new FormData();
      formData.append('Title', this.title());
      formData.append('Author', this.author());
      formData.append('PageCount', this.pageCount()!.toString());
      formData.append('ReleaseDate', this.releaseDate());
      formData.append('About', this.about());
      formData.append('Poster', this.posterFile()!, this.posterFile()!.name);
      formData.append('book', this.bookFile()!, this.bookFile()!.name);

      this.bookService.addBookAdmin(formData)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.isUploading.set(false);
            this.uploadProgress.set('');
            this.successMessage.set(this.ts.t('admin.bookAdd.successMsg'));
            setTimeout(() => this.router.navigate(['/admin/books']), 2000);
          },
          error: async (err) => {
            this.isUploading.set(false);
            this.uploadProgress.set('');
            this.errorMessage.set(err);
          }
        });

    } catch (error: any) {
      this.isLoading.set(false);
      this.isUploading.set(false);
      this.uploadProgress.set('');
      this.errorMessage.set(error.message || this.ts.t('admin.bookAdd.errorMsg'));
    }
  }
}
