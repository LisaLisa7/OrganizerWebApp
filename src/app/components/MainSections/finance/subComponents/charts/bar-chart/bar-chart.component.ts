import { Component, Input } from '@angular/core';
import {NgxChartsModule } from '@swimlane/ngx-charts';


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
      yAxisLabel="Sum (lei)" >
    </ngx-charts-bar-vertical>
    
  `,
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  
  @Input() customColors = {};


  @Input() barChartData!:{};

  gradient = false;

}
