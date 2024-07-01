import { Component,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ClassTasksService } from '../../../../../../services/academic-services/class-tasks.service';
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-update-task-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatDialogModule,MatSelectModule,MatInputModule,FormsModule,MatCheckboxModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">{{this.formData.title}}</div>
    <div mat-dialog-content>
      <form>

        <mat-checkbox class="example-margin" [ngModel]="this.formData.done"
        (ngModelChange)="updateData.Done = $event" name="done" >Done?</mat-checkbox>


        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput type="text" placeholder="Title" [ngModel]="formData.title"
          (ngModelChange)="updateData.Title = $event" name="Title" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Description</mat-label>
          <input matInput type="text" placeholder="Description" [ngModel]="formData.description"
          (ngModelChange)="updateData.Description = $event" name="Description">
        </mat-form-field>

        <mat-form-field>
          <mat-label>StartDate</mat-label>
          <input matInput type="date" [(ngModel)]="formData.startDate"
          (ngModelChange)="updateData.StartDate = $event"  name="Date" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>DueDate</mat-label>
          <input matInput type="date" [(ngModel)]="dateBuffFinish"  name="DueDate" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Time</mat-label>
          <input matInput type="time" placeholder="Time" [(ngModel)]="timeBuffFinish" name="time" required>
        </mat-form-field>

      </form>



    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  
  `,
  styleUrl: './update-task-dialog.component.css'
})
export class UpdateTaskDialogComponent {

  formData : any = {};
  updateData: any = {};

  dateBuffFinish :any;
  timeBuffFinish : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,public dialogRef:MatDialogRef<UpdateTaskDialogComponent>,private taskService:ClassTasksService){

    if(data){
      this.formData = data;

      let buff = this.formData.startDate.split(' ')[0];
      this.formData.startDate = buff;
      [this.dateBuffFinish,this.timeBuffFinish] = this.formData.finishDate.split(' ');
      this.timeBuffFinish = this.timeBuffFinish.slice(0, 5);
      //console.log(this.dateBuffFinish + " " + this.timeBuffFinish)
    }
  }

  patchDataValidator(formData:any): boolean{
    for(const key in formData){

      const value = formData[key];
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) 
        return false;
        
    }
    return true;
  }

  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });

    
  }

  onClose(){
    console.log(this.updateData);
    this.dialogRef.close();

  }

  onSubmit(){

    if(this.dateBuffFinish && this.timeBuffFinish)
      {
        const combinedDateTime = this.dateBuffFinish + ' ' + this.timeBuffFinish + ':00.000Z';
        const localDate = new Date(combinedDateTime);

        this.updateData.FinishDate = localDate;
        //console.log(this.updateData);
      }
    if(this.patchDataValidator(this.updateData))
      {
        this.taskService.updateTask(this.formData.id,this.updateData);
        console.log("?")
        this.dialogRef.close();
      }
      else
      {
        this.openDialog('Please complete all the fields');
      }
    
  }

}
