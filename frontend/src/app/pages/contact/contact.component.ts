import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  submitted = signal(false);

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
  }
}
