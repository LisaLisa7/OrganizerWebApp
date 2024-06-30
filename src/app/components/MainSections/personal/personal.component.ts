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
import { HomePersonalComponent } from './sub-components/home-personal/home-personal.component';
import { TasksPersonalComponent } from './sub-components/tasks-personal/tasks-personal.component';
import { SettingsDialogComponent } from '../../shared/settings-dialog/settings-dialog.component';
import { Theme, ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,FormsModule,MatIconModule],
  template: `
    <mat-sidenav-container>
      <mat-sidenav [(opened)]="opened">
        <div class="button-container">
          <div>
          <button (click)="createHomeComponent()"><img [src]="homeSVG" alt="home"><span>Home</span></button>
          <button (click)="createTasksComponent()" ><img [src]="taskSVG" alt="tasks"><span>Tasks</span></button>
          <button (click)="toggleSubButtons()"><img [src]="gameSVG" alt="games"><span>Games</span><img [src]="expansSVG" style="float: right; height : 20px; margin-top : 5px;"></button>
          <div *ngIf="showSubButtons">
            <button (click) = "createBrowseGamesComponent()" >Browse Games</button>
            <button (click)="createGameListComponent()">Your Game List</button>
          </div>

          <button (click)="createMovieListComponent()"><img [src]="movieSVG" alt="movies"><span>Movies</span></button>
          <button (click)="createBookListComponent()"><img [src]="bookSVG" alt="books"><span>Books</span></button>
          <button (click)="openExportDialog()" ><img [src]="exportSVG" alt="export"><span>Export</span></button>
          


          </div>
          <div>
          <button><img [src]="helpSVG" alt="help"><span>Help</span></button>
          <button (click)="openSettingsDialog()" class="bottomButton"><img [src]="settingsSVG" alt="settings"><span>Settings</span></button>
          </div>
          
        </div>
      </mat-sidenav>
      <mat-sidenav-content [style.marginLeft]="opened ? '200px' : '0' ">
        <div class = "toggle-button-container">
          <button class="toggle-button" mat-button (click)="toggleSidenav()">
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


  opened = true;

  showSubButtons: boolean = false;

  toggleSubButtons() {
    this.showSubButtons = !this.showSubButtons;
  }


  toggleSidenav(): void {
    this.opened = !this.opened;
  }
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,public dialog:MatDialog,private themeService:ThemeService) {

    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      const theme: Theme = JSON.parse(storedTheme);
      this.themeService.setTheme(theme);
    }

  }

  ngAfterViewInit(): void {
    
  }
  createGameListComponent() : void{
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(GameListComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createBrowseGamesComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(GamesComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }
  createMovieListComponent(): void {
 
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(MovieListComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }


  createBookListComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(BookListComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }


  createHomeComponent():void{

    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(HomePersonalComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);

  }

  createTasksComponent():void{

    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(TasksPersonalComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);

  }


  openExportDialog(){
    const dialogRef = this.dialog.open(ExportListsDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      
    });
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
