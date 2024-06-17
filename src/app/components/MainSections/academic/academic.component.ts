import { Component, ViewChild, ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HomeAcademicComponent } from './subComponents/home-academic/home-academic.component';
import { ScheduleComponent } from './subComponents/schedule/schedule.component';
import { ProjectComponent } from './subComponents/project/project.component';
import { TasksAcademicComponent } from './subComponents/tasks-academic/tasks-academic.component';
@Component({
  selector: 'app-academic',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,FormsModule,MatIconModule],
  template: `
    <mat-sidenav-container>
      <mat-sidenav [(opened)]="opened">
        <div class="button-container">
          <div>
          <button (click)="createHomeComponent()"><img [src]="homeSVG" alt="home"><span>Home</span></button>
          <button (click)="createSheduleComponent()"><img [src]="classSVG" alt="classes"><span>Schedule</span></button>
          <button (click)="createProjectsComponent()"><img [src]="projectSVG" alt="projects"><span>Projects</span></button>
          <button (click)="createTasksComponent()"><img [src]="taskSVG" alt="tasks"><span>Tasks</span></button>
          
          </div>
          <div>
          <button><img [src]="helpSVG" alt="help"><span>Help</span></button>
          <button class="bottomButton"><img [src]="settingsSVG" alt="settings"><span>Settings</span></button>
          </div>
          
        </div>
      </mat-sidenav>
      <mat-sidenav-content [style.marginLeft]="opened ? '200px' : '0' ">
        <div class = "toggle-button-container">
          <button mat-button (click)="toggleSidenav()">
            <img class = "buttonTogglePic" [src]="toggleSVGCollapse">
          </button>
        </div>
        <ng-container #dynamicComponentContainer class="custom-registry-container"></ng-container>

        

      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrl: './academic.component.css'
})
export class AcademicComponent {

  taskSVG = "/assets/tasks.svg";
  classSVG = "/assets/classes.svg";
  projectSVG = "/assets/project.svg";

  toggleSVGCollapse = "/assets/arrowLeft.svg";
  homeSVG = "/assets/home.svg";
  settingsSVG = "/assets/settings.svg"
  helpSVG = "/assets/help.svg";


  //toggleSVGExpand = "/assets/arrowRight.svg";
  opened = true;


  toggleSidenav(): void {
    this.opened = !this.opened;
  }
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit(): void {
    // Now dynamicComponentContainer is guaranteed to be defined
  }
  createHomeComponent() : void{
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(HomeAcademicComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createSheduleComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(ScheduleComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }
  createProjectsComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(ProjectComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createTasksComponent():void{
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(TasksAcademicComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);

  }




}
