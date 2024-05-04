import { Component, ViewChild, ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,FormsModule,MatIconModule],
  template: `
    <mat-sidenav-container>
      <mat-sidenav [(opened)]="opened">
        <div class="button-container">
          <div>
          <button ><img [src]="homeSVG" alt="home"><span>Home</span></button>
          <button><img [src]="taskSVG" alt="tasks"><span>Tasks</span></button>
          <button><img [src]="gameSVG" alt="games"><span>Game List</span></button>
          <button ><img [src]="movieSVG" alt="movies"><span>Movie List</span></button>
          <button><img [src]="bookSVG" alt="books"><span>Book List</span></button>
          <button><img [src]="exportSVG" alt="export"><span>Export</span></button>
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
  styleUrl: './personal.component.css'
})
export class PersonalComponent {


  
  title="finance!"
  toggleSVGCollapse = "/assets/arrowLeft.svg";
  taskSVG = "/assets/tasks.svg";
  homeSVG = "/assets/home.svg";
  settingsSVG = "/assets/settings.svg"
  helpSVG = "/assets/help.svg";
  exportSVG = "/assets/export.svg";
  gameSVG = "/assets/game.svg";
  movieSVG = "/assets/movie.svg";
  bookSVG = "/assets/book.svg";


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
  createSavingsComponent() : void{
    this.dynamicComponentContainer.clear();

    //const factory = this.componentFactoryResolver.resolveComponentFactory(SavingsComponent);
    //const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createRegistryComponent(): void {
    // Clear existing components in the container
    this.dynamicComponentContainer.clear();

    // Dynamically create the RegistryComponent
    //const factory = this.componentFactoryResolver.resolveComponentFactory(RegistryComponent);
    //const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }
  createPictogramsComponent(): void {
    // Clear existing components in the container
    this.dynamicComponentContainer.clear();

    // Dynamically create the RegistryComponent
    //const factory = this.componentFactoryResolver.resolveComponentFactory(PictogramsComponent);
    //const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }



}
