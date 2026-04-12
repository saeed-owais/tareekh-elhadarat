import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  public ts: TranslationService = inject(TranslationService);
}
