import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';





@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
    <p>
      pie-chart works!
    </p>

    <div style="display: block;">

    <ngx-charts-pie-chart
      [results]="single"
      [view]="[400,300]"
      [explodeSlices]="false"
      [doughnut]="false">
    </ngx-charts-pie-chart>

    </div>

  `,
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {

  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];
}
