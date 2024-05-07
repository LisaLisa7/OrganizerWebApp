import { Component, Input } from '@angular/core';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';
import { StatsService } from '../../../../../../services/finance-services/stats.service';


@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
    <ngx-charts-bar-vertical
      [view]="[600,400]"
      [customColors]="customColors"
      [results]="barChartData"
      [gradient]="gradient"
      [xAxis]="true"
      [yAxis]="true"
      [legend]="true"
      [showXAxisLabel]="true"
      [showYAxisLabel]="true"
      xAxisLabel="Type"
      yAxisLabel="Sum (lei)">
    </ngx-charts-bar-vertical>
    
  `,
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  
  @Input() customColors = {};


  @Input() barChartData!:{};

  gradient = false;

}
