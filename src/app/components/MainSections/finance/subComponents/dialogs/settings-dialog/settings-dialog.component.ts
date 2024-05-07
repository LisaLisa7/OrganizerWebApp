import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Settings</h2>
    <div mat-dialog-content>

      <h3>Currency</h3>
      <h3>Theme</h3>
      <h3>Reset</h3>
    </div>
  `,
  styleUrl: './settings-dialog.component.css'
})
export class SettingsDialogComponent {

  constructor(){

  }

}
