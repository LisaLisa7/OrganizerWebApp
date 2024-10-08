import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../../shared/error-dialog/error-dialog.component';
import { MoviesService } from '../../../../../../../services/personal-services/movies.service';

@Component({
  selector: 'app-insert-movie-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
  <div class="dialog">

    <div mat-dialog-title class="dialogTitle">New movie</div>

    <div mat-dialog-content>

      <form>
        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title"name="Title" required>

        </mat-form-field>

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
  </div>
  `,
  styleUrl: './insert-movie-dialog.component.css'
})
export class InsertMovieDialogComponent {

  formData: any = {};

  readonly statusOptions = [
    { value: 'Plan to Watch', viewValue: 'Plan to Watch' },
    { value: 'Watched', viewValue: 'Watched' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  
  async onSubmit(){
    console.log(this.formData);
    

    if(this.formData.Status && this.formData.Title)
    {

      if(this.formData.Rating && (this.formData.Rating>10 || this.formData.Rating<1))
          this.openDialog("Rating must be between 1 and 10!");
      else
      {
        this.moviesService.insertMovieIntoList(this.formData);
        this.dialogRef.close();
      }
      
    }
    else
    {
      this.openDialog("Please complete the necessary fields");
    }
    
  }

  onClose(){
    console.log(this.formData);
    this.dialogRef.close();
  }


  constructor(public dialog: MatDialog,private moviesService:MoviesService,public dialogRef:MatDialogRef<InsertMovieDialogComponent>){

  }


  
  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });
  }


}
