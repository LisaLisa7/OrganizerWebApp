import { Component } from '@angular/core';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from "../charts/bar-chart/bar-chart.component";
import { registryEntry } from '../../../../../interfaces/registryEntry';
import { StatsService } from '../../../../../services/stats.service';
import { PictogramService } from '../../../../../services/pictogram.service';
import { RegistryService } from '../../../../../services/registry.service';
import { GroupedBarChartComponent } from '../charts/grouped-bar-chart/grouped-bar-chart.component';

@Component({
    selector: 'app-stats',
    standalone: true,
    template: `
    <div class="pageContainer">
      <app-pie-chart [single]="pieChartData"></app-pie-chart>
      <app-bar-chart [barChartData]="barChartData" ></app-bar-chart>
      <app-pie-chart [single]="pieChartData2"></app-pie-chart>
      <app-grouped-bar-chart [monthlyData]="barChartData2"></app-grouped-bar-chart>
      
    </div>
  `,
    styleUrl: './stats.component.css',
    imports: [PieChartComponent, BarChartComponent,GroupedBarChartComponent]
})
export class StatsComponent {

  entriesCurrentMonth :registryEntry[] = [];
  pieChartData : any;
  barChartData :any;
  pieChartData2 : any;
  barChartData2 : any;

  constructor(private statsService:StatsService,private registryService:RegistryService){
    this.loadData();
  }

  async loadData(){
    this.entriesCurrentMonth = await this.registryService.getEntriesByMonth();
    console.log(this.entriesCurrentMonth);
    this.pieChartData =  this.statsService.calculateProportionsPieChart(this.entriesCurrentMonth);
    this.barChartData  =  this.statsService.calculateDataBarChart(this.entriesCurrentMonth);
    this.pieChartData2 = await this.statsService.calculateProportionsPieChart2(this.entriesCurrentMonth);
    this.barChartData2 = await this.statsService.getFked();
    console.log(this.barChartData);
    console.log(this.barChartData2);
  }



}
