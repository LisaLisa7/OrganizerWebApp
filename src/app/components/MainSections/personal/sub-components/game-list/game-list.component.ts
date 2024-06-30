import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../../../../services/personal-services/games.service';
import { ListGame } from '../../../../../interfaces/personal-interfaces/list-game';
import { Subject, takeUntil } from 'rxjs';
import { GameUpdateDialogComponent } from '../dialogs/lists-dialogs/game-update-dialog/game-update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pageContainer" >
      <div class="container">
        
          <div *ngFor="let status of statusArray" class="statusContainer">
            
          <button type="button" class="tab tab-selector" [ngClass]="{'active': status === currentStatus}" (click)="buttonClick(status)">{{ status }}</button>

          </div>

          <div class="gameContainer">

          <table>
            <thead>
              <tr>
                <th (click)="sort('Name')">Name</th>
                <th>Status</th>
                <th (click)="sortRating()" class="clickable">Rating</th>
                <th>Review</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let game of gameData" (click)="actions(game)">
                <td>{{game.Name}}</td>
                <td>{{game.Status}}</td>
                <td >{{game.Rating}}/10</td>
                <td>{{game.Review}}</td>
                <td class="td"><div class="separator"></div></td>
                <td>
                  <div class="buttonContainer">
                  <button (click)="deleteEntry(game)">Delete</button>
                  <button (click)="modifyEntry(game)">Modify</button>
                  </div>
                </td>                

              </tr>
            </tbody>


          </table>

          </div>
     

      </div>
    </div>
  `,
  styleUrl: './game-list.component.css'
})
export class GameListComponent {

  statusArray = ['All','Playing','Finished','Plan to Play','On Hold', 'Dropped'];

  gameData : ListGame[] = [];

  currentStatus :string = 'All'
  ascending = true;


  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();


  constructor(private gamesService:GamesService,public dialog: MatDialog,private confirmService:ConfirmationDialogService)
  {
    //this.loadData();
    this.gamesService.entryDeleted$.pipe(takeUntil(this.unsubscribeDelete$)).subscribe(() => {

      if(this.currentStatus!= 'All')
        this.getGamesByStatus(this.currentStatus)
      else
        this.loadData();

    });
    this.gamesService.entryModified$.pipe(takeUntil(this.unsubscribeModified$)).subscribe(() => {

      if(this.currentStatus!= 'All')
        this.getGamesByStatus(this.currentStatus)
      else
        this.loadData();

    });
    
  }


  sort(name:string){
    console.log(name);

  }

  sortRating(){

    if(this.ascending == true)
    {
      console.log(1);
      this.gameData.sort((a, b) => a.Rating - b.Rating);
      this.ascending = false;
    }
    else
    {
      console.log(2);
      this.gameData.sort((a, b) => b.Rating - a.Rating);
      this.ascending = true;

    }

    console.log("sort");
  }



  async loadData(){
    this.gameData = await this.gamesService.getAllList();
    
  }

  async actions(game:ListGame){
    console.log(game);
  }

  async deleteEntry(entry: ListGame){
    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this game?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
      console.log(entry);
      await this.gamesService.deleteListGame(entry.Id)
      this.gamesService.deleteEntry();
    }
    
    //this.loadEntries();
  }

  async modifyEntry(entry:ListGame){
    
    console.log("ok")
    //console.log(entry)
    const dialogRef = this.dialog.open(GameUpdateDialogComponent,{
      width: '500px', 
      data: {entry} 
    })
    
    dialogRef.afterClosed().subscribe((result: any) => {
      this.gamesService.modifyEntry();
      //this.loadEntries();
      
    });
  }



  buttonClick(status:string){

    this.currentStatus = status
    switch(status)
    {
      case 'All':
        this.getAllGames();
        break;
      default:
        this.getGamesByStatus(status);


    }
  }

  async getAllGames(){
    this.gameData = await this.gamesService.getAllList();
  }

  async getGamesByStatus(status:string)
  {
    console.log(status);
    this.gameData = await this.gamesService.getGamesByStatus(status);
  }


}
