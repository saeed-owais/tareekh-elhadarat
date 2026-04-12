import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  layoutService = inject(AdminLayoutService);
  public ts: TranslationService = inject(TranslationService);
}
