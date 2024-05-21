import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../../../services/personal-services/tasks.service';
import { BoardColumn } from '../../../../../interfaces/personal-interfaces/board-column';
import { BoardTaskComponent } from '../board-task/board-task.component';
import { BoardTask } from '../../../../../interfaces/personal-interfaces/board-task';

@Component({
  selector: 'app-tasks-personal',
  standalone: true,
  imports: [MatSelectModule,CommonModule,FormsModule,BoardTaskComponent],
  template: `
    <div class="menu-container">

      <mat-form-field>
        <mat-label >Selected board</mat-label>
        <mat-select [(ngModel)]="selectedBoard" (selectionChange)="onBoardChange($event.value)"
        name="Status" >
          @for (stat of boards; track stat){
            <mat-option [value] = "stat.value">{{stat.viewValue}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <div class="button-Container">
        <button>
        <img [src]="plusSVG" alt="home"><span>New board</span>
        </button>

        <button>
        <img [src]="filterSVG" alt="home" ><span>Filter</span>
        </button>
      </div>
      

    </div>

    <div class="mainContent">
      <div class="columnContainer">
        <div *ngFor="let column of selectedBoardColumns">
            <div class="column">
              <h1>{{column.Name}}</h1>
              <p>{{column.Board_Id}}</p>
              <p>{{column.Id}}</p>
              <button (click)="tryTasks(column.Id,column.Board_Id)">try</button>


            </div>

        </div>

        <button class="newColumnButton">
          Add a new column
        </button>

        

      </div>
    </div>

    


  `,
  styleUrl: './tasks-personal.component.css'
})
export class TasksPersonalComponent {

  boards : any[] = [];
  selectedBoard =  "";

  selectedBoardColumns : BoardColumn[] = [];
  columnTasks : BoardTask[] = [];


  plusSVG = "/assets/plus.svg"
  filterSVG = "/assets/filter.svg";

  constructor(private tasksService :TasksService)
  {
      this.test();
  }


  async test(){
    this.selectedBoardColumns = await this.tasksService.getAllColumns("Default")
    let boardnames = await this.tasksService.getAllBoardsNames();
    this.boards = boardnames.map(option => ({value:option,viewValue:option}));
    this.selectedBoard=this.boards[0].viewValue;

    
    
  }


  async onBoardChange(value: string){
    console.log('Selected status:', value);
    this.selectedBoard=this.boards[0].viewValue;
    this.selectedBoardColumns = await this.tasksService.getAllColumns(value)
  }

  async tryTasks(colId:string,boardId:string){
    return await this.tasksService.getTasks(colId,boardId);

  }



  async loadTasks(colId:string,boardId:string)
  {
    this.columnTasks = await this.tasksService.getTasks(colId,boardId);
    console.log(this.columnTasks);
  }


}
