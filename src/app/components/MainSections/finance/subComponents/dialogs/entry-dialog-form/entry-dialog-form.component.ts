import { Component, Inject } from '@angular/core';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; 
import { MatOptionModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { RegistryService } from '../../../../../../services/finance-services/registry.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PictogramDialogComponent } from '../pictogram-dialog/pictogram-dialog.component';
import { CommonModule } from '@angular/common';
import { SavingsService } from '../../../../../../services/finance-services/savings.service';
import { ErrorDialogComponent } from '../../../../personal/sub-components/dialogs/error-dialog/error-dialog.component';



@Component({
  selector: 'app-entry-dialog-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,MatOptionModule,MatSelectModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">
      {{ entryData ? 'Edit Entry' : 'Add New Entry!' }}

    </h2>
    <div mat-dialog-content>
      
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Description</mat-label>
          
          <input matInput type="text" placeholder="Description" [ngModel]="entryData ? entryData.Description : formData.Description" 
          (ngModelChange)="formData.Description = $event"  name="Description" required>

        </mat-form-field>

        <mat-form-field>
          <mat-label>Sum</mat-label>
          <input matInput type="number" placeholder="Sum" [ngModel]="entryData ? entryData.Sum : formData.Sum" 
                (ngModelChange)="formData.Sum = $event" name="Sum" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date</mat-label>
          <input matInput type="date" [ngModel]="entryData ? this.dateBuff : formData.Date"
              (ngModelChange)="dateBuff = $event"  name="Date" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>time</mat-label>
          <input matInput type="time" placeholder="Time" [ngModel]="entryData ? this.timeBuff :timeBuff" 
          (ngModelChange)="this.timeBuff = $event" name="time" required>
        </mat-form-field>


        <mat-form-field>
        <mat-label>Source</mat-label>
          <mat-select [ngModel]="entryData ? entryData.Source: formData.Source"
          (ngModelChange)="formData.Source= $event"  name="Source" required>
            @for (source of sourceOptions; track source){
              <mat-option [value] = "source.value">{{source.viewValue}}</mat-option>
            }
          </mat-select>
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
  styleUrl: './entry-dialog-form.component.css'
})


export class EntryDialogFormComponent {


  readonly fields = ["Description","Sum","Date","Source","Type"];
  selectedPic = undefined;
  savingsPlusPattern: RegExp = /^Savings\+$/;
  savingsMinusPattern: RegExp = /^Savings\-$/;

  formData: any = {}; 
  entryData: any = {};
  timeBuff : any;
  dateBuff : any;

  readonly sourceOptions = [
    { value: 'Cash', viewValue: 'Cash' },
    { value: 'Card', viewValue: 'Card' },
    
  ];

  readonly repeatOptions = [
    { value: 'No Repeat', viewValue: 'No Repeat' },
    { value: 'Daily', viewValue: 'Daily' },
    { value: 'Weekly', viewValue: 'Weekly' },
    { value: 'Monthly', viewValue: 'Monthly' }
    
  ];

  readonly typeOptions = [
    { value: 'Expenses', viewValue: 'Expenses' },
    { value: 'Income', viewValue: 'Income' },
    { value : 'Savings-', viewValue :'Savings - '},
    { value : 'Savings+', viewValue :'Savings +'},
    
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog:MatDialog,
            public dialogRef2: MatDialogRef<PictogramDialogComponent>,
            public dialogRef: MatDialogRef<EntryDialogFormComponent>,
            public registryService : RegistryService,
            public savingsService: SavingsService) 
  {
    

    this.entryData = data ? data.entry : null;
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
      const value = formData[key];
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) 
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
        this.openDialog("Please complete all fields!")
        return;
      }
      else
      {
          this.registryService.createRecord(this.formData);
      }
    }
    else
    {
      console.log("CAZ MODIFY ENTRY ! ____ ")
      console.log("formData:");
      console.log(this.formData);
      if (this.patchDataValidator(this.formData) == false){
        this.openDialog("Please complete all fields!")
        return;
      }
      else
      {
        
        this.registryService.updateRecord(this.formData);  

      }
    }
    
    this.dialogRef.close(this.formData);
    
  }

  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });
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
