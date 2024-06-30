import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import { TasksService } from '../../../../../../services/personal-services/tasks.service';

@Component({
  selector: 'app-new-board-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">New board</div>
    <div mat-dialog-content>
      <form>
      <mat-form-field>
        <mat-label>Title</mat-label>
        <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title"name="Title" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <input matInput type="text" placeholder="Description" [(ngModel)]="formData.Description"name="Description" >
      </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  `,
  styleUrl: './new-board-dialog.component.css'
})
export class NewBoardDialogComponent {

  formData: any = {};

  
  
  async onSubmit(){
    console.log(this.formData);
    

    if(this.formData.Title)
    {

      await this.taskService.insertBoard(this.formData);
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

  constructor(public dialog:MatDialog,public dialogRef:MatDialogRef<NewBoardDialogComponent>,private taskService:TasksService){}
}
