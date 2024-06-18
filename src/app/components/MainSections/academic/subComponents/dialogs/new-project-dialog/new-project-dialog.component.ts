import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ProjectsService } from '../../../../../../services/academic-services/projects.service';
import { ErrorDialogComponent } from '../../../../personal/sub-components/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-new-project-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">New project</h2>
    <div mat-dialog-content>
      <form>
        <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput type="text" placeholder="Title" [(ngModel)]="formData.Title" name="Title" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>StartDate</mat-label>
          <input matInput type="date" [(ngModel)]="formData.StartDate"  name="Date" required>
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
  `,
  styleUrl: './new-project-dialog.component.css'
})
export class NewProjectDialogComponent {

  formData : any = {};

  dateBuffFinish : any;
  timeBuffFinish : any;

  readonly fields = ['Title','Class_Id','StartDate','FinishDate'];


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,public dialogRef:MatDialogRef<NewProjectDialogComponent>,public projectService:ProjectsService){

    if(data)
      {
        this.formData.Class_Id = data.class_id;
      }
  }

  dataValidator(formData: any): boolean{
    
    for(const field of this.fields){
      if(!(field in formData)){
        return false;
      }
    }
    return true;
    
  }

  onClose(){

    console.log(this.formData);
  }

  onSubmit(){

    if(this.dateBuffFinish && this.timeBuffFinish)
    {
      const combinedDateTime = this.dateBuffFinish + ' ' + this.timeBuffFinish + ':00.000Z';
      
      this.formData.FinishDate = combinedDateTime;
    }

    if(this.dataValidator(this.formData) == true)
    {
      this.projectService.createProject(this.formData);
      console.log("tot ok");
      this.dialogRef.close();
    }
    else
      this.openDialog('Please complete all the fields');


  }

  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });

    
  }
}
