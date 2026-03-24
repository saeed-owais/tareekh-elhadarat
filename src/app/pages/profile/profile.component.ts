import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  
  private profileService = inject(ProfileService);

  // إعدادات المستخدم
  user = signal<UserProfile | null>(null); 
  isLoadingProfile = signal<boolean>(true); 

  // إدارة التبويبات (Tabs)
  activeTab = signal<string>('معلوماتي');
  
  tabs = signal([
    { id: 'معلوماتي', label: 'معلوماتي', icon: 'person', filled: true },
    { id: 'مقالاتي', label: 'مقالاتي', icon: 'article', filled: false },
    { id: 'كتبي', label: 'كتبي المفضلة', icon: 'auto_stories', filled: false },
    { id: 'إعدادات', label: 'الإعدادات', icon: 'settings', filled: false },
  ]);

  // إحصائيات القراءة (Stats)
  stats = signal([
    { value: '42', label: 'كتاب تم تحميله', icon: 'menu_book' },
    { value: '128', label: 'مقال تمت قراءته', icon: 'article' },
    { value: '15', label: 'مقال منشور', icon: 'workspace_premium' },
  ]);

  // الأوسمة الأكاديمية (Badges)
  badges = signal([
    { label: 'باحث متميز', icon: 'star' },
    { label: 'قارئ نهم', icon: 'local_library' },
    { label: 'مؤرخ معتمد', icon: 'history' }
  ]);

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoadingProfile.set(true); 
    
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.user.set(data); 
        this.isLoadingProfile.set(false); 
      },
      error: (err) => {
        console.error('حدث خطأ أثناء جلب البيانات', err);
        this.isLoadingProfile.set(false);
      }
    });
  }

  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
  }
}