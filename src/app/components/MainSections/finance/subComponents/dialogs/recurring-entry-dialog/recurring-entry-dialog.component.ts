import { Component, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { RecurringService } from '../../../../../../services/finance-services/recurring.service';
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
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">
      {{ entryData ? 'Edit Entry' : 'Add New Entry!' }}
      <div *ngIf="showWarning" class="warning-message" style="color: red;">Please complete all fields!</div>

  </div>
    <div mat-dialog-content>
      
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Description</mat-label>
          
          <input matInput type="text" placeholder="Description" [ngModel]="entryData ? entryData.Description : formData.Description" 
          (ngModelChange)="formData.Description = $event"  name="Description" required>

        </mat-form-field>

        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-select [ngModel]="entryData ? entryData.Type : formData.Type" 
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
          <mat-label>Repeat</mat-label>
          <mat-select [ngModel]="entryData ? entryData.Repeat : formData.Repeat" 
          (ngModelChange)="formData.Repeat= $event" name="Repeat" required>
            @for (repeat of repeatOptions; track repeat){
              <mat-option [value] = "repeat.value">{{repeat.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        
        <mat-form-field *ngIf="entryData ? entryData.Repeat === 'Monthly' : formData.Repeat === 'Monthly'">
          <mat-label for="monthday">Day of the Month</mat-label>
          <input matInput type="number" [max]=28 id="monthday" name="monthday" [ngModel]="entryData ? entryData.MonthDay :formData.MonthDay"
              (ngModelChange)="formData.MonthDay= $event"   required>
        </mat-form-field>
        
        <div class="st">
          {{ (selectedPic )? 'Pictogram selected!' : 'Select a pictogram!' }}
          </div>
        <div *ngIf="selectedPic || (entryData ?  entryData.Pictogram_Id : null)">
        <img [src]="selectedPic ? selectedPic : entryData.Pictogram_Id" alt="Selected Pictogram" class="selectedImg">
        </div>
        
      </form>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button type="button" class="buttonPictogram" (click)="openDialogPictogram()">Select</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  </div>
  `,
  styleUrl: './recurring-entry-dialog.component.css'
})
export class RecurringEntryDialogComponent {

  readonly fields = ["Description","Sum","Type","Repeat"];
  showWarning = false;
  selectedPic = undefined;

  formData: any = {}; 
  entryData: any = {};


  readonly repeatOptions = [
    { value: 'Daily', viewValue: 'Daily' },
    { value: 'Monthly', viewValue: 'Monthly' }
  ];

  readonly typeOptions = [
    { value: 'Expenses', viewValue: 'Expenses' },
    { value: 'Income', viewValue: 'Income' },
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
    
    
    if (this.entryData == null)
    {
      console.log("caz doar new entry");
      if(this.dataValidator(this.formData) == false || this.formData.MonthDay>28 )
      {
        this.showWarning = true;
        return;
      }
      else
      {
        console.log(this.formData);
        this.recurringService.createRecord(this.formData);
      }
        
    }
    else
    {
      console.log("CAZ MODIFY ENTRY ! ____ ")
      console.log("formData:");
      console.log(this.formData);
      if (this.patchDataValidator(this.formData) == false || this.formData.MonthDay>28 ){
        this.showWarning = true;
        return;
      }
      else
        this.recurringService.updateRecord(this.formData);  
    }
    
    this.dialogRef.close(this.formData);
    
  }

  openDialogPictogram():void{
    const dialogConfig: MatDialogConfig ={
      disableClose: true,
    }
    
    const dialogRef2 = this.dialog.open(PictogramDialogComponent,{
      width: '500px',
      data: {} 
    });

    dialogRef2.afterClosed().subscribe(result => {
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
