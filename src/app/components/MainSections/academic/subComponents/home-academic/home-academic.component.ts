import { Component } from '@angular/core';
import { ClassesService } from '../../../../../services/academic-services/classes.service';
import { Class } from '../../../../../interfaces/academic-interfaces/class';
import { CommonModule } from '@angular/common';
import { ClassTask } from '../../../../../interfaces/academic-interfaces/class-task';
import { ClassTasksService } from '../../../../../services/academic-services/class-tasks.service';
import { Project } from '../../../../../interfaces/academic-interfaces/project';
import { ProjectsService } from '../../../../../services/academic-services/projects.service';
@Component({
  selector: 'app-home-academic',
  standalone: true,
  imports: [CommonModule],
  template: `
  
    <div class="pageContainer">
        <div class="container-1-1">
          <h1>Today Classes</h1>
          <div *ngIf="todayClasses.length>0; else noClassesToday">
            <div class="todayClassesContainer" *ngFor="let c of todayClasses">

              <div class="class">
                <h3>{{c.ClassName}} - {{c.Type}}</h3>
                <p >{{c.Location}}</p>
                <h4>{{c.TimeInterval}} - <span>{{c.Day}}</span></h4>
                
              </div>

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

              <div class="class">
                <h3>{{c.ClassName}} - {{c.Type}}</h3>
                <p >{{c.Location}}</p>
                <h4>{{c.TimeInterval}} - <span>{{c.Day}}</span> </h4>
              </div>

            </div>
          </div>

          <ng-template #noRemainingClasses>
            <h3>No classes left for this week!</h3>
          </ng-template>
          
        </div>

        <div class="container-2-1">
          <h1>Today Tasks</h1>

          <div *ngIf="tasksToday.length>0; else noTasksToday">
            <div class="todayTasksContainer" *ngFor="let t of tasksToday">

              <div class="task">
                <h3>Title: {{t.title}}</h3>
                <p>{{t.finishDate | date : 'dd/MM/yyyy HH:mm ' :'UTC'}}</p>
                <h4>Project: {{t.project_id}}</h4>
              </div>

            </div>
          </div>

          <ng-template #noTasksToday>
            <h3>No tasks for today!</h3>
          </ng-template>

        </div>

        <div class="container-2-2">
          <h1>Due this week</h1>

          <div *ngIf="remainingTasks.length>0; else noRemainingTasks">
            <div class="todayTasksContainer" *ngFor="let t of remainingTasks">

              <div class="task">
                <h3>Title: {{t.title}}</h3>
                <p>{{t.finishDate | date : 'dd/MM/yyyy HH:mm ' :'UTC'}}</p>
                <h4>Project: {{t.project_id}}</h4>
              </div>

            </div>
          </div>

          <ng-template #noRemainingTasks>
            <h3>No tasks due this week!</h3>
          </ng-template>


        </div>


    </div>
    
  `,
  styleUrl: './home-academic.component.css'
})
export class HomeAcademicComponent {

  todayClasses : Class[] = [];
  remainingClasses : Class[] = [];
  tasksToday : ClassTask[]  = [];
  remainingTasks : ClassTask[] = [];
  dueProjects : Project[] = [];

  constructor(private classService:ClassesService,private taskService:ClassTasksService,private projectService:ProjectsService){
    this.loadData();

  }

  async loadData(){

    this.todayClasses = await this.classService.getAllClassesToday();
    this.remainingClasses = await this.classService.getAllRemainingClasses();
    this.tasksToday = await this.taskService.getAllTasksToday();
    this.remainingTasks = await this.taskService.getAllRemainingTasks();
    this.dueProjects = await this.projectService.getDueProjects();
  }

}
