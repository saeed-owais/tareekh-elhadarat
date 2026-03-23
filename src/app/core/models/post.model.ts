export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  categoryId: number;
  categoryName?: string;
  createdBy: number;
  authorName?: string;
  readTime?: string;
  views?: number;
}
