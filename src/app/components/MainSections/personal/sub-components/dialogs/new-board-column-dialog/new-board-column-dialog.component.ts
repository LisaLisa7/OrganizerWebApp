import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { TasksService } from '../../../../../../services/personal-services/tasks.service';

@Component({
  selector: 'app-new-board-column-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">New column</h2>
    <div mat-dialog-content>
      <form>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput type="text" placeholder="Name" [(ngModel)]="formData.Name"name="Name" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Position</mat-label>
        <input matInput type="number" placeholder="Position" [(ngModel)]="formData.Position" name="Position" >
      </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  `,
  styleUrl: './new-board-column-dialog.component.css'
})
export class NewBoardColumnDialogComponent {

  formData: any = {};
  boardId : String;

  
  
  async onSubmit(){
    console.log(this.formData);
    

    if(this.formData.Name)
    {

      await this.taskService.insertBoardColumn(this.formData);
      this.dialogRef.close();
      
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

  openDialog(message:string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px',
      data: {"error":message} 
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,public dialogRef:MatDialogRef<NewBoardColumnDialogComponent>,private taskService:TasksService){

    this.boardId = data ? data.id : "";
    console.log(this.boardId);
    this.formData.Board_ID = this.boardId;

  }
}
