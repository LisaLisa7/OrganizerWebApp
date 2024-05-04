import { Component, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule for input fields
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { RecurringService } from '../../../../../../services/recurring.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PictogramDialogComponent } from '../pictogram-dialog/pictogram-dialog.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-recurring-entry-dialog',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,MatOptionModule,MatSelectModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">
      {{ entryData ? 'Edit Entry' : 'Add New Entry!' }}
      <div *ngIf="showWarning" class="warning-message" style="color: red;">Please complete all fields!</div>

    </h2>
    <div mat-dialog-content>
      
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Description</mat-label>
          
          <input matInput type="text" placeholder="Description" [(ngModel)]="entryData ? entryData.Description : formData.Description" 
          (ngModelChange)="formData.Description = $event"  name="Description" required>

        </mat-form-field>

        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-select [(ngModel)]="entryData ? entryData.Type : formData.Type" 
          (ngModelChange)="formData.Type= $event" name="Type" required>
            @for (type of typeOptions; track type){
              <mat-option [value] = "type.value">{{type.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>


        <mat-form-field>
          <mat-label>Sum</mat-label>
          <input matInput type="number" placeholder="Sum" [ngModel]="entryData ? entryData.Sum : formData.Sum" 
                (ngModelChange)="formData.Sum = $event" name="Sum" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date</mat-label>
          <input matInput type="date" [(ngModel)]="entryData ? this.dateBuff : formData.Date"
              (ngModelChange)="dateBuff = $event"  name="Date" required>
        </mat-form-field>

        <mat-form-field>
        <input matInput type="time" placeholder="Time" [(ngModel)]="entryData ? this.timeBuff :timeBuff" 
        (ngModelChange)="this.timeBuff = $event" name="time" required>
        </mat-form-field>


        <mat-form-field>
          <mat-label>Every</mat-label>
          <input matInput type="number" placeholder="Every" [ngModel]="entryData ? entryData.Every : formData.Every" 
                (ngModelChange)="formData.Every = $event" name="Every" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Repeat</mat-label>
          <mat-select [(ngModel)]="entryData ? entryData.Repeat : formData.Repeat" 
          (ngModelChange)="formData.Repeat= $event" name="Repeat" required>
            @for (repeat of repeatOptions; track repeat){
              <mat-option [value] = "repeat.value">{{repeat.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

          <!-- Day input field for weekly -->
        <mat-form-field *ngIf="formData.Repeat === 'Weeks'">
          <mat-label for="weekday">Day of the Week</mat-label>
          <mat-select id="weekday" name="weekday" [(ngModel)]="formData.Weekday" required>
            <mat-option value="Monday">Monday</mat-option>
            <mat-option value="Tuesday">Tuesday</mat-option>
            <!-- Add other options for weekdays -->
          </mat-select>
        </mat-form-field>

        <!-- Day input field for monthly -->
        <mat-form-field *ngIf="formData.Repeat === 'Months'">
          <mat-label for="monthday">Day of the Month</mat-label>
          <input matInput type="number" id="monthday" name="monthday" [(ngModel)]="formData.MonthDay" required>
        </mat-form-field>



        
        <mat-label [class.selected-label]="formData.Pictogram">
          {{ (selectedPic )? 'Pictogram selected!' : 'Select a pictogram!' }}
        </mat-label>
        <div *ngIf="selectedPic || (entryData ?  entryData.Pictogram : null)">
        <img [src]="selectedPic ? selectedPic : entryData.Pictogram" alt="Selected Pictogram" class="selectedImg">
        </div>
        
      </form>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button type="button" class="buttonPictogram" (click)="openDialogPictogram()">Select</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  `,
  styleUrl: './recurring-entry-dialog.component.css'
})
export class RecurringEntryDialogComponent {

  readonly fields = ["Description","Sum","Date","Type","Every","Repeat"];
  showWarning = false;
  selectedPic = undefined;

  formData: any = {}; // Object to store form data
  entryData: any = {};
  timeBuff : any;
  dateBuff : any;

  readonly repeatOptions = [
    { value: 'Days', viewValue: 'Days' },
    { value: 'Weeks', viewValue: 'Weeks' },
    { value: 'Months', viewValue: 'Months' }
    // Add more options as needed
  ];

  readonly typeOptions = [
    { value: 'Expenses', viewValue: 'Expenses' },
    { value: 'Income', viewValue: 'Income' },
    // Add more options as needed
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,
            public dialogRef2: MatDialogRef<PictogramDialogComponent>,
            public dialogRef: MatDialogRef<RecurringEntryDialogComponent>,
            public recurringService : RecurringService) 
  {
    

    this.entryData = data ? data.entry : null;
    console.log(data);
    if(this.entryData != null)
    {
      [this.dateBuff,this.timeBuff] = this.entryData.Date.split(' ');
      console.log(this.dateBuff);
      this.timeBuff = this.timeBuff.slice(0, 5);
      console.log(this.timeBuff);
      console.log(this.entryData);
      this.formData.id = this.entryData.Id;
    }
    //console.log(this.entryData);

  }

  onClose(): void {
    
    this.dialogRef.close();

  }

  dataValidator(formData: any): boolean{
    
    for(const field of this.fields){
      if(!(field in formData)){
        return false;
      }
    }
    return true;
    
  }

  patchDataValidator(formData:any): boolean{
    for(const key in formData){
      if(formData[key] == null)
        return false;
    }
    return true;
  }

  
  onSubmit(): void {
    console.log("!!!!!!!!!!!!!!!!!!!!!11")
    console.log(this.formData);
    
    if(this.dateBuff && this.timeBuff)
    {
      const combinedDateTime = this.dateBuff + ' ' + this.timeBuff + ':00.000Z';
      this.formData.Date = combinedDateTime;
    }
  
    
    if (this.entryData == null)
    {
      console.log("caz doar new entry");
      if(this.dataValidator(this.formData) == false )
      {
        this.showWarning = true;
        return;
      }
      else
        this.recurringService.createRecord(this.formData);
        
    }
    else
    {
      console.log("CAZ MODIFY ENTRY ! ____ ")
      console.log("formData:");
      console.log(this.formData);
      if (this.patchDataValidator(this.formData) == false){
        this.showWarning = true;
        return;
      }
      //else
        //this.recurringService.updateRecord(this.formData);  
    }
    
    this.dialogRef.close(this.formData);
    
  }

  openDialogPictogram():void{
    const dialogConfig: MatDialogConfig ={
      disableClose: true,
    }
    
    const dialogRef2 = this.dialog.open(PictogramDialogComponent,{
      width: '500px', // Adjust the width as needed
      data: {} // Optionally pass data to the dialog
    });

    dialogRef2.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('Dialog closed with result:', result);
      if (result!=undefined)
      { this.formData.Pictogram_Id = result.picId;
        this.selectedPic = result.picUrl;
        console.log("form data actual: ")
        console.log(this.formData);
      }
      else
      {
        console.log("no pic selected!");
      }
      //this.registryService.updateEntries();

    });

  }


}
