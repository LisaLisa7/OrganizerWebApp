import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ClassTask } from '../../../../../interfaces/academic-interfaces/class-task';
import { ClassesService } from '../../../../../services/academic-services/classes.service';
import { MatDialog } from '@angular/material/dialog';
import { NewClassDialogComponent } from '../dialogs/new-class-dialog/new-class-dialog.component';
import { ProjectsService } from '../../../../../services/academic-services/projects.service';
import { ClassTasksService } from '../../../../../services/academic-services/class-tasks.service';
import { Project } from '../../../../../interfaces/academic-interfaces/project';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NewProjectDialogComponent } from '../dialogs/new-project-dialog/new-project-dialog.component';
import { UpdateProjectDialogComponent } from '../dialogs/update-project-dialog/update-project-dialog.component';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatSelectModule,CommonModule,FormsModule,MatProgressBarModule],
  template: `
    <div class="menu-container">

      <mat-form-field>
        <mat-label >Selected Project</mat-label>
        <mat-select [(ngModel)]="selectedClass" (selectionChange)="onClassChange($event.value)"
        name="Status" >
          @for (c of classes; track c){
            <mat-option [value] = "c.value">{{c.viewValue}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <div class="button-Container">
        <button (click)="openProjectDialog()">
        <img [src]="plusSVG" alt="newBoard"><span>New Project</span>
        </button>
        <button (click)="openLabelsDialog()">
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

          <div *ngFor="let p of selectedClassProjects">
            <div class="project">
              
              <button (click)="openUpdateProjectDialog(p)" class="projectButton"><span><img class="projectImg" [src]="updateSVG"></span></button>
              <button (click)="deleteProject(p.id)" class="projectButton"><span><img class="projectImg" [src]="deleteSVG"></span></button>
              <h1>{{p.title}}</h1>
              <div class="project-content">
              
                <div *ngIf="projectTasks[p.id]" class="progress-container">
                  <div class="progress-text">
                    {{ getCompletionPercentage(projectTasks[p.id]).toFixed(0) }}%
                  </div>
                  <mat-progress-bar mode="determinate" [value]="getCompletionPercentage(projectTasks[p.id])"></mat-progress-bar>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Started</th>
                      <th>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ p.startDate | date:'dd/MM/yyyy' }}</td>
                      <td>{{ p.finishDate | date:'dd/MM/yyyy' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

      </div>

    </div>
  `,
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  classes :any[] = [];

  selectedClass = "";
  selectedClassId = "";

  selectedClassProjects : Project[] = [];
  projectTasks : { [key: string]: ClassTask[] } = {};
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
    await this.loadProjectsAndTasks();
  }

  async onClassChange(value:string){

    this.isLoading = true;
    console.log('Selected status:', value);
    this.selectedClass= value;
    this.selectedClassId = await this.classService.getClassId(this.selectedClass);

    console.log(this.selectedClass)
    //this.selectedBoardColumns = await this.tasksService.getAllColumns(value)
    await this.loadProjectsAndTasks();
  }

  async loadProjectsAndTasks(): Promise<void> {
    try {
      this.selectedClassProjects = await this.projectService.getAllProjectsByClass(this.selectedClassId);
      for (const project of this.selectedClassProjects) {
        this.projectTasks[project.id] = await this.tryTasks(project.id);
        console.log(this.projectTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async tryTasks(projectId : string){
    return await this.taskService.getAllTasksByProject(projectId);

  }

  async loadData(){

    let classesNames = await this.classService.getAllClassesNames();

    this.classes = classesNames.map(option => ({value:option,viewValue:option}));
    this.selectedClass = this.classes[0].viewValue;
    this.selectedClassId = await this.classService.getClassId(this.selectedClass);

  }

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
    const totalPercentage = tasks.reduce((sum, task) => sum + (task.done ? 1 : 0), 0);
    
    console.log(totalPercentage + " " + tasks.length);
    return totalPercentage / tasks.length * 100;
    //return 0;
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


}
