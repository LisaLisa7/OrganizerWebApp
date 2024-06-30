import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../../../../services/personal-services/tasks.service';
import { BoardColumn } from '../../../../../interfaces/personal-interfaces/board-column';
import { BoardTask } from '../../../../../interfaces/personal-interfaces/board-task';
import { MatDialog } from '@angular/material/dialog';
import { NewBoardColumnDialogComponent } from '../dialogs/new-board-column-dialog/new-board-column-dialog.component';
import { NewBoardDialogComponent } from '../dialogs/new-board-dialog/new-board-dialog.component';
import { NewBoardColumnTaskDialogComponent } from '../dialogs/new-board-column-task-dialog/new-board-column-task-dialog.component';
import { SeeBoardColumnTaskDialogComponent } from '../dialogs/see-board-column-task-dialog/see-board-column-task-dialog.component';
import { SeeLabelsDialogComponent } from '../dialogs/see-labels-dialog/see-labels-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tasks-personal',
  standalone: true,
  imports: [MatSelectModule,CommonModule,FormsModule],
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
        <button (click)="openBoardDialog()">
        <img [src]="plusSVG" alt="newBoard"><span>New board</span>
        </button>
        <button (click)="openLabelsDialog()">
        <img [src]="labelSVG" alt="labels" ><span>Labels</span>
        </button>
        
        <button (click)="deleteBoard()">
        <img [src]="deleteSVG" alt="delete" ><span>Delete Board</span>
        </button>
      </div>
      

    </div>

    <div class="mainContent">
        <div *ngIf="isLoading">Loading...</div>
        <div *ngIf="!isLoading" class="columnContainer">
          <div *ngFor="let column of selectedBoardColumns">
            <div class="column">
              <button (click)="deleteColumn(column.Id)" class="deleteColButton"><span><img class="deleteColImg" [src]="deleteSVG"></span></button>
              <h1>{{ column.Name }}</h1>

              <div *ngIf="columnsTasks[column.Id]">
                <ul>
                  <li (click)="openSeeTaskDialog(task)" *ngFor="let task of columnsTasks[column.Id]" [ngClass]="{ 'crossed-out': task.Done }" >
                  {{ task.Title }}
                  <div class="labels">
                  <span *ngFor="let label of task.Labels" [style.backgroundColor]="label.Color" class="label">
                    {{ label.Name }} 
                  </span>
                </div>
                  </li>
                </ul>
              </div>
              <div class="buttonContainer2">
                <button class="newTaskButton" (click)="openTaskDialog(column.Id)"><span><img class = "newTaskImg" [src]="plusSVG"></span></button> 
              </div>
            </div>
          </div>
          <button (click)="openColumnDialog()" class="newColumnButton">
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
  selectedBoardId = "";

  selectedBoardColumns : BoardColumn[] = [];
  columnsTasks: { [key: string]: BoardTask[] } = {};
  isLoading : boolean = true;


  plusSVG = "/assets/plus.svg"
  filterSVG = "/assets/filter.svg";
  deleteSVG = "/assets/delete.svg";
  labelSVG = "/assets/label.svg"

  constructor(private tasksService :TasksService,public dialog:MatDialog)
  {
      
  }


  async test(){
    
    let boardnames = await this.tasksService.getAllBoardsNames();
    this.boards = boardnames.map(option => ({value:option,viewValue:option}));
    this.selectedBoard=this.boards[0].viewValue;
    this.selectedBoardId = await this.tasksService.getBoardId(this.selectedBoard);
    
    
    
  }

  async ngOnInit(): Promise<void> {
    await this.test();
    await this.loadColumnsAndTasks();
  }


  async onBoardChange(value: string){
    this.isLoading = true;
    console.log('Selected status:', value);
    this.selectedBoard= value;
    this.selectedBoardId = await this.tasksService.getBoardId(this.selectedBoard);

    console.log(this.selectedBoard)
    //this.selectedBoardColumns = await this.tasksService.getAllColumns(value)
    await this.loadColumnsAndTasks();
  
  }

  async tryTasks(colId:string,boardId:string){
    console.log("here");
    return await this.tasksService.getTasks(colId,boardId);

  }

  async loadColumnsAndTasks(): Promise<void> {
    try {
      this.selectedBoardColumns = await this.tasksService.getAllColumns(this.selectedBoard);
      //console.log(this.selectedBoardColumns);
      for (const column of this.selectedBoardColumns) {
        console.log(column);
        this.columnsTasks[column.Id] = await this.tryTasks(column.Id, column.Board_Id);

        
        console.log(this.columnsTasks[column.Id])
      }
    } catch (error) {
      console.error('Error loading columns and tasks:', error);
    } finally {
      this.isLoading = false;
    }
  }


  /*
  async loadTasks(colId:string,boardId:string)
  {
    this.columnTasks = await this.tasksService.getTasks(colId,boardId);
    console.log(this.columnTasks);
  }*/

  openBoardDialog(){
    const dialogRef = this.dialog.open(NewBoardDialogComponent, {
      width: '500px',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.test();
    });
  }

  openColumnDialog(){
    const dialogRef = this.dialog.open(NewBoardColumnDialogComponent, {
      width: '500px', 
      data: {'id' : this.selectedBoardId} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadColumnsAndTasks();

    });
  }

  openTaskDialog(columnId : string){
    const dialogRef = this.dialog.open(NewBoardColumnTaskDialogComponent, {
      width: '500px',
      data: {'id_board' : this.selectedBoardId, 'id_col' : columnId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadColumnsAndTasks();

    });
  }

  openLabelsDialog(){
    const dialogRef = this.dialog.open(SeeLabelsDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.loadColumnsAndTasks();

    });
  }


  openSeeTaskDialog(task:BoardTask){
    //console.log(task)
    const dialogRef = this.dialog.open(SeeBoardColumnTaskDialogComponent, {
      width: '500px', 
      data:  task  
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadColumnsAndTasks();

    });

  }


  async deleteBoard(){

    
    const dialogRef = this.tasksService.openConfirmDialog("Are you sure you want to delete this board?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
      await this.tasksService.deleteBoard(this.selectedBoardId);
      
      await this.test();
      await this.loadColumnsAndTasks();
    
    }

  }

  async deleteColumn(id:string){
    
    const dialogRef = this.tasksService.openConfirmDialog("Are you sure you want to delete this column?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
    
    await this.tasksService.deleteColumn(id);

    await this.loadColumnsAndTasks();

    }
  }

  


}
