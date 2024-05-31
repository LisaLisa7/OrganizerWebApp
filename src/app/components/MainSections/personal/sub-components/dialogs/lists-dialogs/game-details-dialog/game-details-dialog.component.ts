import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-details-dialog',
  standalone: true,
  imports: [MatDialogModule,FormsModule],
  template: `
    <h1 mat-dialog-title style="text-align: center;">{{game.Name}}</h1>
    <div mat-dialog-content >
      <img [src] ="game.URL">
      
      <h2>{{game.Description}}</h2>
      <h3>Studio: <span> {{game.Studio}}  </span> </h3>
      <h3>Genres: <span> {{game.Genres}} </span> </h3>
      <h3>Tags: <span> {{game.Tags}} </span> </h3>
      

    </div>

  `,
  styleUrl: './game-details-dialog.component.css'
})
export class GameDetailsDialogComponent {

  game:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any){

    this.game = data['game'];
  }
}
