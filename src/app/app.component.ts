import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
  
  <main>
    <a [routerLink]="['/']">
      <header class="brand-name">
        <img class="logo-icon" src="/assets/student.svg" aria-hidden="true" alt="icon">
        <img class="brand-logo" src="/assets/mylogo7.svg" alt="logo" aria-hidden="true">
        
      </header>
    </a>
      <router-outlet></router-outlet>
    
    
  </main>
  
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Organizer';
}
