import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mobileMenuOpen = false;
  searchOpen = false;
  searchQuery = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get user() {
    return this.authService.getUser();
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) this.searchOpen = false;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) this.mobileMenuOpen = false;
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) return;
    this.searchOpen = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/articles'], { queryParams: { search: query } });
    this.searchQuery = '';
  }

  logout(): void {
    this.authService.logout();
  }
}
