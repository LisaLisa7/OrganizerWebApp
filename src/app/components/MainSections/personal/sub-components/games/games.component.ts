import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../../../../interfaces/personal-interfaces/game';
import { GamesService } from '../../../../../services/personal-services/games.service';
import { FormsModule } from '@angular/forms';
import { InsertGameDialogComponent } from '../dialogs/insert-game-dialog/insert-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule,FormsModule,InsertGameDialogComponent],
  template: `
    <div class="pageContainer">

      <div class="searchContainer">

        <section>
          <form>
            <input type="text" placeholder="Search game" name="inputName" [(ngModel)]="inputName"  >
            <button class="primary" type="button" (click)="searchByName(inputName)">Search</button>
          </form>
        </section>

      </div>

      
      <h3>Page {{currentPage}}/{{totalPages}}</h3>

      <div class="gamesContainer">

            <div *ngFor="let game of gameData" class="card" (click)="openDialog(game)">
              <h1>{{game.Name}}</h1>
              <img src = {{game.URL}}>
              <p>Studio : {{game.Studio}}</p>
              <p>Genres: {{game.Genres}}</p>
              <p>Tags: {{game.Tags}}</p>
              <p>Available on : {{game.Platforms}}</p>
            </div>
      

      </div>

      <div class = "navigatorContainer">
        <div *ngIf="totalPages > 1">
            <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
            <button *ngFor="let page of pageNumbers" (click)="changePage(page)" [class.active]="page === currentPage">{{ page }}</button>

            <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Next</button>
        </div>

        <input type="number" placeholder="page number" [(ngModel)]="inputPage">
        <button (click)="changePage(inputPage)">Go</button>
      </div>

      

    </div>
    
  `,
  styleUrl: './games.component.css'
})
export class GamesComponent {

  gameData : Game[] = [];
  inputName : string = '';
  inputPage : number = 1;

  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  pageNumbers: number[] = []; // Array to store dynamically generated page numbers


  async changePage(pageNumber : number) {
    if (pageNumber >=1 && pageNumber <= this.totalPages)
      {
        this.currentPage = pageNumber;
        await this.loadData();
      }
  }

  generatePageNumbers() {
    const maxPageButtonsToShow = 5;
    const middleIndex = Math.floor(maxPageButtonsToShow / 2);

    // Clear existing page numbers
    this.pageNumbers = [];

    // Calculate starting and ending page numbers
    let startPage = Math.max(1, this.currentPage - middleIndex);
    let endPage = Math.min(this.totalPages, startPage + maxPageButtonsToShow - 1);

    if (endPage - startPage < maxPageButtonsToShow - 1) {
      startPage = Math.max(1, endPage - maxPageButtonsToShow + 1);
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
    this.generatePageNumbers();

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

    //this.registryService.getEntriesByMonth();
    const dialogRef = this.dialog.open(InsertGameDialogComponent, {
      width: '500px', // Adjust the width as needed
      data: {game} // Optionally pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('Dialog closed with result:', result);
      
      

    });
  }

}
