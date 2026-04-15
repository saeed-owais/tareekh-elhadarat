import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile, SavedArticle } from '../../core/models/user-profile.model';
import { finalize } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  
  private profileService = inject(ProfileService);
  public ts = inject(TranslationService);

  // Profile Data
  user = signal<UserProfile | null>(null); 
  isLoadingProfile = signal<boolean>(true); 
  
  // Computed Join Year
  joinYear = computed(() => {
    const userData = this.user();
    console.log(userData);
    if (userData?.createdAt) {
      try {
        return new Date(userData.createdAt).getFullYear().toString();
      } catch (e) {
        return '2026';
      }
    }
    return '2026';
  });  
  // Saved Articles
  savedArticles = signal<SavedArticle[]>([]);
  isLoadingSaved = signal<boolean>(false);

  // Tabs Management
  activeTab = signal<string>('info');
  
  tabs = signal([
    { id: 'info', label: 'info', icon: 'person', filled: true },
    { id: 'saved', label: 'saved', icon: 'bookmark', filled: false },
    { id: 'settings', label: 'settings', icon: 'settings', filled: false },
  ]);

  // UI State
  isSaving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  // Form Fields for Edit
  editData = {
    firstName: '',
    lastName: '',
    authorName: '',
    bio: ''
  };
  selectedPhoto: File | null = null;
  photoPreview = signal<string | null>(null);

  ngOnInit() {
    this.loadUserProfile();
    this.loadSavedArticles();
  }

  loadUserProfile() {
    this.isLoadingProfile.set(true); 
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.editData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          authorName: data.authorName || '',
          bio: data.bio || ''
        };
        this.isLoadingProfile.set(false); 
      },
      error: (err) => {
        this.errorMessage.set(err);
        this.isLoadingProfile.set(false);
      }
    });
  }

  loadSavedArticles() {
    this.isLoadingSaved.set(true);
    this.profileService.getSavedArticles().subscribe({
      next: (articles) => {
        this.savedArticles.set(articles);
        this.isLoadingSaved.set(false);
      },
      error: () => this.isLoadingSaved.set(false)
    });
  }

  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
    if (tabId === 'saved') {
      this.loadSavedArticles();
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (!this.user()) return;
    
    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('UserId', this.user()!.id);
    formData.append('FirstName', this.editData.firstName);
    formData.append('LastName', this.editData.lastName);
    formData.append('AuthorName', this.editData.authorName);
    formData.append('Bio', this.editData.bio);
    
    if (this.selectedPhoto) {
      formData.append('ProfilePhoto', this.selectedPhoto, this.selectedPhoto.name);
    }

    this.profileService.editProfile(formData)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(this.ts.t('profile.profileUpdated'));
          this.photoPreview.set(null);
          this.selectedPhoto = null;
          this.loadUserProfile();
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => this.errorMessage.set(err)
      });
  }

  removeSaved(articleId: number, event: Event) {
    event.stopPropagation();
    this.profileService.removeSavedArticle(articleId).subscribe({
      next: () => {
        this.savedArticles.update(list => list.filter(a => a.articleId !== articleId));
      }
    });
  }

  cleanUrl(url: string | null | undefined): string {
    if (!url || url === environment.apiBaseUrl + '/') return 'assets/images/avatar-placeholder.png';
    if (url.includes('/https://')) {
      return 'https://' + url.split('/https://')[1];
    }
    return url;
  }
}