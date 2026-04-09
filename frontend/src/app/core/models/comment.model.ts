export interface Comment {
  id: number;
  authorName: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  postId: number;
}

export interface SubmittedComment {
  id: number;
  userName: string;
  text: string;
  createdAt: string;
  articleTitle: string;
  articleId: number;
  isPublished: boolean;
}
