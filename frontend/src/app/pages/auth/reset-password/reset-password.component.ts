import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ResetPasswordRequest } from '../../../core/models/reset-password.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  public ts = inject(TranslationService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  
  userId: string | null = null;
  token: string | null = null;

  resetForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required, 
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: this.passwordMatchValidator() });

  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.userId || !this.token) {
      this.errorMessage.set(this.ts.t('auth.invalidTokenOrUser'));
    }
  }

  get passwordControl() { return this.resetForm.get('newPassword'); }
  get confirmPasswordControl() { return this.resetForm.get('confirmPassword'); }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');
      return password && confirmPassword && password.value !== confirmPassword.value 
        ? { passwordMismatch: true } 
        : null;
    };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.userId || !this.token) {
      if (!this.userId || !this.token) {
        this.errorMessage.set(this.ts.t('auth.invalidTokenOrUser'));
      }
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request: ResetPasswordRequest = {
      userId: this.userId,
      token: this.token,
      newPassword: this.resetForm.value.newPassword!
    };

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const firstError = Array.isArray(err) ? err[0] : (err.message || err);
        this.errorMessage.set(firstError);
      }
    });
  }
}
