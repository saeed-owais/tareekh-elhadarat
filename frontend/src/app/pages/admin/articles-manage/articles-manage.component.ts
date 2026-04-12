import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../../../core/services/article.service';
import { CategoryService } from '../../../core/services/category.service';
import { AdminArticle, Category } from '../../../core/models';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-admin-articles-manage',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './articles-manage.component.html',
})
export class ArticlesManageComponent implements OnInit {
  private articleService = inject(ArticleService);
  private categoryService = inject(CategoryService);
  public ts: TranslationService = inject(TranslationService);

  confirmDeleteId = signal<number | null>(null);
  articles = signal<AdminArticle[]>([]);
  successMessage = signal('');
  
  // DataTable Signals
  searchQuery = signal('');
  selectedCategoryId = signal<number | null>(null);
  categoryList = signal<Category[]>([]);
  selectedStatus = signal<string>('all');
  sortKey = signal<keyof AdminArticle | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  // Computed signal for client-side search & sort
  filteredArticles = computed(() => {
    let data = [...this.articles()];
    const query = this.searchQuery().toLowerCase().trim();

    // 1. Filter by Search Query
    if (query) {
      data = data.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.authorName.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Category
    const catId = this.selectedCategoryId();
    if (catId && catId !== 0 && catId !== null && catId !== undefined) {
      // Use == to handle potential string/number mismatch from select binding
      data = data.filter(a => a.categoryId == catId);
    }

    // 3. Filter by Status
    const status = this.selectedStatus();
    if (status !== 'all') {
      data = data.filter(a => {
        if (status === 'published') return a.isPublished && !a.isDeleted;
        if (status === 'draft') return !a.isPublished && !a.isDeleted;
        if (status === 'deleted') return !!a.isDeleted;
        return true;
      });
    }

    // 2. Sort
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDirection() === 'asc' ? 1 : -1;
      data.sort((a, b) => {
        // Special logic for Status sorting
        if (key === 'isPublished') {
          const getStatusWeight = (art: AdminArticle) => {
            if (art.isDeleted) return 3;
            if (art.isPublished) return 1;
            return 2; // Draft
          };
          const weightA = getStatusWeight(a);
          const weightB = getStatusWeight(b);
          return (weightA - weightB) * dir;
        }

        const valA = a[key];
        const valB = b[key];
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * dir;
        }
        
        if (valA! < valB!) return -1 * dir;
        if (valA! > valB!) return 1 * dir;
        return 0;
      });
    }

    return data;
  });

  // Pagination Signals
  pageNumber = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadArticles();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categoryList.set(data),
      error: (err) => console.error(err)
    });
  }

  loadArticles() {
    this.isLoading.set(true);
    this.articleService.getAllArticlesAdmin(this.pageNumber(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.articles.set(response.data);
          this.totalItems.set(response.totalItems);
          this.totalPages.set(response.totalPages);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages()) {
      this.pageNumber.set(newPage);
      this.loadArticles();
    }
  }

  toggleSort(key: keyof AdminArticle) {
    if (this.sortKey() === key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDirection.set('asc');
    }
  }

  toggleDelete(id: number, event: Event) {
    event.stopPropagation();
    if (this.confirmDeleteId() === id) {
      this.confirmDeleteId.set(null);
    } else {
      this.confirmDeleteId.set(id);
    }
  }

  confirmDelete(id: number, event: Event) {
    event.stopPropagation();
    const article = this.articles().find(a => a.id === id);
    if (!article) return;
    
    this.isLoading.set(true);
    const isRestoring = article.isDeleted;
    
    this.articleService.toggleArticle(id).subscribe({
      next: (success) => {
        if (success) {
          // Toggle local isDeleted state
          this.articles.update(articles => 
            articles.map(a => a.id === id ? { ...a, isDeleted: !a.isDeleted } : a)
          );
          
          this.successMessage.set(isRestoring ? this.ts.t('admin.articleForm.successUpdate') : this.ts.t('admin.approvals.systemUpdated'));
          setTimeout(() => this.successMessage.set(''), 3000);
        }
        this.confirmDeleteId.set(null);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.confirmDeleteId.set(null);
      }
    });
  }
}
