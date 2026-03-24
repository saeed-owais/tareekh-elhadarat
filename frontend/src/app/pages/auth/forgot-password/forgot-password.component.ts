import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true, // تفعيل الـ Standalone
  imports: [ReactiveFormsModule, RouterLink, NgClass], // استيراد الموديولات المطلوبة مباشرة
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  
  // استخدام Signals لإدارة الحالة بشكل عصري وأسرع
  isSubmitted = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // بناء نموذج الـ Form
  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  // دالة للوصول السريع لحقل البريد
  get emailControl() {
    return this.resetForm.get('email');
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    // تغيير حالة التحميل باستخدام Signals
    this.isLoading.set(true);

    // محاكاة إرسال الطلب للسيرفر
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
      console.log('تم طلب إعادة تعيين كلمة المرور للبريد:', this.resetForm.value.email);
    }, 1500);
  }

  tryAgain() {
    this.isSubmitted.set(false);
    this.resetForm.reset();
  }
}