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

@Component({
  selector: 'app-tasks-academic',
  standalone: true,
  imports: [MatSelectModule,CommonModule,FormsModule,MatProgressBarModule,ParentTaskComponent],
  template: `
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
        <button >
        <img [src]="plusSVG" alt="newBoard"><span>New Project</span>
        </button>
        <button >
        <img [src]="labelSVG" alt="labels" ><span>Labels</span>
        </button>
        <button>
        <img [src]="filterSVG" alt="filter" ><span>Filter</span>
        </button>
      </div>
    </div>
    <div class="mainContent">

      <div *ngIf="isLoading">Loading...</div>
      <div *ngIf="!isLoading" class="projectsContainer">
        <div *ngFor="let t of projectParentTasks">
          <div class="task">
            <app-parent-task [task]="t" [tasks]="projectTasks"></app-parent-task>
          </div>

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
  labelSVG = "/assets/label.svg";
  updateSVG = "/assets/settings.svg";


  constructor(private classService:ClassesService,private projectService:ProjectsService,private taskService:ClassTasksService,private confirmService:ConfirmationDialogService,public dialog:MatDialog){

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
    //this.selectedBoardColumns = await this.tasksService.getAllColumns(value)
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

    this.projects = projectNames.map(option => ({value:option,viewValue:option}));
    this.selectedProject = this.projects[0].viewValue;
    this.selectedProjectId = await this.projectService.getProjectId(this.selectedProject);

  }

  getParentTasks(): ClassTask[] {
    return this.selectedProject ? this.projectTasks.filter(task => !task.parentTask) : [];
  }

  /*
  openProjectDialog(){
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '500px', 
      data: {class_id : this.selectedClassId} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadProjectsAndTasks();
    });
  }
  openLabelsDialog(){
    const dialogRef = this.dialog.open(NewClassDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.test();
    });
  }

  async deleteProject(id:string){

    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this project?\nAll its tasks will also be deleted");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
    
    await this.projectService.deleteProject(id);

    await this.loadProjectsAndTasks();

    }

  }

  getCompletionPercentage(tasks: ClassTask[]): number {
    if(tasks.length === 0)
    {
      return 0;
    }
    const totalPercentage = tasks.reduce((sum, task) => sum + task.completion, 0);
    return totalPercentage / tasks.length;
  }

  openUpdateProjectDialog(p:Project){
    console.log(p);
    p.class_id = this.selectedClassId;
    const dialogRef = this.dialog.open(UpdateProjectDialogComponent, {
      width: '500px',
      data : p
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadProjectsAndTasks();
    });

  }
    */
}
