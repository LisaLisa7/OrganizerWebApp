import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ClassTask } from '../../../../../interfaces/academic-interfaces/class-task';
import { ClassesService } from '../../../../../services/academic-services/classes.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from '../../../../../services/academic-services/projects.service';
import { ClassTasksService } from '../../../../../services/academic-services/class-tasks.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';
import { ParentTaskComponent } from '../parent-task/parent-task.component';
import { NewTaskDialogComponent } from '../dialogs/new-task-dialog/new-task-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tasks-academic',
  standalone: true,
  imports: [MatSelectModule,CommonModule,FormsModule,MatProgressBarModule,ParentTaskComponent],
  template: `
    <div class="contentContainer">
      <div class="menu-container">

        <mat-form-field>
          <mat-label >Selected Project</mat-label>
          <mat-select [(ngModel)]="selectedProject" (selectionChange)="onProjectChange($event.value)"
          name="Status" >
            @for (p of projects; track p){
              <mat-option [value] = "p.value">{{p.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="button-Container">
          <button (click)="openNewTaskDialog()" >
          <img [src]="plusSVG" alt="newBoard"><span>New Task</span>
          </button>
          
        </div>
      </div>
      <div class="mainContent">

        <div *ngIf="isLoading">Loading...</div>
        <div *ngIf="!isLoading" >
          <div *ngIf="projectParentTasks.length>0; else noTasksTemplate" class="projectsContainer">

            <div *ngFor="let t of projectParentTasks">
              <div class="tasks-container">
                <app-parent-task [task]="t" [tasks]="projectTasks"></app-parent-task>
              </div>

            </div>
          </div>

          <ng-template #noTasksTemplate>
          <div class="no-projects-message">
            No tasks for this project yet.
          </div>
        </ng-template>

        </div>
      </div>
    </div>
  `,
  styleUrl: './tasks-academic.component.css'
})
export class TasksAcademicComponent {

  projects :any[] = [];

  selectedProject = "";
  selectedProjectId = "";

  projectParentTasks : ClassTask[] = [];
  projectTasks: ClassTask[] = [];
  isLoading : boolean = true;

  plusSVG = "/assets/plus.svg"
  filterSVG = "/assets/filter.svg";
  deleteSVG = "/assets/delete.svg";
  updateSVG = "/assets/settings.svg";
  
  private unsubscribe$ = new Subject<void>();


  constructor(private classService:ClassesService,private projectService:ProjectsService,private taskService:ClassTasksService,private confirmService:ConfirmationDialogService,public dialog:MatDialog){

    this.subscribeToEntryEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  subscribeToEntryEvents() {
    this.taskService.entryAdded$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadData();
      this.loadTasks();
    });

    this.taskService.entryDeleted$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadData();
      this.loadTasks();
    });

    this.taskService.entryModified$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadData();
      this.loadTasks();
    });


  }


  async ngOnInit(): Promise<void> {
    await this.loadData();
    await this.loadTasks();
  }

  async onProjectChange(value:string){

    this.isLoading = true;
    console.log('Selected status:', value);
    this.selectedProject= value;
    this.selectedProjectId = await this.projectService.getProjectId(this.selectedProject);

    console.log(this.selectedProject)
    await this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    try {
      this.projectTasks = await this.taskService.getAllTasksByProject(this.selectedProjectId);
      this.projectParentTasks = await this.taskService.getAllParentTasksByProject(this.selectedProjectId);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadData(){

    let projectNames = await this.projectService.getAllProjectsNames();

    if(projectNames.length!=0){
      this.projects = projectNames.map(option => ({value:option,viewValue:option}));
      this.selectedProject = this.projects[0].viewValue;
      this.selectedProjectId = await this.projectService.getProjectId(this.selectedProject);
    }

  }

  getParentTasks(): ClassTask[] {
    return this.selectedProject ? this.projectTasks.filter(task => !task.parentTask) : [];
  }

  async openNewTaskDialog(){
    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '500px', 
      data: {project_id : this.selectedProjectId,
             parent_task : undefined
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadTasks();
    });
  }

  

}
