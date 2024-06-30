import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface Theme {
  name: string;
  properties: any; 
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentThemeSubject = new BehaviorSubject<Theme>({
    name: 'default',
    properties: {
      '--primary-color': '#9381FF',
      '--secondary-color': '#9381FF',
      '--color3':'#9381FF',
      '--color4':'#9381FF',
      '--accent-color': '#9381FF',
      '--shadow-color': '#9381FF',
      '--text-color' : '#ffffff',
      '--income-color' : '#cef3c5',
      '--expense-color' : '#f8afaf',
      '--section-color' : '#9381FF'
    }
  });

  currentTheme$ = this.currentThemeSubject.asObservable();


  switchToDarkTheme(): void {
    const darkTheme: Theme = {
      name: 'dark',
      properties: {
        '--primary-color': '#0F0F0F',
        '--secondary-color': '#232D3F',
        '--color3':'#005B41',
        '--color4':'#008170',
        '--accent-color': '#232D3F',
        '--shadow-color': '#008170',
        '--text-color' : '#ffffff',
        '--button-color' : '#008170',
        '--income-color' : '#005B41',
        '--expense-color' : '#DC5F00',
        '--section-color' : '#005B41'
      }
    };
    this.setTheme(darkTheme);
    localStorage.setItem('selectedTheme', JSON.stringify(darkTheme));

  }

  switchToLightTheme(): void {
    const lightTheme: Theme = {
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
        '--expense-color' : '#f8afaf',
        '--section-color' : '#5440c7'
      }
    };
    this.setTheme(lightTheme);
    localStorage.setItem('selectedTheme', JSON.stringify(lightTheme));

  }


  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    Object.keys(theme.properties).forEach(property => {
      root.style.setProperty(property, theme.properties[property]);
    });
  }
}
