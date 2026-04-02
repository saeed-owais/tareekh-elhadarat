import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare const Quill: any;

@Component({
  selector: 'app-admin-article-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './article-add.component.html'
})
export class AdminArticleAddComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  title = signal('');
  categoryId = signal<number | null>(null);
  status = signal('draft');
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  imagePreviewUrl = signal<string | null>(null);
  imageFile = signal<File | null>(null);

  isCategoryDropdownOpen = signal(false);

  categories = signal([
    { id: 1, name: 'حضارات قديمة' },
    { id: 2, name: 'العصور الوسطى' },
    { id: 3, name: 'تاريخ الفن' }
  ]);

  tags = signal([
    { id: 1, name: 'مصر القديمة' },
    { id: 2, name: 'لغات قديمة' },
    { id: 3, name: 'نقوش' }
  ]);
  selectedTagIds = signal<number[]>([]);

  private quillEditor: any = null;
  private quillLoaded = false;

  ngOnInit() {}

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
    }, 100);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);
    // Mock save
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set('تمت إضافة المقال بنجاح!');
      setTimeout(() => this.successMessage.set(''), 3000);
    }, 1500);
  }
}
