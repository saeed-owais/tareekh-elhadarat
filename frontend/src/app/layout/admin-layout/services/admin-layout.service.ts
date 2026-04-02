import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {
  isMobileSidebarOpen = signal(false);

  toggleSidebar() {
    this.isMobileSidebarOpen.update(val => !val);
  }

  closeSidebar() {
    this.isMobileSidebarOpen.set(false);
  }
}
