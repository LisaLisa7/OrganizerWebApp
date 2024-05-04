import { Component } from '@angular/core';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from "../charts/pie-chart/bar-chart/bar-chart.component";

@Component({
    selector: 'app-stats',
    standalone: true,
    template: `
    <div class="pageContainer">
      <app-pie-chart></app-pie-chart>
      <app-bar-chart></app-bar-chart>
    </div>
  `,
    styleUrl: './stats.component.css',
    imports: [PieChartComponent, BarChartComponent]
})
export class StatsComponent {

}
