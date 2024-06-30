import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import { TasksService } from '../../../../../../services/personal-services/tasks.service';

@Component({
  selector: 'app-new-board-column-task-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">New task</div>
    <div mat-dialog-content>
      <form>
        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title"name="Title" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Description</mat-label>
          <input matInput type="text" placeholder="Description" [(ngModel)]="formData.Description" name="Description" >
        </mat-form-field>

        <mat-form-field>
          <mat-label>DueDate</mat-label>
          <input matInput type="date" placeholder="DueDate" [(ngModel)]="this.dateBuff" name="DueDate" required>
        </mat-form-field>

        <mat-form-field>
        <input matInput type="time" placeholder="Time" [(ngModel)]="this.timeBuff"  
         name="time" required>
        </mat-form-field>

      </form>

    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  `,
  styleUrl: './new-board-column-task-dialog.component.css'
})
export class NewBoardColumnTaskDialogComponent {

  formData: any = {};
  timeBuff : any;
  dateBuff : any;
  boardId : string = "";
  columnId : string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private taskService:TasksService,public dialog:MatDialog, public dialogRef:MatDialogRef<NewBoardColumnTaskDialogComponent>){

    this.boardId = data? data.id_board : "";
    this.columnId = data ? data.id_col : "";
    this.formData.Board_ID = this.boardId;
    this.formData.Column_ID = this.columnId;
  }

  async onSubmit(){


    console.log(this.dateBuff);
    console.log(this.timeBuff);
    if(this.dateBuff && this.timeBuff)
      {
        const combinedDateTime = this.dateBuff + ' ' + this.timeBuff + ':00.000Z';
        this.formData.DueDate = combinedDateTime;
      }

    if(this.formData.Title && this.formData.DueDate)
    {
      this.formData.Done = false;
      await this.taskService.insertBoardColumnTask(this.formData);
      this.dialogRef.close();
      
    }
    else{
      this.openDialog("Please complete the necessary fields")
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
