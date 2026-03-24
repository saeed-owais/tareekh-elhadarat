import { Component } from '@angular/core';

@Component({
  selector: 'app-write-with-us',
  standalone: true,
  imports: [],
  templateUrl: './write-with-us.component.html',
  styleUrl: './write-with-us.component.css'
})
export class WriteWithUsComponent {
  submitted = false;

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted = true;
  }
}
