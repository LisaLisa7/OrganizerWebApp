import { Component } from '@angular/core';
import { MoviesService } from '../../../../../services/personal-services/movies.service';
import { CommonModule } from '@angular/common';
import { ListMovie } from '../../../../../interfaces/personal-interfaces/list-movie';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { InsertMovieDialogComponent } from '../dialogs/lists-dialogs/insert-movie-dialog/insert-movie-dialog.component';
import { MovieUpdateDialogComponent } from '../dialogs/lists-dialogs/movie-update-dialog/movie-update-dialog.component';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';

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
                <th class="clickable" (click)="sortRating()">Rating</th>
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
  ascending = false;

  
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();

  constructor(private moviesService : MoviesService,public dialog: MatDialog,private confirmService:ConfirmationDialogService){

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

  sortRating(){

    if(this.ascending == true)
    {
      console.log(1);
      this.movieData.sort((a, b) => a.Rating - b.Rating);
      this.ascending = false;
    }
    else
    {
      console.log(2);
      this.movieData.sort((a, b) => b.Rating - a.Rating);
      this.ascending = true;

    }

    console.log("sort");
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
    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this movie?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
      console.log(entry);
      await this.moviesService.deleteListMovie(entry.Id)
      this.moviesService.deleteEntry();
    }
    
    //this.loadEntries();
  }

  async modifyEntry(entry:ListMovie){
    
    console.log("ok")
    //console.log(entry)
    const dialogRef = this.dialog.open(MovieUpdateDialogComponent,{
      width: '500px',
      data: {entry} 
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
      width: '500px', 
      data: {} 
    })
    
    dialogRef.afterClosed().subscribe((result: any) => {
      this.moviesService.modifyEntry();
      //this.loadEntries();
      
    });

  }


}
