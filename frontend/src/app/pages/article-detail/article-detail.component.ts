import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';
import { CommentService } from '../../core/services/comment.service';
import { Comment } from '../../core/models/comment.model';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private fb = inject(FormBuilder);

  post: Post | undefined;
  relatedPosts: Post[] = [];
  comments: Comment[] = [];
  commentForm!: FormGroup;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.post = this.postService.getPostById(id);
    if (this.post) {
      this.relatedPosts = this.postService.getPostsByCategory(this.post.categoryId)
        .filter(p => p.id !== this.post!.id)
        .slice(0, 2);
        
      this.comments = this.commentService.getCommentsByPostId(this.post.id);
    }
    
    this.initForm();
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      authorName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid && this.post) {
      const formValue = this.commentForm.value;
      this.commentService.addComment({
        postId: this.post.id,
        authorName: formValue.authorName,
        email: formValue.email,
        content: formValue.content
      });
      // Refresh comments
      this.comments = this.commentService.getCommentsByPostId(this.post.id);
      this.commentForm.reset();
    } else {
      Object.keys(this.commentForm.controls).forEach(key => {
        this.commentForm.get(key)?.markAsTouched();
      });
    }
  }
}
