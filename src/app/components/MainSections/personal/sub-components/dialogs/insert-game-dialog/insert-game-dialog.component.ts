import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from '../../../../../../interfaces/personal-interfaces/game';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule for input fields
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { GamesService } from '../../../../../../services/personal-services/games.service';


@Component({
  selector: 'app-insert-game-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Insert in your list</h2>
    <div *ngIf="showWarning" class="warning-message" style="color: red;">Please complete all required fields!</div>

    <div mat-dialog-conent>
      <h1>{{game.Name}}</h1>
      <img [src] ="game.URL">

      <mat-form-field>
        <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="formData.Status"
           name="Source" required>
            @for (stat of statusOptions; track stat){
              <mat-option [value] = "stat.value">{{stat.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Rating</mat-label>
          <input matInput type="number" placeholder="Rating" [(ngModel)]="formData.Rating" min=1 max=10
                name="Rating" >
        </mat-form-field>

        <mat-form-field>
          <mat-label>Review</mat-label>
          <textarea matInput placeholder="Ex. It makes me feel..." [(ngModel)]="formData.Review"></textarea>

        </mat-form-field>
        



    </div>

    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>

  `,
  styleUrl: './insert-game-dialog.component.css'
})
export class InsertGameDialogComponent {

  game:any;
  formData: any = {};
  showWarning= false;

  readonly statusOptions = [
    { value: 'Plan to Play', viewValue: 'Plan to Play' },
    { value: 'Playing', viewValue: 'Playing' },
    { value: 'On Hold', viewValue: 'On Hold' },
    { value: 'Finished', viewValue: 'Finished' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private gameService:GamesService,public dialogRef:MatDialogRef<InsertGameDialogComponent>){
    this.game = data['game'];
    console.log(this.game);
    this.formData.GameId = this.game.Id;

  }

  printForm(){
    console.log(this.formData);
  }

  onSubmit(){

    if(this.formData.Status)
    {
      this.gameService.insertGameIntoList(this.formData);
      this.dialogRef.close();
    }
    else
    {
      this.showWarning = true;
    }
  }

  onClose(){
    console.log(this.formData);
  }
  
}
