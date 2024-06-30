import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TasksService } from '../../../../../../services/personal-services/tasks.service';
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BoardColumn } from '../../../../../../interfaces/personal-interfaces/board-column';
import { CommonModule } from '@angular/common';
import { TaskLabel } from '../../../../../../interfaces/personal-interfaces/task-label';
@Component({
  selector: 'app-see-board-column-task-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatDialogModule,MatSelectModule,MatInputModule,FormsModule,MatCheckboxModule],
  template: `
<div class="dialog">
    <div mat-dialog-title class="dialogTitle">{{this.passedData.Title}}</div>
    <div mat-dialog-content>
      <form>
      <mat-form-field>
          <mat-label>Title</mat-label>
          <input matInput type="text" placeholder="Title"
           [ngModel]="this.passedData.Title"name="Title" (ngModelChange)="formData.Title = $event" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Description</mat-label>
          <input matInput type="text" placeholder="Description" 
          [ngModel]="this.passedData.Description" name="Description" (ngModelChange)="formData.Description = $event" >
        </mat-form-field>



        <mat-form-field>
          <mat-label>DueDate</mat-label>
          <input matInput type="date" placeholder="DueDate" [(ngModel)]="this.dateBuff" name="DueDate" required>
        </mat-form-field>

        <mat-form-field>
        <input matInput type="time" placeholder="Time" [(ngModel)]="this.timeBuff"  
         name="time" required>
        </mat-form-field>


        <mat-checkbox color="accent" class="example-margin" [(ngModel)]="this.formData.Done" name="done" >Done?</mat-checkbox>


        <p>Move to?</p>
        <mat-form-field>
          <mat-label>Column</mat-label>
          <mat-select [(ngModel)]="formData.Column_ID"
          name="Column" required>
            @for (stat of statusOptions; track stat){
              <mat-option [value] = "stat.value">{{stat.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <p>Labels</p>
        <ul>
        <li *ngFor="let label of this.passedData.Labels">
          {{ label.Name }}
          <span [style.backgroundColor]="label.Color">_</span>
          <button class="buttonRemoveLabel" (click)="removeLabelFromTask(label)"><span><img [src] = "deleteSVG"></span></button>
        </li>
        </ul>
        <p>Add a new label?</p>

        <mat-form-field>
          <mat-label>Label</mat-label>
          <mat-select [(ngModel)]="this.selectedLabel"
          name="Label" required>
            @for (label of labelOptions; track label){
              <mat-option [value] = "label.value">{{label.viewValue}}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        
      </form>


    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Cancel</button>
      <button class="buttonCancel" mat-button (click)="onDelete()">Delete</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Submit</button>
    </div>
</div>
  
  `,
  styleUrl: './see-board-column-task-dialog.component.css'
})
export class SeeBoardColumnTaskDialogComponent {

  formData : any = {};
  passedData : any = {};
  timeBuff : any;
  dateBuff : any;
  columns : BoardColumn[] = [];
  selectedLabel : string = "";
  newLabels : any = [];
  allLabels: TaskLabel[] = [];
  deleteSVG = "/assets/delete.svg";

  statusOptions = [
    { value: 'Plan to Watch', viewValue: 'Plan to Watch' },
    { value: 'Watched', viewValue: 'Watched' },
    { value: 'Dropped', viewValue: 'Dropped' }
  ];

  labelOptions : any = [];

  fields = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private taskService:TasksService,public dialog:MatDialog, public dialogRef:MatDialogRef<SeeBoardColumnTaskDialogComponent>){

    console.log(data);
    this.passedData = data;
    this.formData.Done = this.passedData.Done;
    [this.dateBuff,this.timeBuff] = this.passedData.Due.split(' ');
    this.timeBuff = this.timeBuff.slice(0, 5);
    this.formData.Id = this.passedData.Id;
    
    
    
  }

  async ngOnInit(){
    await this.loadSelectValues();

  }

  async loadSelectValues(){
    console.log(this.passedData.Board_Id)
    this.columns = await this.taskService.getAllColumnsById(this.passedData.Board_Id);
    this.statusOptions = this.columns.map( (column:BoardColumn) => ({
      value: column.Id,
      viewValue: column.Name
    }));

    this.allLabels = await this.taskService.getAllLabels();
    this.labelOptions = this.allLabels.map( (label:TaskLabel) => ({
        value : label.Id,
        viewValue : label.Name
    }) );

    

    console.log(this.labelOptions);


    
  }



  async removeLabelFromTask(label : any)
  {
    console.log(label);
    this.passedData.Labels = this.passedData.Labels.filter( (l:any) => l.Id !== label.Id);
    console.log(this.passedData.Labels);
  }

  addLabel(labelId: string) {
    if (!this.newLabels.includes(labelId)) {
      this.newLabels.push(labelId);
    }
    this.formData.Labels = this.newLabels;
  }
  
  updateLabels(){
    this.newLabels = this.passedData.Labels.map( (label : TaskLabel )=> label.Id);
    console.log("finally?");
    console.log(this.newLabels);
  }

  async onDelete(){

    const dialogRef = this.taskService.openConfirmDialog("Are you sure you want to delete this task?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
      this.taskService.deleteTask(this.formData.Id);
      this.dialogRef.close();
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

  patchDataValidator(formData:any): boolean{
    for(const key in formData){
      if(key != "Description")
      {
        const value = formData[key];
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) 
          return false;
        
      }
    }
    return true;
  }

  onSubmit(){

    if(this.dateBuff && this.timeBuff)
    {
      const combinedDateTime = this.dateBuff + ' ' + this.timeBuff + ':00.000Z';
      this.formData.DueDate = combinedDateTime;
    }
    console.log(this.formData.DueDate)

    if(this.formData.DueDate && this.patchDataValidator(this.formData) == true){

      this.updateLabels();
      this.addLabel(this.selectedLabel);
      
      console.log(this.newLabels);
      this.taskService.updateTask(this.formData);
      this.dialogRef.close();

    }
    else
    {
      console.log(this.formData);
      this.openDialog("Please complete all fields!");
    }


  }

}
