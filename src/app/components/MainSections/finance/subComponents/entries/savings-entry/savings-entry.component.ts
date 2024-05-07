import { Component } from '@angular/core';
import { RegistryService } from '../../../../../../services/finance-services/registry.service';
import { CommonModule } from '@angular/common';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryDialogFormComponent } from '../../dialogs/entry-dialog-form/entry-dialog-form.component';
import { SavingsService } from '../../../../../../services/finance-services/savings.service';

@Component({
  selector: 'app-savings-entry',
  standalone: true,
  imports: [CommonModule,DatePipe],
  template: `
    <table>
        <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Sum</th>
          <th>Date</th>
          <th></th>
          <th></th>
        </tr>
        </thead>
      <tbody>
        <tr *ngFor="let entry of entriesToday" [ngClass]="{'expense-entry': entry.Type === 'Savings-', 'income-entry': entry.Type === 'Savings+'}">
          <td class="td"><img *ngIf="entry.Pictogram" [src]="entry.Pictogram"></td>
          <td class="td">{{ entry.Description}}</td>
          <td class="td" >{{ entry.Type === 'Savings-' ? '-' : '+' }}{{ entry.Sum }}</td>
          <td class="td">{{entry.Date | date:' dd MMM':'UTC'}}</td>
          <td class="td"><div class="separator"></div></td>
          <td class="td">
            <button (click)="deleteEntry(entry)">Delete</button>
            <button (click)="modifyEntry(entry)">Modify</button>
            <button>Details</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrl: './savings-entry.component.css'
})
export class SavingsEntryComponent {

  entries2: registryEntry[] = [];
  entriesToday : registryEntry[] = [];
  entriesYesterday: registryEntry[] = [];
  



  private unsubscribe$ = new Subject<void>();
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();


 

  constructor(public dialog:MatDialog,private savingsService:SavingsService) {

    

    this.savingsService.entryAdded$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.loadEntries();
    });
    this.savingsService.entryDeleted$.pipe(takeUntil(this.unsubscribeDelete$)).subscribe(() => {
      this.loadEntries();
    });
    this.savingsService.entryModified$.pipe(takeUntil(this.unsubscribeModified$)).subscribe(() => {
      this.loadEntries();
    });

  }

  async idk(){
    console.log("?")
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async deleteEntry(entry: registryEntry){
    console.log(entry);
    await this.savingsService.deleteRecord(entry.Id)
    this.savingsService.deleteEntry();
    
    //this.loadEntries();
  }

  async modifyEntry(entry:registryEntry){
    console.log("ok")
    const dialogRef = this.dialog.open(EntryDialogFormComponent,{
      width: '500px', // Adjust the width as needed
      data: {entry} // Optionally pass data to the dialog
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.savingsService.modifyEntry();
    //this.loadEntries();
  });

  }


  async loadEntries() {
    try {
      this.entries2 = await this.savingsService.getAllEntries();
      this.entriesToday = await this.savingsService.getRecentEntriesToday();
      this.entriesYesterday = await this.savingsService.getRecentEntriesYesterday();

      //console.log(this.entries2)
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }

  

}
