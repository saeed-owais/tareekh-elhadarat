export interface Article {
  id: number;
  title: string;
  authorName: string;
  content: string | null;
  imageUrl: string;
  category: string;
  tags: string[];
}

export interface AdminArticle {
  id: number;
  title: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  imageUrl: string;
  views: number;
  isPublished: boolean;
  isDeleted: boolean;
}
