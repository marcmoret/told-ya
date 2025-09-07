import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [RouterModule]
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
