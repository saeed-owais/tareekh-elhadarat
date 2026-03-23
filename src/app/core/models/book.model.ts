export interface Book {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  coverImage: string;
  status: 'available' | 'coming_soon';
  createdAt: Date;
  authorName?: string;
}
