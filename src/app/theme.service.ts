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
      '--expense-color' : '#f8afaf'
    }
  });

  currentTheme$ = this.currentThemeSubject.asObservable();

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
