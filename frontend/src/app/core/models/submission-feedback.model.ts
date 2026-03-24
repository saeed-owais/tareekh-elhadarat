export interface SubmissionFeedback {
  id: number;
  contentId: number;
  type: 'like' | 'dislike' | 'report';
  message: string;
  createdAt: Date;
}
