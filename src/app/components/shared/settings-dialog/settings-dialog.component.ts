import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService,Theme } from '../../../theme.service';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">Settings</div>
    <div mat-dialog-content>
      <h3>Theme</h3>
    </div>
    <div mat-dialog-actions class="buttonContainer">
      <button class="buttonDark" (click)="darkTheme()">dark theme</button>
      <button class="buttonLight" (click)="lightTheme()">light theme</button>
    </div>
  </div>
  `,
  styleUrl: './settings-dialog.component.css'
})
export class SettingsDialogComponent {

  constructor(private themeService:ThemeService){

  }

  darkTheme(): void {
    this.themeService.switchToDarkTheme();

  }
  lightTheme(): void {
    
    this.themeService.switchToLightTheme();
  }


}
