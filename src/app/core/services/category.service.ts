import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Category[] = [
    { id: 1, name: 'فكر', icon: 'psychology' },
    { id: 2, name: 'تاريخ', icon: 'history_edu' },
    { id: 3, name: 'فلسفة', icon: 'menu_book' },
    { id: 4, name: 'أدب', icon: 'auto_stories' },
    { id: 5, name: 'قضايا معاصرة', icon: 'public' }
  ];

  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }
}
