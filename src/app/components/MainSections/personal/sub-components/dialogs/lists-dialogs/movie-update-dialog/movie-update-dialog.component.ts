import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; 
import { MoviesService } from '../../../../../../../services/personal-services/movies.service';
import { ErrorDialogComponent } from '../../error-dialog/error-dialog.component';
@Component({
  selector: 'app-movie-update-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `<h2 mat-dialog-title style="text-align: center;">New movie</h2>

  <div mat-dialog-content>

    <form>
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title" 
        (ngModelChange)="updateData.Title = $event"   name="Title" required>

      </mat-form-field>

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
                name="Rating" (ngModelChange)="updateData.Rating = $event" >
        </mat-form-field>
        
        <mat-form-field>
        <mat-label>Review</mat-label>
        <textarea matInput placeholder="It makes me feel..." name="Review"
        (ngModelChange)="updateData.Review = $event"  [(ngModel)]="formData.Review"></textarea>

        </mat-form-field>



    </form>



  </div>

  <div mat-dialog-actions class="buttonContainer">
    <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
    <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
  </div>
    
  `,
  styleUrl: './movie-update-dialog.component.css'
})
export class MovieUpdateDialogComponent {



  formData: any = {};
  updateData:any = {};


  readonly statusOptions = [
    { value: 'Plan to Watch', viewValue: 'Plan to Watch' },
    { value: 'Watching', viewValue: 'Watching' },
    { value: 'Watched', viewValue: 'Watched' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog: MatDialog,private moviesService:MoviesService,public dialogRef:MatDialogRef<MovieUpdateDialogComponent>)
  {
    this.formData = data.entry;

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
      if(this.formData.Rating && (this.formData.Rating>10 || this.formData.Rating<1))
        this.openDialog("Rating must be between 1 and 10!");
      else
      {
        this.moviesService.updateListMovie(this.formData.Id,this.updateData);
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
    console.log(this.updateData);
    this.dialogRef.close();
  }


}
