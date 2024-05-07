import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Section } from '../../interfaces/finance-interfaces/section';
import { RouterLink,RouterOutlet } from '@angular/router';
import PocketBase from 'pocketbase'

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet],
  template: `
  <div class="card">
    <a [href]="Section.path" *ngIf="Section.path; else noPath">
      <img [src]="Section.photo" alt="{{Section.name}}">
      <h2>{{Section.name}}</h2>
    </a>
    <ng-template #noPath>
      <img [src]="Section.photo" alt="{{Section.name}}">
      <h2>{{Section.name}}</h2>
    </ng-template>
  </div>
  `,
  styleUrl: './section.component.css'
})
export class SectionComponent {

  @Input() Section!:Section;
}
