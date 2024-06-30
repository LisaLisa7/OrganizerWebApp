import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService,Theme } from '../../../theme.service';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Settings</h2>
    <div mat-dialog-content>
      <h3>Theme</h3>
      <button (click)="darkTheme()">dark theme</button>
      <button (click)="lightTheme()">light theme</button>
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
