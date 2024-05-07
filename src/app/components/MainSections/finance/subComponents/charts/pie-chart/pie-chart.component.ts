import { Component, Input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatsService } from '../../../../../../services/finance-services/stats.service';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  template: `
    <ngx-charts-pie-chart
      [results]="single"
      [view]="[500,400]"
      [explodeSlices]="false"
      [customColors]="customColors"
      [doughnut]="false"
      [labels]="true">
      <ng-template #tooltipTemplate let-model="model">
        <div class="custom-tooltip">
          <p>{{ model.name }}</p>
          <p>{{ model.value | number }} %</p>
        </div>
      </ng-template>
    </ngx-charts-pie-chart>

  `,
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent {

  entriesCurrentMonth :registryEntry[] = [];

 //single = {};
 @Input() single!:{};
 @Input() customColors !: {};

  
}
