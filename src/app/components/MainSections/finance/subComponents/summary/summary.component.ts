import { Component,Input } from '@angular/core';
import { Summary } from '../../../../../interfaces/summary';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="summaryTypeClass">
      <h1>{{Summary.month}} {{Summary.type}}</h1>
      <h1>
        {{Summary.type === 'Income' ? '+' : (Summary.type === 'Expenses' ? '-' : '')}}
        {{Summary.sum}} lei
      </h1>
      <p></p>
      
    </div>
  `,
  styleUrl: './summary.component.css'
})
export class SummaryComponent {

    @Input() Summary!:Summary;


    get summaryTypeClass(): string {
      switch (this.Summary.type) {
          case 'Income':
              return 'income-summary';
          case 'Expenses':
              return 'expenses-summary';
          case 'Balance':
              return 'balance-summary';
          default:
              return '';
      }
  }

}
