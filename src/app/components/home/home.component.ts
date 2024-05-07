import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../sectionHome/section.component';
import { Section } from '../../interfaces/finance-interfaces/section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,SectionComponent],
  template: `
  <section>
  <h1>Choose your section!</h1>
  <div class="card-container">
    <app-section
      *ngFor="let Section of sectionCardList"
      [Section]="Section"
    ></app-section>
  </div>
  </section>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {

  readonly basePath = "/assets/";
  sectionCardList: Section[] = [
    {
      name: "Financial section",
      photo: "/assets/finance2.svg",
      path: "fnc"
    },
    {
      name: "Academic section",
      photo: "/assets/academic2.svg",
      path: "acd"
    },
    {
      name: "Personal section",
      photo: "/assets/personal.svg",
      path: "psl"
    }
  ];
  constructor(){
  }
}

