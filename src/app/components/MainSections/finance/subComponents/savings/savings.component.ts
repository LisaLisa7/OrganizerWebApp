import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsEntryComponent } from "../entries/savings-entry/savings-entry.component";
import { SeeAllDialogComponent } from '../dialogs/see-all-dialog/see-all-dialog.component';
import { RegistryService } from '../../../../../services/finance-services/registry.service';
import { MatDialog } from '@angular/material/dialog';
import { Summary } from '../../../../../interfaces/finance-interfaces/summary';
import { SummaryComponent } from '../summary/summary.component';
import { Subject, takeUntil } from 'rxjs';


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
  private unsubscribe$ = new Subject<void>();


  constructor(public dialog: MatDialog, private registryService: RegistryService){
    this.subscribeToEntryEvents();
    this.loadData();
    //this.subscribeToEntryEvents();

  }

  subscribeToEntryEvents() {
    this.registryService.entryAdded$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadData();
      
    });

    this.registryService.entryDeleted$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadData();
    });

    this.registryService.entryModified$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadData();
    });


  }

  openDialogAllEntriesSavings() : void{
    //console.log(await this.registryService.getPaginated(undefined,undefined));

    const dialogRef = this.dialog.open(SeeAllDialogComponent, {
      width: '800px',
      data: {"savings":true} 
    });

    dialogRef.afterClosed().subscribe(result => {

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
