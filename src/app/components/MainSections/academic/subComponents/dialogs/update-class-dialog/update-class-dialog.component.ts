import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import { ClassesService } from '../../../../../../services/academic-services/classes.service';

@Component({
  selector: 'app-update-class-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">Update class</div>
    <div mat-dialog-content>
      <form>

      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput type="text" placeholder="Name" [ngModel]="formData.ClassName"
        (ngModelChange)="updateData.ClassName = $event" name="Name" required>
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
        <mat-select [ngModel]="formData.Day"
        name="Day" required (ngModelChange)="updateData.Day = $event">
          @for (day of dayOptions; track day){
            <mat-option [value] = "day">{{day}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Type</mat-label>
        <mat-select [ngModel]="formData.Type"
        name="Type" required (ngModelChange)="updateData.Type = $event">
          @for (type of typeOptions; track type){
            <mat-option [value] = "type">{{type}}</mat-option>
          }
        </mat-select>
      </mat-form-field>


      <mat-form-field>
        <mat-label>Repeat</mat-label>
        <mat-select [ngModel]="formData.Repeat"
        name="Repeat" required (ngModelChange)="updateData.Repeat = $event">
          @for (repeat of repeatOptions; track repeat){
            <mat-option [value] = "repeat">{{repeat}}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Location</mat-label>
        <input matInput type="text" placeholder="Location" 
        [ngModel]="formData.Location" (ngModelChange)="updateData.Location = $event" name="Location" required>
      </mat-form-field>



      </form>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  `,
  styleUrl: './update-class-dialog.component.css'
})
export class UpdateClassDialogComponent {

  formData : any = {};
  updateData : any = {};

  startHour = 0;
  finishHour = 0;

  readonly fields = ['ClassName','TimeInterval','Day','Type','Repeat','Location'];


  dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  typeOptions = [
    'Course','Laboratory','Seminar'
  ];
  repeatOptions = [
    'Odd Week','Even Week' , 'Weekly'
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,public dialogRef:MatDialogRef<UpdateClassDialogComponent>,private classesService:ClassesService){

    if(data){
      console.log(data);
      this.formData = data;
      let parts = this.formData.TimeInterval.split('-');
      this.startHour = parseInt(parts[0]);
      this.finishHour = parseInt(parts[1]);
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



  }

  onSubmit(){

    if(this.startHour !=null && this.finishHour !=null )
    {
      this.updateData.TimeInterval = this.startHour + '-' + this.finishHour;
    }

    if(this.patchDataValidator(this.updateData))
    {
      console.log(this.formData.id)
      console.log(this.updateData);
      this.classesService.updateClass(this.formData.id,this.updateData);
      
      console.log("tot ok?")
      this.dialogRef.close();
    }
    else
    {
      this.openDialog('Please complete all the fields');
    }
      
    

  }


  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });

    
  }

  patchDataValidator(formData:any): boolean{
    for(const key in formData){

      const value = formData[key];
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) 
        return false;
        
    }
    return true;
  }

}
