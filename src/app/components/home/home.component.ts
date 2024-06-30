import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from '../sectionHome/section.component';
import { Section } from '../../interfaces/finance-interfaces/section';
import { Theme, ThemeService } from '../../theme.service';

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
      path: "finance"
    },
    {
      name: "Academic section",
      photo: "/assets/academic2.svg",
      path: "academic"
    },
    {
      name: "Personal section",
      photo: "/assets/personal.svg",
      path: "personal"
    }
  ];
  constructor(private themeService:ThemeService){

    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      const theme: Theme = JSON.parse(storedTheme);
      this.themeService.setTheme(theme);
    }
  }
}

