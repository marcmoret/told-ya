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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly db: AngularFirestore,
    private readonly argumentService: ArgumentService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    console.log(param);

    this.setArgument(param);
  }

  async setArgument(id: string) {
    this.docId = id.slice(0, -1);
    this.voterId = id.slice(id.length - 1);
    console.log(this.docId);
    console.log(this.voterId);

    await this.argumentService.getArgument(this.docId).then((argument) => {
      this.argument = argument.data();
      console.log(argument.data());
    });
    // this.initChart();
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
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
      },
    });
  }
}
