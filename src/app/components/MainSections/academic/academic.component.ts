import { Component, ViewChild, ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HomeAcademicComponent } from './subComponents/home-academic/home-academic.component';
import { ScheduleComponent } from './subComponents/schedule/schedule.component';
import { ProjectComponent } from './subComponents/project/project.component';
import { TasksAcademicComponent } from './subComponents/tasks-academic/tasks-academic.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../../shared/settings-dialog/settings-dialog.component';
import { Theme,ThemeService } from '../../../theme.service';
import { HelpAcademicComponent } from './subComponents/help-academic/help-academic.component';
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
          <button (click)="createHelpComponent()"><img [src]="helpSVG" alt="help"><span>Help</span></button>
          <button (click)="openSettingsDialog()" class="bottomButton"><img [src]="settingsSVG" alt="settings"><span>Settings</span></button>
          </div>
          
        </div>
      </mat-sidenav>
      <mat-sidenav-content [style.marginLeft]="opened ? '200px' : '0' ">
        <div class = "toggle-button-container">
          <button class="toggle-button"  mat-button (click)="toggleSidenav()">
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

  opened = true;

  toggleSidenav(): void {
    this.opened = !this.opened;
  }
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,private dialog:MatDialog,private themeService:ThemeService) {


    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      const theme: Theme = JSON.parse(storedTheme);
      this.themeService.setTheme(theme);
    }

  }

  ngAfterViewInit(): void {
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

  createHelpComponent():void{
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(HelpAcademicComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  openSettingsDialog(){

    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);

    });
    
  }

}
