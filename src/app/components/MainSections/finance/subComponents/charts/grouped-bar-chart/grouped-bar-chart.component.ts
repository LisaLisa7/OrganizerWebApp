import { Component,Input } from '@angular/core';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-grouped-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
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
  xAxisLabel: string = 'Type';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Sum (lei)';
  legendTitle: string = 'Month';


  legend: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  timeline: boolean = true;
  
  barChartcustomColors = 
  [
    { name: "Type 1", value: '#febb00' },
    { name: "Type 2", value: '#1dd068' },
    { name: "Type 3", value: '#1dd068' },
    { name: "2022", value: '#febb00' },
  ]


  @Input() monthlyData!:[];


  monthlySumData = [
    {
      "name": "Income",
      "series": [
        {
          "name": "May",
          "value": 8000
        },
        {
          "name": "April",
          "value": 5000
        },
        {
          "name" : "March",
          "value" : 10000
        }
      ]
    },
  
    {
      "name": "Expenses",
      "series": [
        {
          "name": "May",
          "value": 4000
        },
        {
          "name": "April",
          "value": 5000
        },
        {
          "name" : "March",
          "value" : 650
        }
      ]
    },
  
  ];


}
