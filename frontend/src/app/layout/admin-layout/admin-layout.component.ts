import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

}
