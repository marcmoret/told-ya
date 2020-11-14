import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute) {}

  bankName;

  ngOnInit(): void {
    this.bankName = this.route.snapshot.paramMap.get('id');
    console.log(this.bankName);
  }
}
