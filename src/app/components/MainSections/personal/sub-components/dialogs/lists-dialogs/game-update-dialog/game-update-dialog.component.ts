import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../../shared/error-dialog/error-dialog.component';
import { GamesService } from '../../../../../../../services/personal-services/games.service';

@Component({
  selector: 'app-game-update-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
<div class="dialog">
  <div mat-dialog-title class="dialogTitle">Insert in your list</div>

  <div mat-dialog-content>
    <h1>{{formData.Name}}</h1>

    <form (submit)="onClose()">
      <mat-form-field>
        <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="formData.Status"
          name="Status" required (ngModelChange)="updateData.Status = $event">
            @for (stat of statusOptions; track stat){
              <mat-option [value] = "stat.value">{{stat.viewValue}}</mat-option>
            }
          </mat-select>
      </mat-form-field>

      
        <mat-form-field>
          <mat-label>Rating</mat-label>
          <input matInput type="number" placeholder="Rating" [(ngModel)]="formData.Rating" min=1 max=10
                name="Rating"  (ngModelChange)="updateData.Rating = $event">
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Review</mat-label>
          <textarea matInput placeholder="It makes me feel..." name="Review" [(ngModel)]="formData.Review" (ngModelChange)="updateData.Review = $event"></textarea>

        </mat-form-field>

      </form>
      
  </div>

  <div mat-dialog-actions class="buttonContainer">
    <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
    <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
  </div>
</div>
  `,
  styleUrl: './game-update-dialog.component.css'
})
export class GameUpdateDialogComponent {


  
  formData: any = {};
  updateData:any = {};
  

  readonly statusOptions = [
    { value: 'Plan to Play', viewValue: 'Plan to Play' },
    { value: 'Playing', viewValue: 'Playing' },
    { value: 'On Hold', viewValue: 'On Hold' },
    { value: 'Finished', viewValue: 'Finished' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog: MatDialog,private gameService:GamesService,public dialogRef:MatDialogRef<GameUpdateDialogComponent>){

    console.log(data.entry);
    this.formData = data.entry;
  }

  
  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message}
    });
  }

  
  async onSubmit(){

    if(this.formData.Status)
    {
      if(this.formData.Rating && (this.formData.Rating>10 || this.formData.Rating<1))
        this.openDialog("Rating must be between 1 and 10!");
      else
      {
        this.gameService.updateListGame(this.formData.Id,this.updateData);
        console.log(this.updateData);
        this.dialogRef.close();
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
