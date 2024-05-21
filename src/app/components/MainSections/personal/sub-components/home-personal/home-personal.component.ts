import { Component } from '@angular/core';

@Component({
  selector: 'app-home-personal',
  standalone: true,
  imports: [],
  template: `
    <div class="pageContainer">

    <div class="container-left">

      <div class="container-left-1">

      <h1>Tasks for today</h1>

      </div>

      <div class="container-left-2">

      

      </div>

    </div>

    <div class="container-right">

      <div class="container-right-1">

      </div>

      <div class="container-right-2">
        <h1>Games suggested for you</h1>


      </div>

    </div>


    </div>
  `,
  styleUrl: './home-personal.component.css'
})
export class HomePersonalComponent {

}
