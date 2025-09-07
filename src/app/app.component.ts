import { Component } from '@angular/core';
import { FooterComponent } from "./footer/footer.component";
import { RouterOutlet } from "@angular/router";
import { HeadComponent } from "./head/head.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FooterComponent, RouterOutlet, HeadComponent],
})
export class AppComponent {
  title = 'told-ya';
}
