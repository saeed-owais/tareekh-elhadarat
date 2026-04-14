export interface Comment {
  id: number;
  authorName: string;
  userName?: string; // Opt-in for compatibility with other models
  email: string;
  content?: string;
  text?: string;    // Opt-in for compatibility with other models
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
