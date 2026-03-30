import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
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
  isLoggedIn = false;
  user: User | null = null;
  submitted = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Form data
  title = '';
  categoryId: number | null = null;
  selectedTagIds: number[] = [];
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;

  // Reference data
  categories: Category[] = [];
  tags: Tag[] = [];

  // Quill editor
  private quillEditor: any = null;
  private quillLoaded = false;

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUser();
    this.categories = this.categoryService.getCategories();
    this.loadTags();
  }

  ngAfterViewInit(): void {
    if (this.isLoggedIn) {
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
        this.tags = tags.filter(t => t.isAvailable);
      },
      error: () => {
        // Fallback - use empty tags
        this.tags = [];
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
        this.errorMessage = 'حجم الصورة يجب ألا يتجاوز 5 ميجابايت';
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        this.errorMessage = 'يُسمح فقط بصور JPG أو PNG أو WebP';
        return;
      }

      this.imageFile = file;
      this.errorMessage = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreviewUrl = null;
  }

  // ================= TAG HANDLING =================
  toggleTag(tagId: number): void {
    const idx = this.selectedTagIds.indexOf(tagId);
    if (idx > -1) {
      this.selectedTagIds.splice(idx, 1);
    } else {
      this.selectedTagIds.push(tagId);
    }
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTagIds.includes(tagId);
  }

  // ================= FORM VALIDATION =================
  get isFormValid(): boolean {
    const content = this.getEditorContent();
    return !!(
      this.title.trim() &&
      this.categoryId &&
      this.selectedTagIds.length > 0 &&
      this.imageFile &&
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
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const content = this.getEditorContent();

    this.articleService.addArticleUser(
      this.title,
      content,
      this.imageFile!,
      this.categoryId!,
      this.selectedTagIds
    ).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted = true;
        this.successMessage = 'تم إرسال مقالك بنجاح وهو بانتظار مراجعة الإدارة';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = typeof err === 'string' ? err : 'حدث خطأ أثناء إرسال المقال. يرجى المحاولة مرة أخرى.';
      }
    });
  }

  // ================= RESET FORM =================
  resetForm(): void {
    this.title = '';
    this.categoryId = null;
    this.selectedTagIds = [];
    this.imageFile = null;
    this.imagePreviewUrl = null;
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.quillEditor) {
      this.quillEditor.setContents([]);
    }
  }
}
