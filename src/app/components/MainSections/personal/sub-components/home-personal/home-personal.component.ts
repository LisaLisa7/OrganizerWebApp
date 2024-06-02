import { Component } from '@angular/core';
import { TasksService } from '../../../../../services/personal-services/tasks.service';
import { BoardTask } from '../../../../../interfaces/personal-interfaces/board-task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-personal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pageContainer">

    <div class="container-left">

      <div class="container-left-1">

        <h1>Tasks for today</h1>
        <table *ngIf="todayTasks.length > 0; else noTodayTasks">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Board</th>

              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of todayTasks">
                <td>{{r.Title}}</td>
                <td>{{r.Description}}</td>
                <td>{{r.Board_Id}}</td>

              </tr>
            </tbody>
          </table>

          <ng-template #noTodayTasks>
            <p>No tasks for today.</p>
          </ng-template>

      

      </div>

      <div class="container-left-2">

        <h1>Tasks that are overdue</h1>
        <table *ngIf="overdueTasks.length > 0; else noLateTasks">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Board</th>
                <th>Overdue Days</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of overdueTasks">
                <td>{{r.Title}}</td>
                <td>{{r.Description}}</td>
                <td>{{r.Board_Id}}</td>
                <td>{{r.Column_Id}}</td>
              </tr>
            </tbody>
          </table>

          <ng-template #noLateTasks>
            <p>You are up to date!</p>
          </ng-template>
    
      </div>

    </div>

    <div class="container-right">
      <h1 class="h1_title">Suggestions for your lists</h1>

      <div class="container-right-1">
        <h1>Movies</h1>
        <p>In works...</p>
      </div>

      <div class="container-right-2">
        <h1>Games</h1>
        <p>In works...</p>

      </div>
      <div class="container-right-3">
        <h1>Books</h1>
        <p>In works...</p>

      </div>

    </div>


    </div>
  `,
  styleUrl: './home-personal.component.css'
})
export class HomePersonalComponent {

  todayTasks : any = [];
  overdueTasks : any = [];

  constructor(private taskService:TasksService){

    this.loadData();
  }

  async loadData(){

    this.todayTasks =  await this.taskService.getTasksForToday();
    this.overdueTasks = await this.taskService.getTasksOverdue();

    console.log(this.todayTasks);
    console.log(this.overdueTasks);
  }

}
