import { Component, ViewChild, ViewContainerRef,ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RegistryComponent } from './subComponents/registry/registry.component';
import { PictogramsComponent } from './subComponents/pictograms/pictograms.component';
import { SavingsComponent } from './subComponents/savings/savings.component';
import { StatsComponent } from './subComponents/stats/stats.component';
import { HelpPageComponent } from './subComponents/help-page/help-page.component';
import { ExportDialogComponent } from './subComponents/dialogs/export-dialog/export-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../../shared/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule,MatSidenavModule,FormsModule,MatIconModule,ExportDialogComponent],
  template: `
    <mat-sidenav-container>
      <mat-sidenav [(opened)]="opened">
        <div class="button-container">
          <div>
          <button (click)="createRegistryComponent()" ><img [src]="homeSVG" alt="home"><span>Home</span></button>
          <button (click)="createSavingsComponent()"><img [src]="savingsSVG"  alt="Savings"><span>Savings</span></button>
          <button (click)="createStatsCoponent()"><img [src]="statsSVG" alt="stats"><span>Stats</span></button>
          <button (click)="createPictogramsComponent()"><img [src]="pictogramSVG" alt="pics"><span>Icons</span></button>
          <button (click)="openExportDialog()"><img [src]="exportSVG" alt="export"><span>Export</span></button>
          </div>
          <div>
          <button (click)="createHelpComponent()"><img [src]="helpSVG" alt="help"><span>Help</span></button>
          <button (click)="openSettingsDialog()" class="bottomButton"><img [src]="settingsSVG" alt="settings"><span>Settings</span></button>
          </div>
          
        </div>
      </mat-sidenav>
      <mat-sidenav-content [style.marginLeft]="opened ? '200px' : '0' ">
        <div class = "toggle-button-container">
          <button class="toggle-button" mat-button (click)="toggleSidenav()">
            <img class = "buttonTogglePic" [src]="toggleSVGCollapse">
          </button>
        </div>
        <ng-container #dynamicComponentContainer class="custom-registry-container"></ng-container>

      </mat-sidenav-content>
    </mat-sidenav-container>
    

  `,
  styleUrl: './finance.component.css'
})
export class FinanceComponent {

  title="finance!"
  toggleSVGCollapse = "/assets/arrowLeft.svg";
  homeSVG = "/assets/home.svg";
  settingsSVG = "/assets/settings.svg"
  helpSVG = "/assets/help.svg";
  exportSVG = "/assets/export.svg";
  savingsSVG = "/assets/savings.svg";
  pictogramSVG = "/assets/pictogramButton.svg";
  statsSVG = "/assets/stats.svg";

  opened = true;




  toggleSidenav(): void {
    this.opened = !this.opened;
  }
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,public dialog:MatDialog) {}

  ngAfterViewInit(): void {
  }
 

  createRegistryComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(RegistryComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }


  createStatsCoponent() :void{

    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(StatsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);

  }


  createPictogramsComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(PictogramsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createSavingsComponent(): void {
    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(SavingsComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);
  }

  createHelpComponent() : void {

    this.dynamicComponentContainer.clear();

    const factory = this.componentFactoryResolver.resolveComponentFactory(HelpPageComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(factory);

  }


  openExportDialog(){

    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);

    });
    
  }

  openSettingsDialog(){

    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);

    });
    
  }
}
