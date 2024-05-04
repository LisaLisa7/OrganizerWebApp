import { Component } from '@angular/core';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import { registryEntry } from '../../../../../../../interfaces/registryEntry';
import { StatsService } from '../../../../../../../services/stats.service';


@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
    <p>
      bar-chart works!
    </p>

    <ngx-charts-bar-vertical
  [view]="[700,400]"
  [customColors]="barChartcustomColors"
  [results]="barChartData"
  [gradient]="gradient"
  [xAxis]="true"
  [yAxis]="true"
  [legend]="true"
  [showXAxisLabel]="true"
  [showYAxisLabel]="true"
  xAxisLabel="Type (lei)"
  yAxisLabel="Sum">
</ngx-charts-bar-vertical>
    
  `,
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {

  
  barChartcustomColors = 
  [
    { name: "Type 1", value: '#febb00' },
    { name: "Type 2", value: '#1dd068' },
    { name: "Type 3", value: '#1dd068' },
    { name: "2022", value: '#febb00' },
  ]


  barChartData :any;

 

  gradient = false;

  entriesCurrentMonth :registryEntry[] = [];
  

  constructor(private statsService:StatsService){

    this.loadData();
  }

  async loadData(){
    this.entriesCurrentMonth = await this.statsService.getEntriesByMonth();
    this.barChartData  =  this.statsService.calculateDataBarChart(this.entriesCurrentMonth);

  }
  


}
