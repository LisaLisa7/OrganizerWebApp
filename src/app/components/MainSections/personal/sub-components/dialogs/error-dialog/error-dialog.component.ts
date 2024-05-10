import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [],
  template: `
    <h1>{{data.error}}</h1>
  `,
  styleUrl: './error-dialog.component.css'
})
export class ErrorDialogComponent {

  errorMessage : string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data:any){
    this.errorMessage = data.error;

  }
}
