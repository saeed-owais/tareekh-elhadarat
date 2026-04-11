import { Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { ScrollService } from "../../core/services/scroll.service";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  public scrollService = inject(ScrollService);
}
