import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss',
  imports: [RouterModule],
})
export class HeadComponent {
  isMenuCollapsed = true;
}
