import { Component,Input } from '@angular/core';
import { ClassTask } from '../../../../../interfaces/academic-interfaces/class-task';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskDialogComponent } from '../dialogs/new-task-dialog/new-task-dialog.component';
import { ClassTasksService } from '../../../../../services/academic-services/class-tasks.service';
import { UpdateTaskDialogComponent } from '../dialogs/update-task-dialog/update-task-dialog.component';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';

@Component({
  selector: 'app-parent-task',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-container">
      <div class="task-header" (click)="toggleCollapse()">
        <h3 [ngClass]="{ 'crossed-out': task.done }">{{ task.title }}</h3>
        <p>{{ task.startDate | date:'dd/MM/yyyy' }} - {{ task.finishDate | date:'dd/MM/yyyy' }}</p>
        
      </div>
      <div class="task-body" *ngIf="!isCollapsed">
        <button (click)="openNewTaskDialog()" class="projectButton"><span><img class="projectImg" [src]="plusSVG" alt="newTask"></span></button>
        <button (click)="openUpdateTaskDialog(task)" class="projectButton"><span><img class="projectImg" [src]="updateSVG"></span></button>
        <button (click)="deleteTask(task.id)" class="projectButton"><span><img class="projectImg" [src]="deleteSVG"></span></button>
        
        
        <p >Description : {{ task.description }}</p>
        <div *ngIf="getSubTasks(task.id).length > 0">
          <h4 style="text-align: center;">Subtasks:</h4>
          <div *ngFor="let subTask of getSubTasks(task.id)">
            <app-parent-task [task]="subTask" [tasks]="tasks"></app-parent-task>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './parent-task.component.css'
})
export class ParentTaskComponent {

  @Input() task!:ClassTask;
  @Input() tasks!: ClassTask[]; //toate 
  isCollapsed : boolean = true;
  completionPercentage: number = 0;

  deleteSVG = "/assets/delete.svg";
  updateSVG = "/assets/settings.svg";
  plusSVG = "/assets/plus.svg"

  constructor(public dialog:MatDialog,private taskService:ClassTasksService,private confirmService:ConfirmationDialogService){

  }


  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getSubTasks(taskId: string): ClassTask[] {
    return this.tasks.filter(task => task.parentTask === taskId);
  }

  

  openNewTaskDialog(){
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '500px', 
      data: {project_id : this.task.project_id,
             parent_task : this.task.id
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      this.taskService.updateEntries();

    });

  }

  openUpdateTaskDialog(task:ClassTask){

    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '500px', 
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      this.taskService.modifyEntry();

    });
    
  }

  async deleteTask(id:string){
    console.log(id);

    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this task?\nAll its subtasks will also be deleted");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
    
    await this.taskService.deleteTask(id);

    this.taskService.deleteEntry();

  }}

  
}
