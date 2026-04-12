import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  public ts = inject(TranslationService);
  
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private authService: AuthService) { }

  get emailControl() {
    return this.resetForm.get('email');
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const email = this.resetForm.value.email!;

    this.authService.requestResetPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
      },
      error: (err: string) => {
        this.isLoading.set(false);
        this.errorMessage.set(err);
      }
    });
  }

  tryAgain() {
    this.isSubmitted.set(false);
    this.errorMessage.set(null);
    this.resetForm.reset();
  }
}