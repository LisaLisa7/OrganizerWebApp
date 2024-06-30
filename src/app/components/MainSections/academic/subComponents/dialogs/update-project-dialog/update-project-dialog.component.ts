import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ProjectsService } from '../../../../../../services/academic-services/projects.service';
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';


@Component({
  selector: 'app-update-project-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">Update project</div>
    <div mat-dialog-content>
      <form>
        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput type="text" placeholder="Title" [ngModel]="formData.title"
          (ngModelChange)="updateData.Title = $event" name="Title" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>StartDate</mat-label>
          <input matInput type="date" [ngModel]="formData.startDate"
          (ngModelChange)="updateData.startDate = $event"  name="Date" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>DueDate</mat-label>
          <input matInput type="date" [ngModel]="dateBuffFinish"  name="DueDate" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Time</mat-label>
          <input matInput type="time" placeholder="Time" [ngModel]="timeBuffFinish" name="time" required>
        </mat-form-field>

      </form>

    </div>

    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  `,
  styleUrl: './update-project-dialog.component.css'
})
export class UpdateProjectDialogComponent {


  formData : any = {};
  updateData : any = {};

  dateBuffFinish : any;
  timeBuffFinish : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,public dialogRef:MatDialogRef<UpdateProjectDialogComponent>,public projectService:ProjectsService){

    if(data)
      {
        this.formData = data;
        this.formData.startDate = this.formData.startDate.split(' ')[0];

        [this.dateBuffFinish,this.timeBuffFinish] = this.formData.finishDate.split(' ');
        
        this.timeBuffFinish = this.timeBuffFinish.slice(0, 5);

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
      this.updateData.FinishDate = this.dateBuffFinish + ' ' + this.timeBuffFinish + ':00.000Z';
    }
    if(this.patchDataValidator(this.updateData))
    {
      this.projectService.updateProject(this.formData.id,this.updateData);
      this.dialogRef.close();
    }
    else
    {
      this.openDialog('Please complete all the fields');
    }

  }
}
