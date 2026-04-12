import { Component, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.component.html',
  styles: `
    :host {
      display: block;
    }
  `
})
export class TermsComponent {
  public ts = inject(TranslationService);
}
