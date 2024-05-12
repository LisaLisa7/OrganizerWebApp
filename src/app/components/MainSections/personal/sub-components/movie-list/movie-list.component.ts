import { Component } from '@angular/core';
import { MoviesService } from '../../../../../services/personal-services/movies.service';
import { CommonModule } from '@angular/common';
import { ListMovie } from '../../../../../interfaces/personal-interfaces/list-movie';
import { MatDialog } from '@angular/material/dialog';
import { InsertMovieDialogComponent } from '../dialogs/insert-movie-dialog/insert-movie-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { MovieUpdateDialogComponent } from '../dialogs/movie-update-dialog/movie-update-dialog.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pageContainer" >
      <div class="container">

          <div class="some-buttons-container">
              <button class="newButton" (click)="openDialog()" >
                <img class ="entryButtonPic" [src]="entryButtonPath"><span>Add new entry</span>
              </button>

          </div>

        
          <div *ngFor="let status of statusArray" class="statusContainer">
            
          <button type="button" class="tab tab-selector" [ngClass]="{'active': status === currentStatus}" (click)="buttonClick(status)">{{ status }}</button>

          </div>

          <div class="gameContainer">

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Review</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let movie of movieData">
                <td>{{movie.Title}}</td>
                <td>{{movie.Status}}</td>
                <td>{{movie.Rating}}/10</td>
                <td>{{movie.Review}}</td>
                <td class="td"><div class="separator"></div></td>
                <td>
                  <div class="buttonContainer">
                  <button (click)="deleteEntry(movie)">Delete</button>
                  <button (click)="modifyEntry(movie)">Modify</button>
                  </div>
                </td>                

              </tr>
            </tbody>


          </table>

          </div>
     

      </div>
    </div>
  `,
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent {

  statusArray = ['All','Watched','Plan to Watch','Dropped'];
  readonly entryButtonPath = "/assets/plus.svg";


  movieData : ListMovie[] = [];

  currentStatus :string = 'All'

  
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();

  constructor(private moviesService : MoviesService,public dialog: MatDialog){

    this.moviesService.entryDeleted$.pipe(takeUntil(this.unsubscribeDelete$)).subscribe(() => {

      if(this.currentStatus!= 'All')
        this.getMoviesByStatus(this.currentStatus)
      else
        this.loadData();

    });
    this.moviesService.entryModified$.pipe(takeUntil(this.unsubscribeModified$)).subscribe(() => {

      if(this.currentStatus!= 'All')
        this.getMoviesByStatus(this.currentStatus)
      else
        this.loadData();

    });
  }

  async loadData(){
    this.movieData = await this.moviesService.getAllList();
    
  }

  
  buttonClick(status:string){

    this.currentStatus = status
    switch(status)
    {
      case 'All':
        this.getAllMovies();
        break;
      default:
        this.getMoviesByStatus(status);


    }
  }

  async getAllMovies(){
    this.movieData = await this.moviesService.getAllList();
  }

  async getMoviesByStatus(status:string)
  {
    console.log(status);
    this.movieData = await this.moviesService.getMoviesByStatus(status);
  }

  async deleteEntry(entry: ListMovie){
    console.log(entry);
    await this.moviesService.deleteListMovie(entry.Id)
    this.moviesService.deleteEntry();
    
    //this.loadEntries();
  }

  async modifyEntry(entry:ListMovie){
    
    console.log("ok")
    //console.log(entry)
    const dialogRef = this.dialog.open(MovieUpdateDialogComponent,{
      width: '500px', // Adjust the width as needed
      data: {entry} // Optionally pass data to the dialog
  })
  dialogRef.afterClosed().subscribe((result: any) => {
    this.moviesService.modifyEntry();
    //this.loadEntries();
    
    
  });
  }

  openDialog(){
    console.log("ok")
    //console.log(entry)
    const dialogRef = this.dialog.open(InsertMovieDialogComponent,{
      width: '500px', // Adjust the width as needed
      data: {} // Optionally pass data to the dialog
    })
    
    dialogRef.afterClosed().subscribe((result: any) => {
      this.moviesService.modifyEntry();
      //this.loadEntries();
      
    });

  }


}
