import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../../../../services/personal-services/games.service';
import { Game } from '../../../../../interfaces/personal-interfaces/game';
import { ListGame } from '../../../../../interfaces/personal-interfaces/list-game';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pageContainer" >
      <div class="container">
        
          <div *ngFor="let status of statusArray" class="statusContainer">
            
            <button type="button" class="tab tab-selector" [ngClass]="{'active': status === statusArray[0]}" (click)="buttonClick(status)">{{ status }}</button>

          </div>

          <div class="gameContainer">

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Platform</th>
                <th>Review</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let game of gameData">
                <td>{{game.Name}}</td>
                <td>{{game.Status}}</td>
                <td>{{game.Rating}}</td>
                <td>{{game.Platform}}</td>
                <td>{{game.Review}}</td>
                

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

  constructor(private gamesService:GamesService)
  {
    this.loadData();
    
  }

  async loadData(){
    this.gameData = await this.gamesService.getAllList();
    
  }


  buttonClick(status:string){

    switch(status)
    {
      case 'All':
        this.getAllGames();
        break;
      default:
        console.log(status);


    }
  }

  async getAllGames(){
    //this.gameData = await this.gamesService.getAllGames();

  }

}
