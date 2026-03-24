import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  subscribe(email: string): { success: boolean; message: string } {
    // Mock implementation - in production this would call an API
    if (email && email.includes('@')) {
      return { success: true, message: 'تم الاشتراك بنجاح! شكراً لانضمامك.' };
    }
    return { success: false, message: 'يرجى إدخال بريد إلكتروني صحيح.' };
  }
}
