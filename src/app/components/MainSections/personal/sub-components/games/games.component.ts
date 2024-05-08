import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../../../../interfaces/personal-interfaces/game';
import { GamesService } from '../../../../../services/personal-services/games.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule,FormsModule],
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

      <div class="gamesContainer">

            <div *ngFor="let game of gameData" class="card">
              <h1>{{game.Name}}</h1>
              <img src = {{game.URL}}>
              <p>Studio : {{game.Studio}}</p>
              <p>Main Categories: {{game.MainCategories}}</p>
              <p>Second Categories: {{game.SecondCategories}}</p>
              <p>Available on : {{game.Platforms}}</p>
            </div>
      

      </div>
    </div>
    
  `,
  styleUrl: './games.component.css'
})
export class GamesComponent {

  gameData : Game[] = [];
  inputName : string = '';


  async getAllGames(){
    //this.gameData = await this.gamesService.getAllGames();

  }

  parseJson(jsonString: string): any {
    return JSON.parse(jsonString);
  }

  constructor(private gameService:GamesService)
  {
    this.loadData();
  }

  async loadData(){
    this.gameData = await this.gameService.getAllGames();
  }

  async searchByName(name:string){
    this.gameData = await this.gameService.getGameByName(name);
  }

}
