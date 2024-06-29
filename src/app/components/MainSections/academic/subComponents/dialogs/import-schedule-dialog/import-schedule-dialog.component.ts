import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SheduleService } from '../../../../../../services/academic-services/shedule.service';
import { ClassesService } from '../../../../../../services/academic-services/classes.service';
import { ErrorDialogComponent } from '../../../../personal/sub-components/dialogs/error-dialog/error-dialog.component';


@Component({
  selector: 'app-import-schedule-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,CommonModule,MatInputModule,FormsModule,MatIconModule,
    MatTooltipModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Import Schedule</h2>
    <div mat-dialog-content>
      <form>

        <mat-form-field>
            <mat-label>GoogleSheet Id</mat-label>
            <button mat-icon-button matTooltip="/d/THE_ID/" matSuffix class="no-border">
            <mat-icon>help_outline</mat-icon>
            </button>
            <input matInput type="text" placeholder="GoogleSheet Id" [(ngModel)]="sheetID" name="GoogleSheet Id" required>
        </mat-form-field>

        <mat-form-field>
            <mat-label>Grupa</mat-label>
            <button mat-icon-button matTooltip="group number+subgroup letter" matSuffix class="no-border">
            <mat-icon>help_outline</mat-icon>
            </button>
            <input matInput type="text" placeholder="Name" [(ngModel)]="group" name="Name" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>An</mat-label>
          <mat-select [(ngModel)]="year"
          name="Type" required>
            @for (an of anOptions; track an){
              <mat-option [value] = "an.value">{{an.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>



    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
  `,
  styleUrl: './import-schedule-dialog.component.css'
})
export class ImportScheduleDialogComponent {

  group = "";
  sheetID = "";
  year = "";

  data : any = {};

  constructor(private scheduleService:SheduleService,public dialog:MatDialog,private classService:ClassesService,public dialogRef:MatDialogRef<ImportScheduleDialogComponent>){

  }

  readonly anOptions = [
    { value: 'L-I-CTI', viewValue: '1' },
    { value: 'L-II-CTI', viewValue: '2' },
    { value: 'L-III-CTI', viewValue: '3' },
    { value: 'L-IV-CTI', viewValue: '4' },

  ];
  

  onClose(){

    this.dialogRef.close();
    
  }

  onSubmit(){
    if(this.validateInput(this.group))
    {
      console.log(this.group + " " +this.year + " " + this.sheetID);

      this.scheduleService.getData(this.sheetID,this.group,this.year).subscribe(
        data => {
          console.log('Response:', data);
          this.data = data;
          
          this.processData();
          this.dialogRef.close();
          
        },
        error => {
          console.error('Error:', error.error);
          this.openDialog(error.error.error);
        }
      );
    }
    else
      console.log("Format wrongg");
    

  }

  validateInput(input: string): boolean {
    const pattern = /^\d{4}[A-Z]$/;
    return pattern.test(input);
  }

  async processData(){
    for(const c of this.data)
      {
        console.log(c);
        try {
          await this.classService.createClass(c);
        } catch (error) {
          this.openDialog(`Duplicate classes ${c.ClassName}!\nPlease clear the schedule first`);
          break;
        }
        
      }
  }

  openDialog(message:string): void {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px', 
      data: {"error":message} 
    });

    
  }

}
