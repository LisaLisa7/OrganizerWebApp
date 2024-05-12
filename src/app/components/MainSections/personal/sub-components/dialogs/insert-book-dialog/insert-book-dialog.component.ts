import { Component} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { BooksService } from '../../../../../../services/personal-services/books.service';

@Component({
  selector: 'app-insert-book-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">New book</h2>

<div mat-dialog-content>

  <form>
    <mat-form-field>
      <mat-label>Title</mat-label>
      <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title"name="Title" required>

    </mat-form-field>

    <mat-form-field>
      <mat-label>Author</mat-label>
      <input matInput type="text" placeholder="Author" [(ngModel)]="formData.Author"name="Author" required>

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
  `,
  styleUrl: './insert-book-dialog.component.css'
})
export class InsertBookDialogComponent {


  
  formData: any = {};

  readonly statusOptions = [
    { value: 'On Hold', viewValue: 'On Hold' },
    { value: 'Plan to Read', viewValue: 'Plan to Read' },
    { value: 'Reading', viewValue: 'Reading' },
    { value: 'Read', viewValue: 'Read' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  
  async onSubmit(){
    console.log(this.formData);
    

    if(this.formData.Status && this.formData.Title && this.formData.Author)
    {

      if(this.formData.Rating && (this.formData.Rating>10 || this.formData.Rating<1))
          this.openDialog("Rating must be between 1 and 10!");
      else
      {
        this.booksService.insertBookIntoList(this.formData);
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


  constructor(public dialog: MatDialog,private booksService:BooksService,public dialogRef:MatDialogRef<InsertBookDialogComponent>){

  }


  
  openDialog(message:string): void {

    //this.registryService.getEntriesByMonth();
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', // Adjust the width as needed
      data: {"error":message} // Optionally pass data to the dialog
    });
  }


}
