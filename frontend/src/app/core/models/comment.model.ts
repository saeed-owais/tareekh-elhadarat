export interface Comment {
  id: number;
  authorName: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  postId: number;
}
