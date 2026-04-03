import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { ArticleService } from '../../../core/services/article.service';
import { Category } from '../../../core/models/category.model';
import { Tag } from '../../../core/models/tag.model';
import { AdminArticle } from '../../../core/models/article.model';

declare const Quill: any;

@Component({
  selector: 'app-admin-article-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './article-edit.component.html'
})
export class AdminArticleEditComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);

  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  articleId = signal<number | null>(null);
  title = signal('');
  authorName = signal('');
  categoryId = signal<number | null>(null);
  status = signal('published');
  isSubmitting = signal(false);
  isLoading = signal(true);
  errorMessage = signal('');
  successMessage = signal('');
  imagePreviewUrl = signal<string | null>(null);
  imageFile = signal<File | null>(null);

  isCategoryDropdownOpen = signal(false);

  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);
  selectedTagIds = signal<number[]>([1, 2]);

  private quillEditor: any = null;
  private quillLoaded = false;

  ngOnInit() {
    this.articleId.set(Number(this.route.snapshot.paramMap.get('id')));
    this.loadMetadata();
    if (this.articleId()) {
      this.loadArticle(this.articleId()!);
    }
  }

  loadArticle(id: number) {
    this.isLoading.set(true);
    this.articleService.loadArticleAdmin(id).subscribe({
      next: (article) => {
        this.title.set(article.title);
        this.authorName.set(article.authorName);
        this.categoryId.set(null); // API might not have categoryId, we'll need to figure that out
        this.status.set(article.isPublished ? 'published' : 'pending');
        this.imagePreviewUrl.set(article.imageUrl);
        
        if (this.quillEditor) {
          this.quillEditor.clipboard.dangerouslyPasteHTML(article.content);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  loadMetadata() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error(err)
    });
    
    this.tagService.getTags().subscribe({
      next: (data) => this.tags.set(data),
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit(): void {
    this.loadQuill();
  }

  ngOnDestroy(): void {
    if (this.quillEditor) {
      this.quillEditor = null;
    }
  }

  getCategoryName(id: number | null): string {
    if (!id) return '';
    return this.categories().find(c => c.id === id)?.name || '';
  }

  selectCategory(id: number): void {
    this.categoryId.set(id);
    this.isCategoryDropdownOpen.set(false);
  }

  toggleCategoryDropdown(event: Event): void {
    event.stopPropagation();
    this.isCategoryDropdownOpen.update(v => !v);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageFile.set(file);
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

  getContent(): string {
    return this.quillEditor ? this.quillEditor.root.innerHTML : '';
  }

  private loadQuill(): void {
    if (this.quillLoaded) {
      this.initQuill();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js';
    script.onload = () => {
      this.quillLoaded = true;
      this.initQuill();
    };
    document.head.appendChild(script);
  }

  private initQuill(): void {
    if (!this.editorContainer?.nativeElement) return;
    setTimeout(() => {
      this.quillEditor = new Quill(this.editorContainer.nativeElement, {
        modules: { toolbar: '#quill-toolbar' },
        placeholder: 'اكتب محتوى المقال...',
        theme: 'snow'
      });
      this.quillEditor.format('direction', 'rtl');
      this.quillEditor.format('align', 'right');
      
      // If article already loaded, paste its content
      if (this.title()) {
          // This is a bit tricky, but since loadArticle might finish before quill init
          // Or quill init might finish before loadArticle
          // But usually we just want to ensure if article data is there, it's pasted
          // In loadArticle we call it if editor is ready.
          // Here we call it if data is ready.
          this.loadArticle(this.articleId()!);
      }
    }, 100);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const id = this.articleId();
    if (!id || this.isSubmitting()) return;
    
    if (!this.title() || !this.authorName() || !this.getContent()) {
        this.errorMessage.set('يرجى إكمال جميع الحقول المطلوبة');
        return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.articleService.editArticleAdmin(
        id,
        this.title(),
        this.authorName(),
        this.getContent(),
        this.imageFile(),
        this.categoryId(),
        this.selectedTagIds(),
        this.status() === 'published'
    ).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set('تم حفظ المقال بنجاح!');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err);
      }
    });
  }
}
