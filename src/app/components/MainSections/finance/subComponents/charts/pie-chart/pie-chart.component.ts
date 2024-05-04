import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatsService } from '../../../../../../services/stats.service';
import { registryEntry } from '../../../../../../interfaces/registryEntry';





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
      [view]="[500,400]"
      [explodeSlices]="false"
      [doughnut]="false"
      [labels]="true">
      <ng-template #tooltipTemplate let-model="model">
        <div class="custom-tooltip">
          <p>{{ model.name }}</p>
          <p>{{ model.value | number }} %</p>
        </div>
      </ng-template>
    </ngx-charts-pie-chart>

    </div>

  `,
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {

  entriesCurrentMonth :registryEntry[] = [];

 single = {};

  constructor(private statsService:StatsService){
    this.loadData();
  }

  async loadData(){
    this.entriesCurrentMonth = await this.statsService.getEntriesByMonth();
    this.single =  this.statsService.calculateProportionsPieChart(this.entriesCurrentMonth);

  }
}
