import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js';
import { Argument } from 'model/arguement.model';
import { ArgumentService } from 'src/api/argument.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit {
  argument: Argument;
  showChart = false;
  docId = '';
  voterId = '';
  isEligable = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly db: AngularFirestore,
    private readonly argumentService: ArgumentService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    this.docId = param.slice(0, -1);
    this.voterId = param.slice(param.length - 1);
    this.getArgument(param);
  }

  getArgument(id: string) {
    this.argumentService.getArgument(this.docId).then((argument) => {
      this.argument = argument.data();
      this.verifyVoter();
    });
  }

  verifyVoter() {
    if (this.argument[`voter${this.voterId}`]) {
      this.isEligable = false;
      this.initChart();
    }
  }

  initChart() {
    const ctx = document.getElementById('myChart');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [this.argument.personA, this.argument.personB],
        datasets: [
          {
            label: '# of Votes',
            data: [this.argument.votesA, this.argument.votesB],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
    });
  }
}
