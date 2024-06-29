import { Component } from '@angular/core';
import { RegistryEntryComponent } from '../entries/registry-entry/registry-entry.component';
import { MatDialogModule} from '@angular/material/dialog';
import { EntryDialogFormComponent } from '../dialogs/entry-dialog-form/entry-dialog-form.component';
import { MatDialog } from '@angular/material/dialog';
import { RegistryService } from '../../../../../services/finance-services/registry.service';
import { SummaryComponent } from '../summary/summary.component';
import { Summary } from '../../../../../interfaces/finance-interfaces/summary';
import { registryEntry } from '../../../../../interfaces/finance-interfaces/registryEntry';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecurringEntryDialogComponent } from '../dialogs/recurring-entry-dialog/recurring-entry-dialog.component';
import { RecurringService } from '../../../../../services/finance-services/recurring.service';
import { recurringEntry } from '../../../../../interfaces/finance-interfaces/recurringEntry';
import { SavingsEntryComponent } from '../entries/savings-entry/savings-entry.component';
import { SavingsService } from '../../../../../services/finance-services/savings.service';
import { SeeAllDialogComponent } from '../dialogs/see-all-dialog/see-all-dialog.component';
import { ManageRecurringDialogComponent } from '../dialogs/manage-recurring-dialog/manage-recurring-dialog.component';

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [CommonModule,RegistryEntryComponent,SavingsEntryComponent,MatDialogModule,SummaryComponent],
  template: `
    <div class="registryCom">
      <div class="container-up">
        <div class = "summary-container">
            <app-summary
              *ngFor="let i of idk"
              [Summary]="i"
              >
            </app-summary>
        </div>

        <div class="some-buttons-container">
            <button class="newEntryButton" (click)="openDialog()">
              <img class ="entryButtonPic" [src]="entryButtonPath"><span>Add new entry</span>
            </button>
            <button (click)="openDialogRecurringEntry()"><img src="/assets/revenue.svg"><span>Add Recurring Entry</span></button>
            <button (click)="openModifyRecurringEntry()"><img src="/assets/revenue.svg"><span>Modify Recurring Events</span></button>

        </div>
        
      </div>

      <div class="container-down">

        <div class="container-down-left">

          <h1>Recurring events</h1>
          
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Sum</th>
                <th>Repeat</th>

              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of recurringEntries">
                <td>{{r.Description}}</td>
                <td>{{r.Sum}}</td>
                <td>{{r.Repeat}}
                  <span *ngIf="r.Repeat == 'Monthly'"> on {{ r.MonthDay }}</span>
                </td>



              </tr>
            </tbody>

          </table>

        </div>

        <div class="container-down-right">
          <h1>Recent transactions</h1> 
          <h3>Today (<span>{{today}}</span>)<span><button class="seeAllButton" (click)="openDialogAllEntries()">See all</button></span>  </h3>
          <app-registry-entry ></app-registry-entry> 

        </div>
      
      </div>

    </div>

  `,
  styleUrl: './registry.component.css'
})
export class RegistryComponent {

  readonly entryButtonPath = "/assets/plus.svg";
  
  entriesCurrentMonth :registryEntry[] = [];
  idk : Summary[] = [];
  recurringEntries: recurringEntry[] = [];
  
  today :any;


  private unsubscribe$ = new Subject<void>();

  constructor(public dialog: MatDialog, private registryService: RegistryService,private recurringService:RecurringService,private savingsService : SavingsService) {
    this.loadData();
    this.loadRecurring();
    this.subscribeToEntryEvents();
    this.today = registryService.getCurrentDate();

    this.registryService.getRecentEntriesToday();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async loadData() {
    try{
      this.entriesCurrentMonth = await this.registryService.getEntriesByMonth();
      //console.log(this.entriesCurrentMonth);
      this.idk = await this.registryService.getTotalSumByMonth(this.entriesCurrentMonth);
      //console.log(this.idk)

    }catch(error){
      console.error("Error loading entries by month", error);
    }
    //const entriesCurrentMonth = await this.registryService.getEntriesByMonth();
    //console.log(entriesCurrentMonth);
    //
    //console.log(idk);
  }

  async loadRecurring(){
    try {
      this.recurringEntries = await this.recurringService.getAllEntries();
      await this.recurringService.handleRecurringEvents(this.recurringEntries);
      
      //console.log(this.recurringEntries);
      //console.log(this.entries2)
    } catch (error) {
      console.error('Error loading entries:', error);
    }
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

  openDialog(): void {

    //this.registryService.getEntriesByMonth();
    const dialogRef = this.dialog.open(EntryDialogFormComponent, {
      width: '500px',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      this.registryService.updateEntries();
      this.savingsService.updateEntries();
      

    });
  }

  openDialogAllEntries() : void{

    const dialogRef = this.dialog.open(SeeAllDialogComponent, {
      width: '800px', 
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    
    });

  }

  openDialogRecurringEntry(): void {

    //this.registryService.getEntriesByMonth();
    const dialogRef = this.dialog.open(RecurringEntryDialogComponent, {
      width: '500px', 
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      //this.registryService.updateEntries();
      this.loadRecurring();

    });
  }

  openModifyRecurringEntry():void{

    const dialogRef = this.dialog.open(ManageRecurringDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      //this.registryService.updateEntries();
      this.loadRecurring();

    });

  }

}
