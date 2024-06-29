import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService,Theme } from '../../../../../../theme.service';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Settings</h2>
    <div mat-dialog-content>
      <h3>Currency</h3>
      <h3>Theme</h3>
      <button (click)="switchToDarkTheme()">dark theme</button>
      <button (click)="switchToLightTheme()">light theme</button>
    </div>
  `,
  styleUrl: './settings-dialog.component.css'
})
export class SettingsDialogComponent {

  constructor(private themeService:ThemeService){

  }

  

  switchToDarkTheme(): void {
    const darkTheme: Theme = {
      name: 'dark',
      properties: {
        '--primary-color': '#0F0F0F',
        '--secondary-color': '#232D3F',
        '--color3':'#005B41',
        '--color4':'#008170',
        '--accent-color': '#232D3F',
        '--shadow-color': '#9381FF',
        '--text-color' : '#ffffff',
        '--button-color' : '#008170',
        '--income-color' : '#005B41',
        '--expense-color' : '#DC5F00'
      }
    };
    this.themeService.setTheme(darkTheme);
  }
  switchToLightTheme(): void {
    const darkTheme: Theme = {
      name: 'dark',
      properties: {
        '--primary-color': '#634bec',
        '--secondary-color': '#B8B8FF',
        '--color3':'#FFEEDD',
        '--color4':'#FFD8BE',
        '--accent-color': '#ffffff',
        '--shadow-color': '#E8E8E8',
        '--text-color' : '#060000',
        '--button-color' : '#E8E8E8',
        '--income-color' : '#cef3c5',
        '--expense-color' : '#f8afaf'
      }
    };
    this.themeService.setTheme(darkTheme);
  }

  

}
