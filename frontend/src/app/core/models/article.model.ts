import { Comment } from './comment.model';

export interface Article {
  id: number;
  title: string;
  authorName: string;
  content: string | null;
  imageUrl: string;
  category: string;
  readTimeInMiniutes: number;
  tags: string[];
  comments: Comment[] | null;
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
  readTimeInMiniutes: number;
  isPublished: boolean;
  isDeleted: boolean;
  categoryId: number | null;
  category: string;
  articleTagsIds: number[];
}
