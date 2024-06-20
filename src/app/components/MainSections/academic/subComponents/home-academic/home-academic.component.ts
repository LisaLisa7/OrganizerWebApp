import { Component } from '@angular/core';
import { ClassesService } from '../../../../../services/academic-services/classes.service';
import { Class } from '../../../../../interfaces/academic-interfaces/class';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-academic',
  standalone: true,
  imports: [CommonModule],
  template: `
  
    <div class="pageContainer">

      <div class="container-1">

        <div class="container-1-1">
          <h1>Today Classes</h1>
          <div *ngIf="todayClasses.length>0; else noClassesToday">
            <div class="todayClassesContainer" *ngFor="let c of todayClasses">
              <p>{{c.ClassName}}</p>
            </div>
          </div>
          <ng-template #noClassesToday>
            <h3>No classes today!</h3>
          </ng-template>
          
        </div>

        <div class="container-1-2">
          <h1>This week</h1>
          <div *ngIf="remainingClasses.length>0; else noRemainingClasses">
            <div class="todayClassesContainer" *ngFor="let c of remainingClasses">
              <h3>{{c.ClassName}}</h3>
              <p>{{c.Day}}</p>
            </div>
          </div>

          <ng-template #noRemainingClasses>
            <h3>No classes left for this week!</h3>
          </ng-template>
          
        </div>

      </div>

      <div class="container-2">

        <div class="container-2-1">
          <h1>Today Tasks</h1>
        </div>

        <div class="container-2-2">
          <h1>Due this week</h1>
        </div>


      </div>

      <div class="container-3">
        <h1>Due Projects</h1>

      </div>

    </div>
    
  `,
  styleUrl: './home-academic.component.css'
})
export class HomeAcademicComponent {

  todayClasses : Class[] = [];
  remainingClasses : Class[] = [];

  constructor(private classService:ClassesService){
    this.loadData();

  }

  async loadData(){

    this.todayClasses = await this.classService.getAllClassesToday();
    this.remainingClasses = await this.classService.getAllRemainingClasses();
  }

}
