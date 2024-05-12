import { Component, ViewChild, ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GameListComponent } from './sub-components/game-list/game-list.component';
import { GamesComponent } from './sub-components/games/games.component';
import { MovieListComponent } from './sub-components/movie-list/movie-list.component';
import { BookListComponent } from './sub-components/book-list/book-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ExportListsDialogComponent } from './sub-components/dialogs/export-lists-dialog/export-lists-dialog.component';

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
          <button (click)="toggleSubButtons()"><img [src]="gameSVG" alt="games"><span>Games</span><img [src]="expansSVG" style="float: right; height : 20px; margin-top : 5px;"></button>
          <div *ngIf="showSubButtons">
            <button (click) = "createBrowseGamesComponent()" >Browse Games</button>
            <button (click)="createGameListComponent()">Your Game List</button>
          </div>

          <button (click)="createMovieListComponent()"><img [src]="movieSVG" alt="movies"><span>Movie List</span></button>
          <button (click)="createBookListComponent()"><img [src]="bookSVG" alt="books"><span>Book List</span></button>
          <button (click)="openExportDialog()" ><img [src]="exportSVG" alt="export"><span>Export</span></button>
          


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
  expansSVG = "/assets/down-arrow.svg";


  //toggleSVGExpand = "/assets/arrowRight.svg";
  opened = true;

  showSubButtons: boolean = false;

  toggleSubButtons() {
    this.showSubButtons = !this.showSubButtons;
  }


  toggleSidenav(): void {
    this.opened = !this.opened;
  }
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,public dialog:MatDialog) {}

  ngAfterViewInit(): void {
    // Now dynamicComponentContainer is guaranteed to be defined
  }
  createGameListComponent() : void{
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(GameListComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createBrowseGamesComponent(): void {
    // Clear existing components in the container
    this.dynamicComponentContainer.clear();

    // Dynamically create the RegistryComponent
    const factory = this.componentFactoryResolver.resolveComponentFactory(GamesComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }
  createMovieListComponent(): void {
    // Clear existing components in the container
    this.dynamicComponentContainer.clear();

    // Dynamically create the RegistryComponent
    const factory = this.componentFactoryResolver.resolveComponentFactory(MovieListComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }


  createBookListComponent(): void {
    // Clear existing components in the container
    this.dynamicComponentContainer.clear();

    // Dynamically create the RegistryComponent
    const factory = this.componentFactoryResolver.resolveComponentFactory(BookListComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  openExportDialog(){
    const dialogRef = this.dialog.open(ExportListsDialogComponent, {
      width: '500px', // Adjust the width as needed
      data: {} // Optionally pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('Dialog closed with result:', result);
      
    });
  }


}
