import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { GamesService } from '../../../../../../services/personal-services/games.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';


@Component({
  selector: 'app-insert-game-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Insert in your list</h2>

    <div mat-dialog-content>
      <h1>{{game.Name}}</h1>
      <img [src] ="game.URL">

      <form (submit)="onClose()">
        <mat-form-field>
          <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="formData.Status"
            name="Status" required>
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
            <textarea matInput placeholder="It makes me feel..." name="Review" [(ngModel)]="formData.Review"></textarea>

          </mat-form-field>

        </form>
        



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
  

  readonly statusOptions = [
    { value: 'Plan to Play', viewValue: 'Plan to Play' },
    { value: 'Playing', viewValue: 'Playing' },
    { value: 'On Hold', viewValue: 'On Hold' },
    { value: 'Finished', viewValue: 'Finished' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog: MatDialog,private gameService:GamesService,public dialogRef:MatDialogRef<InsertGameDialogComponent>){
    this.game = data['game'];
    console.log(this.game);
    this.formData.GameId = this.game.Id;

  }

  printForm(){
    console.log(this.formData);
  }

  
  openDialog(message:string): void {

    //this.registryService.getEntriesByMonth();
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', // Adjust the width as needed
      data: {"error":message} // Optionally pass data to the dialog
    });
  }


  async onSubmit(){

    if(this.formData.Status)
    {
      if (await this.gameService.checkIfGameExistsInList(this.formData.GameId) == false)
      {
        if(this.formData.Rating && (this.formData.Rating>10 || this.formData.Rating<1))
          this.openDialog("Rating must be between 1 and 10!");
        else
        {
          this.gameService.insertGameIntoList(this.formData);
          this.dialogRef.close();
        }
      }
      else
      {
        this.openDialog("Game is already in your list!");
        
      }
    }
    else
    {
      this.openDialog("Please complete the status field!");
    }
  }

  onClose(){
    console.log(this.formData);
    this.dialogRef.close();
  }
  
}
