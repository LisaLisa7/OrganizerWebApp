import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog,MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { PictogramService } from '../../../../../../services/finance-services/pictogram.service';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; 
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-new-pictogram-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule,MatIconModule,
            FormsModule,MatFormFieldModule,MatSelectModule,
            MatInputModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;"><div *ngIf="showWarning" class="warning-message" style="color: red;">Please complete all fields!</div>Add a new pictogram</h2>
    <div mat-dialog-content>
    <form >

      <input type="file" class="file-input" accept="image/png, image/jpeg, image/gif"
        (change)="onFileSelected($event)" #fileUpload>

      <div *ngIf="sizeExceeded" class="warning-message" style="color: red;">Please insert a smaller file!</div>
      <div class="file-upload" >

        {{fileName || "No file uploaded yet."}}

          <button mat-mini-fab color="primary" class="upload-btn"
            (click)="fileUpload.click()">
              <mat-icon>attach_file</mat-icon>
          </button>

          
      </div>


      <div>
        <label>Select Category:</label>
        <div class = "radioContainer">
          <input type="radio"  id="selectExisting" name="categorySelection" (change)="toggleCategoryInput('existing')" checked >
          <label for="selectExisting">Select Existing</label>
          <input type="radio" id="enterCustom" name="categorySelection" (change)="toggleCategoryInput('custom')">
          <label for="enterCustom">Enter Custom</label>
        </div>
      </div>

      
      <mat-form-field *ngIf="selectedCategoryType === 'custom'">
        <mat-label>Enter Custom Category:</mat-label>

        <input matInput type="text" [(ngModel)]="formData.Category" name="customCategory" required >
      </mat-form-field>
      

        <mat-form-field *ngIf="selectedCategoryType === 'existing'">
          <mat-label>Category</mat-label>
          <mat-select name="Category" [(ngModel)]="formData.Category" required>
                    @for (type of categoriesArr; track type){
                      <mat-option [value] = "type">{{type}}</mat-option>
                    }
                  </mat-select>

        </mat-form-field>
      

      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title"   name="Title" required>

      </mat-form-field>

    </form>
    </div>

<div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="closeDialog()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
</div>

  `,
  styleUrl: './new-pictogram-dialog.component.css'
})
export class NewPictogramDialogComponent {

  fileName = '';
  categoriesArr = [];
  formData : any = {};
  showWarning = false;
  readonly fields = ["Pic","Category","Title"];
  readonly maxSize = 5242880;
  readonly types = ["jpg","png","gif"];
  sizeExceeded = false;
  invalidType = false;


  selectedCategoryType: 'existing' | 'custom' = 'existing'; 
 

  toggleCategoryInput(categoryType: 'existing' | 'custom') {
    this.selectedCategoryType = categoryType;
  }



  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<NewPictogramDialogComponent>,
              private pictogramService : PictogramService) {
    this.categoriesArr = data.categories
    console.log("aici")
    console.log(this.categoriesArr)
  }

  closeDialog(){
    this.dialogRef.close(this.formData);
  }

  dataValidator(formData: any): boolean{
    
    for(const field of this.fields){
      if(!(field in formData)){
        return false;
      }
    }
    return true;
    
  }

  onSubmit(){

    if(this.dataValidator(this.formData) == false )
    {
      this.showWarning = true;
      return;
    }
    else if ( this.sizeExceeded == true )
    {
      
      return;
    }
    this.pictogramService.addPictogram(this.formData);
    this.dialogRef.close(this.formData);
  }

  fileSizeValidator(file: File) {

  if (file &&  file.size > this.maxSize)
  {
    return false;
  }
  return true

  }



  onFileSelected(event : any) {

    if ( event != null)
      {
      const file:File = event.target.files[0];

      if (file) {

          this.fileName = file.name;

          

          this.formData.Pic=  file;

          console.log(this.formData)
          console.log("what")

          if ( this.fileSizeValidator(this.formData.Pic) == false )
            {
              this.sizeExceeded = true;
              console.log("okie dokie")
              return;
            }
            else
            {
              this.sizeExceeded = false;
            }

        
      }
    }
  }
    

}
