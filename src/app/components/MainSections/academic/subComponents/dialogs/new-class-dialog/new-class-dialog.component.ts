import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import { ClassesService } from '../../../../../../services/academic-services/classes.service';

@Component({
  selector: 'app-new-class-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">New class</div>
    <div mat-dialog-content>
      <form>

      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput type="text" placeholder="Name" [(ngModel)]="formData.ClassName" name="Name" required>
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>StartHour</mat-label>
        <input matInput type="number" placeholder="StartHour" [(ngModel)]="startHour" 
                name="StartHour" required >
      </mat-form-field>

      <mat-form-field>
        <mat-label>FinishHour</mat-label>
        <input matInput type="number" placeholder="FinishHour" [(ngModel)]="finishHour" 
                name="FinishHour" required >
      </mat-form-field>

      <mat-form-field>
        <mat-label>Day</mat-label>
        <mat-select [(ngModel)]="formData.Day"
        name="Day" required>
          @for (day of dayOptions; track day){
            <mat-option [value] = "day">{{day}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Type</mat-label>
        <mat-select [(ngModel)]="formData.Type"
        name="Type" required>
          @for (type of typeOptions; track type){
            <mat-option [value] = "type">{{type}}</mat-option>
          }
        </mat-select>
      </mat-form-field>


      <mat-form-field>
        <mat-label>Repeat</mat-label>
        <mat-select [(ngModel)]="formData.Repeat"
        name="Repeat" required>
          @for (repeat of repeatOptions; track repeat){
            <mat-option [value] = "repeat">{{repeat}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Location</mat-label>
        <input matInput type="text" placeholder="Location" [(ngModel)]="formData.Location" name="Location" required>
      </mat-form-field>



      </form>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
    
  `,
  styleUrl: './new-class-dialog.component.css'
})
export class NewClassDialogComponent {

  formData : any = {};
  startHour = null;
  finishHour = null;

  readonly fields = ['ClassName','TimeInterval','Day','Type','Repeat','Location'];


  dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  typeOptions = [
    'Course','Laboratory','Seminar'
  ];
  repeatOptions = [
    'Odd Week','Even Week' , 'Weekly'
  ];


  dataValidator(formData: any): boolean{
    
    for(const field of this.fields){
      if(!(field in formData)){
        return false;
      }
    }
    return true;
    
  }

  onClose(){
    this.dialogRef.close();
  }

  onSubmit(){

    if(this.startHour !=null && this.finishHour !=null )
    {
      this.formData.TimeInterval = this.startHour + '-' + this.finishHour;
    }

    if(this.dataValidator(this.formData) == true)
    {
      this.classesService.createClass(this.formData);
      console.log("tot ok?")
      this.dialogRef.close();
    }
    else
    {
      this.openDialog('Please complete all the fields');
    }
      

  }


  constructor(public dialog:MatDialog,public dialogRef:MatDialogRef<NewClassDialogComponent>,private classesService:ClassesService){

  }


  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });

    
  }

}
