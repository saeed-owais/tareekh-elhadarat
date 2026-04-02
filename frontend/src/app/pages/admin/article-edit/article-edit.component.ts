import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare const Quill: any;

@Component({
  selector: 'app-admin-article-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './article-edit.component.html'
})
export class AdminArticleEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: false }) editorContainer!: ElementRef;

  // Mock Data for UI
  title = signal('أسرار الهيروغليفية في عصر الدولة الحديثة');
  categoryId = signal<number | null>(1);
  status = signal('published');
  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  imagePreviewUrl = signal<string | null>('https://lh3.googleusercontent.com/aida-public/AB6AXuA5Hm_QMOAAjUq68FfsmSksMDq5rA9YXGdu_zMftj1n9SWshR46Q8SuaEUFMoFhEMZolsCbzhADepGLSdZRH5XQ1Z9CxA6IbLtaZ_hZij09HcbjJ54i-J-V5-s0lljF_g54iUbrYunsEtEcNPosop5775-5DkH4tuEVsAlV1oLuf_ZvBe98cOy5DDe9kLt0eggJPrMZVSz18s6YrO9_t_-nxIAIIaWvyEj7tI-Bb2uxUln_gytgFKXENhqmuX1jCelY7xkYsSaV9ImF');
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
  selectedTagIds = signal<number[]>([1, 2]);

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
      
      // Mock content
      this.quillEditor.clipboard.dangerouslyPasteHTML('<p>هذا النص يمثل محتوى المقال مسبق التعبئة لأغراض العرض.</p>');
    }, 100);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);
    // Mock save
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set('تم حفظ المقال بنجاح!');
      setTimeout(() => this.successMessage.set(''), 3000);
    }, 1500);
  }
}
