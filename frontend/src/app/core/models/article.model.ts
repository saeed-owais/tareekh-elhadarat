export interface Article {
  id: number;
  title: string;
  authorName: string;
  content: string | null;
  imageUrl: string;
  category: string;
  tags: string[];
}
