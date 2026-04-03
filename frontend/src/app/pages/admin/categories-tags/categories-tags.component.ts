import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { Category } from '../../../core/models/category.model';
import { Tag } from '../../../core/models/tag.model';
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-categories-tags',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-tags.component.html'
})
export class CategoriesTagsComponent implements OnInit {
  // Tabs State
  activeTab = signal<'categories' | 'tags'>('categories');
  
  // Data State
  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);
  isLoading = signal(false);
  
  // Form State
  isEditing = signal(false);
  editId = signal<number | null>(null);
  formData = signal({ name: '', isAvailable: true });
  
  // Feedback
  successMessage = signal('');
  errorMessage = signal('');
  confirmDeleteId = signal<number | null>(null);

  constructor(
    private categoryService: CategoryService,
    private tagService: TagService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    if (this.activeTab() === 'categories') {
      this.categoryService.getCategories()
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => this.categories.set(data),
          error: (err) => this.errorMessage.set(err)
        });
    } else {
      this.tagService.getTags()
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => this.tags.set(data),
          error: (err) => this.errorMessage.set(err)
        });
    }
  }

  switchTab(tab: 'categories' | 'tags') {
    this.activeTab.set(tab);
    this.resetForm();
    this.loadData();
  }

  resetForm() {
    this.isEditing.set(false);
    this.editId.set(null);
    this.formData.set({ name: '', isAvailable: true });
    this.errorMessage.set('');
  }

  editItem(item: Category | Tag) {
    this.isEditing.set(true);
    this.editId.set(item.id);
    this.formData.set({ name: item.name, isAvailable: item.isAvailable });
    // Scroll to form or show modal? In this case, we'll probably have a form at the top or a modal.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit() {
    if (!this.formData().name.trim()) return;

    this.isLoading.set(true);
    const action: Observable<any> = this.activeTab() === 'categories'
      ? (this.isEditing() 
          ? this.categoryService.updateCategory({ id: this.editId()!, ...this.formData() }) 
          : this.categoryService.addCategory(this.formData()))
      : (this.isEditing() 
          ? this.tagService.updateTag({ id: this.editId()!, ...this.formData() }) 
          : this.tagService.addTag(this.formData()));

    action.pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(this.isEditing() ? 'تم التحديث بنجاح' : 'تمت الإضافة بنجاح');
          this.resetForm();
          this.loadData();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err: any) => this.errorMessage.set(err)
      });
  }

  toggleDelete(id: number, event: Event) {
    event.stopPropagation();
    if (this.confirmDeleteId() === id) {
      this.confirmDeleteId.set(null);
    } else {
      this.confirmDeleteId.set(id);
    }
  }

  confirmDelete(id: number) {
    this.isLoading.set(true);
    const action = this.activeTab() === 'categories'
      ? this.categoryService.deleteCategory(id)
      : this.tagService.deleteTag(id);

    action.pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('تم الحذف بنجاح');
          this.confirmDeleteId.set(null);
          this.loadData();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => this.errorMessage.set(err)
      });
  }
}
