import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { ProfileService } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './admin-header.component.html',
})
export class AdminHeaderComponent {
  layoutService = inject(AdminLayoutService);
  profileService = inject(ProfileService);
  userProfile$ = this.profileService.getUserProfile();
  
  isMobileSearchOpen = signal(false);

  toggleMobileSearch() {
    this.isMobileSearchOpen.update(val => !val);
  }
}
