import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TasksService } from '../../../../../../services/personal-services/tasks.service';
import { ErrorDialogComponent } from '../../../../../shared/error-dialog/error-dialog.component';
import { InsertLabelDialogComponent } from '../insert-label-dialog/insert-label-dialog.component';
import { TaskLabel } from '../../../../../../interfaces/personal-interfaces/task-label';
@Component({
  selector: 'app-see-labels-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule],
  template: `
<div class="dialog">
  <div mat-dialog-title class="dialogTitle">Manage your labels</div>
  <div mat-dialog-content>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Color</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of items">
            <td class="td">{{item.Name}}</td>
            <td class="td" [style.backgroundColor]="item.Color">{{item.Color}}</td>
            <td class="td"><div class="separator"></div></td>
            <td class="td">
              <div class="actionButtonsContainer">
                <button (click)="deleteLabel(item)">Delete</button>
                <button (click)="openModifyLabelDialog(item)" >Modify</button>
              </div>
            </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">Close</button>
      <button class="buttonSubmit" mat-button (click)="openNewLabelDialog()" color="primary" cdkFocusInitial>New Label</button>
  </div>
</div>
  `,
  styleUrl: './see-labels-dialog.component.css'
})
export class SeeLabelsDialogComponent {

  items : any[] = [];

  constructor(private taskService:TasksService,public dialog:MatDialog,public dialogRef:MatDialogRef<SeeLabelsDialogComponent>){

    this.loadData();
  }

  async loadData(){
    this.items = await this.taskService.getAllLabels();

  }

  onClose(){

    this.dialogRef.close();

  }

  async deleteLabel(label:TaskLabel){
    await this.taskService.deleteLabel(label.Id);
    this.loadData();
  }

  openNewLabelDialog(){
    const dialogRef = this.dialog.open(InsertLabelDialogComponent, {
      width: '500px',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();

    });
  }

  openModifyLabelDialog(label:TaskLabel){
    const dialogRef = this.dialog.open(InsertLabelDialogComponent, {
      width: '500px',
      data: label 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();

    });
    
  }

  openDialog(message:string): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '500px',
      data: {"error":message} 
    });
  }
}
