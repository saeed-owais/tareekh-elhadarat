import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public ts = inject(TranslationService);

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessages = signal<string[]>([]);
  showResendButton = signal(false);
  resendSuccess = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false)
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessages.set([]);
    this.resendSuccess.set(null);
    this.showResendButton.set(false);

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }, rememberMe!).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err: string[]) => {
        this.isLoading.set(false);
        this.errorMessages.set(err);
        
        const needsConfirmation = err.some(m => 
            m.includes('تأكيد') || m.toLowerCase().includes('confirm')
          );
          if (needsConfirmation) {
            this.showResendButton.set(true);
          }
      }
    });
  }

  resendConfirmationEmail() {
    const email = this.loginForm.get('email')?.value;
    if (!email) return;

    this.isLoading.set(true);
    this.authService.resendConfirmation(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.resendSuccess.set(this.ts.t('auth.resendSuccess'));
        this.showResendButton.set(false);
      },
      error: (err: string[]) => {
        this.isLoading.set(false);
        this.errorMessages.set(err);
      }
    });
  }
}
