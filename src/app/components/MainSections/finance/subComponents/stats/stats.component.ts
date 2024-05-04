import { Component } from '@angular/core';
import { PieChartComponent } from '../pie-chart/pie-chart.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [PieChartComponent],
  template: `
    <app-pie-chart></app-pie-chart>
  `,
  styleUrl: './stats.component.css'
})
export class StatsComponent {

}
