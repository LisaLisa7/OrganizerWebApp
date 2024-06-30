import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">{{message}}</div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonCancel" mat-button (click)="onClose()">No</button>
      <button class="buttonSubmit" mat-button (click)="onSubmit()" color="primary" cdkFocusInitial>Yes</button>
    </div>
  </div>
  `,
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  message : string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<ConfirmDialogComponent>){

    this.message = data.message;
  }

  onClose(){

    this.dialogRef.close(false);
  }

  onSubmit(){

    this.dialogRef.close(true);
  }
}
