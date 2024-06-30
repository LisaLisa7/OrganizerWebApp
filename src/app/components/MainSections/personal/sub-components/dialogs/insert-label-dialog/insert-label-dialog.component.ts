import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import { TasksService } from '../../../../../../services/personal-services/tasks.service';
import { NgxColorsModule } from 'ngx-colors';


@Component({
  selector: 'app-insert-label-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule,NgxColorsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">New Labels</div>
    <div mat-dialog-content>
      <form>

        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput type="text" placeholder="Name" 
          [ngModel]="passedData ? passedData.Name : formData.Name"name="Name"
          (ngModelChange)="formData.Name = $event" required>
        </mat-form-field>
       
        
      </form>
      <ngx-colors
        ngx-colors-trigger
        name="color"
        [ngModel]="passedData ? passedData.Color : formData.Color"
        (ngModelChange)="formData.Color = $event"
        acceptLabel="Select"
        cancelLabel="Cancel" >
        </ngx-colors>
      
      
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  `,
  styleUrl: './insert-label-dialog.component.css'
})
export class InsertLabelDialogComponent {

  formData :any = {
    Color: '#000000'
  };

  passedData : any = {};

  color : string = '#EC407A';


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,public dialogRef:MatDialogRef<InsertLabelDialogComponent>,private taskService:TasksService){

    this.passedData = data ? data : null;
    console.log("Passed data in constr:");
    console.log(this.passedData);
  }

  patchDataValidator(formData:any): boolean{
    for(const key in formData){
      const value = formData[key];
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) 
        return false;
    }
    return true;
  }

  async onSubmit(){

    if(this.passedData == null || Object.keys(this.passedData).length === 0)
    {
      console.log("CAZ NEW LABEL");
      if(this.formData.Name)
      {
        await this.taskService.insertLabel(this.formData);
        this.dialogRef.close();
        
      }
      else
      {
        this.openDialog("Please complete the necessary fields");
      }
    }
    else{
      console.log("CAZ MODIFY LABEL");
      console.log(this.passedData);
      this.formData.id = this.passedData.Id;
      console.log(this.formData);
      if(this.patchDataValidator(this.formData) == true)
      {
        await this.taskService.updateLabel(this.formData);
        this.dialogRef.close();
      }
      else
      {
        this.openDialog("Please complete the necessary fields");

      }
    }

  }

  onClose(){

    console.log(this.formData);
    this.dialogRef.close();
  }

  openDialog(message:string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px',
      data: {"error":message} 
    });
  }

}
