import { Component, inject } from '@angular/core';
import { AuthorService } from '../../core/services/author.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private authorService = inject(AuthorService);
  authors = this.authorService.getAuthors();
}
