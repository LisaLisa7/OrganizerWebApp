import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../../../../interfaces/personal-interfaces/game';
import { GamesService } from '../../../../../services/personal-services/games.service';
import { FormsModule } from '@angular/forms';
import { InsertGameDialogComponent } from '../dialogs/lists-dialogs/insert-game-dialog/insert-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GameDetailsDialogComponent } from '../dialogs/lists-dialogs/game-details-dialog/game-details-dialog.component';
@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule,FormsModule,InsertGameDialogComponent],
  template: `
    <div class="pageContainer">

      <div class="searchContainer">

        <section>
          <form>
            <label name="inputName"></label>
            <input type="text" placeholder="Search game" name="inputName" [(ngModel)]="inputName"  >
            <button class="primary" type="button" (click)="searchByName(inputName)">Search</button>
          </form>
        </section>

      </div>

      <br>
     

      <div class="gamesContainer">
            
            <div *ngFor="let game of gameData" class="stack" >
              
              <div class="card">
                
                <img src = {{game.URL}}>
                <h3>{{game.Name}}</h3>
                
                <p>Studio : {{game.Studio}}</p>
                <p>Available on : {{game.Platforms}}</p>
                <div class="actionButtonsContainer">
                  <button (click)="openDialogDetails(game)">Details</button>
                  <button (click)="openDialog(game)">Add</button>
                </div>
              </div>
            </div>
      

      </div>

      <div class = "navigatorContainer">
      <h3>Page {{currentPage}}/{{totalPages}}</h3>
        <div *ngIf="totalPages > 1">
            <button class="arrowButton" (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
            <button class="pageButton" *ngFor="let page of pageNumbers" (click)="changePage(page)" [class.active]="page === currentPage">{{ page }}</button>

            <button class="arrowButton"  (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Next</button>
        </div>

        <label name="pageNumber"></label>
        <input type="number" placeholder="page number" name="pageNumber" [(ngModel)]="inputPage">
        <button class="primary" (click)="changePage(inputPage)">Go</button>
      </div>

      

    </div>
    
  `,
  styleUrl: './games.component.css'
})
export class GamesComponent {

  gameData : Game[] = [];
  inputName : string = '';
  inputPage : number = 1;
  pinPath = "/assets/pin2.svg"

  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  pageNumbers: number[] = []; // Array to store dynamically generated page numbers


  async changePage(pageNumber : number) {
    if (pageNumber >=1 && pageNumber <= this.totalPages)
      {
        this.currentPage = pageNumber;
        await this.loadData();
        this.generatePageNumbers();
      }
  }

  generatePageNumbers() {
    const maxButtons= 5;

    
    
    this.pageNumbers = [];
    let startPage,endPage;

   
    startPage =this.currentPage;
    endPage = this.currentPage+5;
    

    

    
    if(endPage > this.totalPages)
      {
        endPage = this.totalPages
        startPage = endPage -5 
      }


    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }
  }


  constructor(public dialog: MatDialog,private gameService:GamesService)
  {
    this.loadData();
  }

  async loadData(){
    let data;
    data = await this.gameService.getPaginated(this.currentPage,this.itemsPerPage,undefined)
    this.gameData = data.items;
    this.totalPages = data.totalPages;
    //this.generatePageNumbers(false);

  }

  async searchByName(name:string){

    if(name === '')
    {
      this.loadData();
    }
    else{

    this.gameData =  await this.gameService.getGameByName(name)
    this.currentPage = 1;
    this.totalPages= 1;
    this.generatePageNumbers();
    }
    
  }



  openDialog(game : Game): void {

    const dialogRef = this.dialog.open(InsertGameDialogComponent, {
      width: '500px', 
      data: {game} 
    });

    dialogRef.afterClosed().subscribe(result => {
      
      console.log('Dialog closed with result:', result);
      
      

    });
  }

  openDialogDetails(game : Game): void {

    const dialogRef = this.dialog.open(GameDetailsDialogComponent, {
      width: '500px', 
      data: {game} 
    });
  }


}
