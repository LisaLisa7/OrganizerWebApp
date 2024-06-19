import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsEntryComponent } from "../entries/savings-entry/savings-entry.component";
import { SeeAllDialogComponent } from '../dialogs/see-all-dialog/see-all-dialog.component';
import { RegistryService } from '../../../../../services/finance-services/registry.service';
import { MatDialog } from '@angular/material/dialog';
import { Summary } from '../../../../../interfaces/finance-interfaces/summary';
import { SummaryComponent } from '../summary/summary.component';


@Component({
    selector: 'app-savings',
    standalone: true,
    template: `
    <div class="savingsCom">
      <div class="container-left">

        <div class="container-left-1">

          <div class="summary-container">
              <app-summary
              *ngFor="let i of summaryList"
              [Summary]="i"
              >
            </app-summary>
          </div>
        
        </div>
        
        <div class="container-left-2">

          <h1>Recent Savings<span><button class="seeAllButton" (click)="openDialogAllEntriesSavings()">See all</button></span></h1>
          <app-savings-entry >
          </app-savings-entry>

        </div>

      </div>

    </div>
  `,
    styleUrl: './savings.component.css',
    imports: [CommonModule, SavingsEntryComponent,SummaryComponent]
})
export class SavingsComponent {
  
  summaryList : Summary[] = [];

  constructor(public dialog: MatDialog, private registryService: RegistryService){
    this.loadData();

  }

  openDialogAllEntriesSavings() : void{
    //console.log(await this.registryService.getPaginated(undefined,undefined));

    const dialogRef = this.dialog.open(SeeAllDialogComponent, {
      width: '800px', // Adjust the width as needed
      data: {"savings":true} // Optionally pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('Dialog closed with result:', result);
      
      

    });
  }

  async loadData(){
    try{
      this.summaryList = await this.registryService.getSummarySavings();

    }catch(error){
      console.error("Error loading",error);
    }
  }
}
