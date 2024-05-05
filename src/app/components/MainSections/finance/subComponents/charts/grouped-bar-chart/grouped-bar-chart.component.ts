import { Component,Input } from '@angular/core';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grouped-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
    <p>
      grouped-bar-chart works!
    </p>
    <ngx-charts-bar-vertical-2d
      [view]="[700, 400]"
      [customColors]="barChartcustomColors"
      [results]="monthlyData"
      [gradient]="gradient"
      [xAxis]="showXAxis"
      [yAxis]="showYAxis"
      [legend]="showLegend"
      [showXAxisLabel]="showXAxisLabel"
      [showYAxisLabel]="showYAxisLabel"
      [xAxisLabel]="xAxisLabel"
      [yAxisLabel]="yAxisLabel"
      [legendTitle]="legendTitle">
    </ngx-charts-bar-vertical-2d>
    
  `,
  styleUrl: './grouped-bar-chart.component.css'
})
export class GroupedBarChartComponent {
  
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Population';
  legendTitle: string = 'Years';
  
  barChartcustomColors = 
  [
    { name: "Type 1", value: '#febb00' },
    { name: "Type 2", value: '#1dd068' },
    { name: "Type 3", value: '#1dd068' },
    { name: "2022", value: '#febb00' },
  ]


  @Input() monthlyData!:[];



}
