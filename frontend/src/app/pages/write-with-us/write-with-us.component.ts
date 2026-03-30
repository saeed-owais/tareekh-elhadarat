import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ArticleService } from '../../core/services/article.service';
import { CategoryService } from '../../core/services/category.service';
import { TagService } from '../../core/services/tag.service';
import { Category } from '../../core/models/category.model';
import { Tag } from '../../core/models/tag.model';
import { User } from '../../core/models/user.model';

declare const Quill: any;

@Component({
  selector: 'app-write-with-us',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './write-with-us.component.html',
  styleUrl: './write-with-us.component.css',
  encapsulation: ViewEncapsulation.None
})
export class WriteWithUsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  private authService = inject(AuthService);
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);

  // State
  isLoggedIn = signal(false);
  user = signal<User | null>(null);
  submitted = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Form data
  title = signal('');
  categoryId = signal<number | null>(null);
  selectedTagIds = signal<number[]>([]);
  imageFile = signal<File | null>(null);
  imagePreviewUrl = signal<string | null>(null);

  // Reference data
  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);

  // Quill editor
  private quillEditor: any = null;
  private quillLoaded = false;

  ngOnInit(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    this.user.set(this.authService.getUser());
    this.loadCategories();
    this.loadTags();
  }

  // ================= LOAD CATEGORIES =================
  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats.filter(c => c.isAvailable));
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isLoggedIn()) {
      this.loadQuill();
    }
  }

  ngOnDestroy(): void {
    if (this.quillEditor) {
      this.quillEditor = null;
    }
  }

  // ================= LOAD TAGS =================
  private loadTags(): void {
    this.tagService.getTags().subscribe({
      next: (tags) => {
        this.tags.set(tags.filter(t => t.isAvailable));
      },
      error: () => {
        // Fallback - use empty tags
        this.tags.set([]);
      }
    });
  }

  // ================= LOAD QUILL EDITOR =================
  private loadQuill(): void {
    if (this.quillLoaded) {
      this.initQuill();
      return;
    }

    // Load Quill CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
    document.head.appendChild(link);

    // Load Quill JS
    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js';
    script.onload = () => {
      this.quillLoaded = true;
      this.initQuill();
    };
    document.head.appendChild(script);
  }

  private initQuill(): void {
    if (!this.editorContainer?.nativeElement) {
      return;
    }

    setTimeout(() => {
      this.quillEditor = new Quill(this.editorContainer.nativeElement, {
        modules: {
          toolbar: '#quill-toolbar'
        },
        placeholder: 'ابدأ كتابة رحلتك المعرفية هنا...',
        theme: 'snow'
      });


      // ✅ default RTL + right align
      this.quillEditor.format('direction', 'rtl');
      this.quillEditor.format('align', 'right');
    }, 100);
  }

  // ================= IMAGE HANDLING =================
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage.set('حجم الصورة يجب ألا يتجاوز 5 ميجابايت');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        this.errorMessage.set('يُسمح فقط بصور JPG أو PNG أو WebP');
        return;
      }

      this.imageFile.set(file);
      this.errorMessage.set('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageFile.set(null);
    this.imagePreviewUrl.set(null);
  }

  // ================= TAG HANDLING =================
  toggleTag(tagId: number): void {
    const idx = this.selectedTagIds().indexOf(tagId);
    if (idx > -1) {
      this.selectedTagIds.update(tags => tags.filter(t => t !== tagId));
    } else {
      this.selectedTagIds.update(tags => [...tags, tagId]);
    }
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTagIds().includes(tagId);
  }

  // ================= FORM VALIDATION =================
  get isFormValid(): boolean {
    const content = this.getEditorContent();
    return !!(
      this.title().trim() &&
      this.categoryId() &&
      this.selectedTagIds().length > 0 &&
      this.imageFile() &&
      content && content.trim().length > 10
    );
  }

  private getEditorContent(): string {
    if (!this.quillEditor) return '';
    return this.quillEditor.root.innerHTML;
  }

  private getEditorTextLength(): number {
    if (!this.quillEditor) return 0;
    const text = this.quillEditor.getText().trim();
    return text.length;
  }

  // ================= SUBMIT =================
  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.isFormValid) {
      this.errorMessage.set('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage .set('');
    this.successMessage .set('');

    const content = this.getEditorContent();

    this.articleService.addArticleUser(
      this.title(),
      content,
      this.imageFile()!,
      this.categoryId()!,
      this.selectedTagIds()
    ).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(true);
        this.successMessage.set('تم إرسال مقالك بنجاح وهو بانتظار مراجعة الإدارة');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(typeof err === 'string' ? err : 'حدث خطأ أثناء إرسال المقال. يرجى المحاولة مرة أخرى.');
      }
    });
  }

  // ================= RESET FORM =================
  resetForm(): void {
    this.title.set('');
    this.categoryId.set(null);
    this.selectedTagIds.set([]);
    this.imageFile.set(null);
    this.imagePreviewUrl.set(null);
    this.submitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.quillEditor) {
      this.quillEditor.setContents([]);
    }
  }
}
