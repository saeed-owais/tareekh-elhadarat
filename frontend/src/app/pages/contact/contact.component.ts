import { Component, inject, signal } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  public ts = inject(TranslationService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  
  submitted = signal(false);
  isLoading = signal(false);

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    
    this.isLoading.set(true);
    
    const formData = this.contactForm.value;

    this.http.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: 'service_0ni9mcn',
      template_id: 'template_wa6strp',
      user_id: 'oX3oFaOnjCAR19L-G',
      template_params: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }
    }, { responseType: 'text' }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.submitted.set(true);
        this.contactForm.reset();
      },
      error: (err) => {
        console.error('Error sending email via EmailJS:', err);
        this.isLoading.set(false);
        alert(this.ts.t('common.error') || 'Failed to send message. Please try again later.');
      }
    });
  }
}
