import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap, map } from 'rxjs';
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
  private router = inject(Router);
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
  selectedTagIds = signal<number[]>([]);

  private quillEditor: any = null;
  private quillLoaded = false;
  private lastFetchedArticle: any = null;

  ngOnInit() {
    this.articleId.set(Number(this.route.snapshot.paramMap.get('id')));
    const id = this.articleId();

    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    // Step 1: Get Article Data First
    this.articleService.loadArticleAdmin(id).pipe(
      // Step 2: Use Article Data to initiate Metadata fetch
      switchMap(article => forkJoin({
        article: of(article),
        categories: this.categoryService.getCategories(),
        tags: this.tagService.getTags()
      }))
    ).subscribe({
      next: (res: any) => {
        const article: AdminArticle = res.article;
        this.lastFetchedArticle = article;
        const allCategories = res.categories;
        const allTags = res.tags;

        // Populate metadata signals
        this.categories.set(allCategories);
        this.tags.set(allTags);

        // Populate article basic signals
        this.title.set(article.title || article.title || '');
        this.authorName.set(article.authorName || article.authorName || '');
        this.status.set(article.isPublished ? 'published' : 'pending');
        this.imagePreviewUrl.set(article.imageUrl || article.imageUrl);

        // Step 3: Resolve Category and Tags from Article Data

        // Resolve Category (check ID then Name)
        // Resolve Category (check ID then Name)
        const targetCatId = article.categoryId;
        const targetCatName = article.category;
        let selectedCat = null;
        if (targetCatId) selectedCat = allCategories.find((c: any) => c.id === targetCatId);
        if (!selectedCat && targetCatName) selectedCat = allCategories.find((c: any) => c.name === targetCatName);
        if (selectedCat) this.categoryId.set(selectedCat.id);

        // Resolve Tags
        let selectedIds: number[] = article.articleTagsIds || [];
        if (selectedIds.length === 0 && article.tags && article.tags.length > 0) {
          // Handle array of objects (from the new JSON format) or strings
          if (typeof article.tags[0] === 'object') {
            selectedIds = article.tags.map((t: any) => t.id).filter(id => id !== undefined);
          } else {
            selectedIds = allTags
              .filter((t: any) => (article.tags as any[]).includes(t.name))
              .map((t: any) => t.id);
          }
        }
        this.selectedTagIds.set(selectedIds);

        // Handle content (Quill)
        if (this.quillEditor) {
          const content = article.content || '';
          this.quillEditor.clipboard.dangerouslyPasteHTML(content);
          this.quillEditor.blur();
        }

        this.isLoading.set(false);
        setTimeout(() => window.scrollTo(0, 0), 100);
      },
      error: (err) => {
        this.errorMessage.set('فشل تحميل بيانات المقال');
        this.isLoading.set(false);
        console.error(err);
      }
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
      if (this.lastFetchedArticle) {
        const content = this.lastFetchedArticle.content || this.lastFetchedArticle.Content || '';
        this.quillEditor.clipboard.dangerouslyPasteHTML(content);
        this.quillEditor.blur();
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
        setTimeout(() => {
          this.router.navigate(['/admin/articles']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err);
      }
    });
  }
}
