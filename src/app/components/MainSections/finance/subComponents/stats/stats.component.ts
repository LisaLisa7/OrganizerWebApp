import { Component } from '@angular/core';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from "../charts/bar-chart/bar-chart.component";
import { registryEntry } from '../../../../../interfaces/finance-interfaces/registryEntry';
import { StatsService } from '../../../../../services/finance-services/stats.service';
import { PictogramService } from '../../../../../services/finance-services/pictogram.service';
import { RegistryService } from '../../../../../services/finance-services/registry.service';
import { GroupedBarChartComponent } from '../charts/grouped-bar-chart/grouped-bar-chart.component';

@Component({
    selector: 'app-stats',
    standalone: true,
    template: `
    <div class="pageContainer">
    <h1>{{month_current}} financial overview</h1>
      <div class="container-up">
        
        <div class="container-up-left">
          <div class="graph">
            <h3>Distribution of this month's entries</h3>
            <app-pie-chart [single]="pieChartData" [customColors]="customColors1"></app-pie-chart>
            </div>
        </div>

        <div class="container-up-right">
          
            <div class="graph">
            <h3>Total sum of this month's entries</h3>
            <app-bar-chart [barChartData]="barChartData" [customColors]="customColors1" ></app-bar-chart>
            </div>
            
        </div>
      </div>


      <div class="container-down">

      
      <div class="container-down-left">
        <div class="graph">
          <h3>Distribution of expenses's categories</h3>
          <app-pie-chart [single]="pieChartData2" ></app-pie-chart>
        </div>
      </div>
      
      <div class="container-down-right">
        <div class="graph">
          <h3>Comparison with last month</h3>
          <app-grouped-bar-chart [monthlyData]="barChartData2"></app-grouped-bar-chart>
        </div>
      </div>


      </div>
      
    </div>
  `,
    styleUrl: './stats.component.css',
    imports: [PieChartComponent, BarChartComponent,GroupedBarChartComponent]
})
export class StatsComponent {

  entriesCurrentMonth :registryEntry[] = [];
  entriesLastMonth :registryEntry[] = [];
  pieChartData : any;
  barChartData :any;
  pieChartData2 : any;
  barChartData2 : any;
  month_current : string;
  month_prev : string;


  customColors1 = [
              { name: "Expenses", value: '#f25f5c' },
              { name: "Income", value: '#70c1b3' },
              { name: "Savings+", value: '#ffe066' }
                ]

  customColors2 = [
    { name: "Expenses", value: '#f25f5c' },
    { name: "Income", value: '#70c1b3' },
    { name: "Savings+", value: '#ffe066' }
      ]

  constructor(private statsService:StatsService,private registryService:RegistryService){
    const currentDate = new Date();
this.month_current = new Intl.DateTimeFormat('en', { month: 'long' }).format(currentDate);

currentDate.setDate(1);

const currentMonth = currentDate.getMonth(); 
const lastMonth = (currentMonth === 0) ? 11 : currentMonth - 1; 
const lastMonthDate = new Date(currentDate); 
lastMonthDate.setMonth(lastMonth); 
this.month_prev = new Intl.DateTimeFormat('en', { month: 'long' }).format(lastMonthDate); 

console.log("Current month:", this.month_current); 
console.log("Last month:", this.month_prev);

    this.loadData();
  }

  async loadData(){

    this.entriesCurrentMonth = await this.registryService.getEntriesByMonth();
    this.entriesLastMonth = await this.registryService.getEntriesLastMonth();
    console.log(this.entriesLastMonth);
    console.log(this.entriesCurrentMonth);
    this.pieChartData =  this.statsService.calculateProportionsPieChart(this.entriesCurrentMonth);
    this.barChartData  =  this.statsService.calculateDataBarChart(this.entriesCurrentMonth);
    this.pieChartData2 = await this.statsService.calculateProportionsPieChart2(this.entriesCurrentMonth);

    this.barChartData2 = await this.statsService.calculateDataBarChart2(this.entriesCurrentMonth,this.entriesLastMonth,this.month_current,this.month_prev);
    console.log(this.barChartData);
    console.log(this.barChartData2);
  }



}
