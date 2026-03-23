import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = [
    {
      id: 1,
      authorName: 'أحمد محمود',
      email: 'ahmed@example.com',
      content: 'مقال رائع ومفيد جداً، شكراً للكاتب على هذا الجهد.',
      isApproved: true,
      createdAt: new Date('2024-05-16T10:30:00'),
      postId: 1
    },
    {
      id: 2,
      authorName: 'سارة العبدالله',
      email: 'sara@example.com',
      content: 'أتفق مع وجهة النظر المطروحة. هذا الموضوع يحتاج إلى مزيد من النقاش في مجتمعنا.',
      isApproved: true,
      createdAt: new Date('2024-05-18T14:45:00'),
      postId: 1
    },
    {
      id: 3,
      authorName: 'طارق زياد',
      email: 'tareq@example.com',
      content: 'معلومات تاريخية قيمة لم أكن أعرفها من قبل. الأندلس دائماً تبهرنا.',
      isApproved: true,
      createdAt: new Date('2024-05-13T09:15:00'),
      postId: 2
    }
  ];

  getCommentsByPostId(postId: number): Comment[] {
    return this.comments.filter(c => c.postId === postId && c.isApproved).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  addComment(commentData: Partial<Comment>): Comment {
    const newComment: Comment = {
      id: this.comments.length > 0 ? Math.max(...this.comments.map(c => c.id)) + 1 : 1,
      authorName: commentData.authorName || 'مجهول',
      email: commentData.email || '',
      content: commentData.content || '',
      isApproved: true, // Auto-approve for demonstration purposes
      createdAt: new Date(),
      postId: commentData.postId || 0
    };
    
    this.comments.push(newComment);
    return newComment;
  }
}
