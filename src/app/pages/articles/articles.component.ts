import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PostService } from '../../core/services/post.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent {
  private postService = inject(PostService);
  private categoryService = inject(CategoryService);

  posts = this.postService.getPosts();
  categories = this.categoryService.getCategories();
  selectedCategoryId: number | null = null;

  get filteredPosts() {
    if (this.selectedCategoryId === null) {
      return this.posts;
    }
    return this.posts.filter(p => p.categoryId === this.selectedCategoryId);
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
  }
}
