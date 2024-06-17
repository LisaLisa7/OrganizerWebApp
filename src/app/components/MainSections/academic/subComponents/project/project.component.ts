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

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [MatSelectModule,CommonModule,FormsModule],
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
        <button (click)="deleteProject()">
        <img [src]="deleteSVG" alt="delete" ><span>Delete Project</span>
        </button>
      </div>


    </div>
    <div class="mainContent">

      <div *ngIf="isLoading">Loading...</div>
      <div *ngIf="!isLoading" class="projectsContainer">

          <div *ngFor="let p of selectedClassProjects">
            <div class="project">
              <h1>{{p.title}}</h1>
              <h3>{{p.startDate}}</h3>
              <h3>{{p.finishDate}}</h3>
              

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
  labelSVG = "/assets/label.svg"

  constructor(private classService:ClassesService,private projectService:ProjectsService,private taskService:ClassTasksService,public dialog:MatDialog){

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
    const dialogRef = this.dialog.open(NewClassDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.test();
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

  async deleteProject(){

  }


}
