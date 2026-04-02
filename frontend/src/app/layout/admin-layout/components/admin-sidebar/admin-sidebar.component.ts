import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutService } from '../../services/admin-layout.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-sidebar.component.html',
})
export class AdminSidebarComponent {
  layoutService = inject(AdminLayoutService);
}
