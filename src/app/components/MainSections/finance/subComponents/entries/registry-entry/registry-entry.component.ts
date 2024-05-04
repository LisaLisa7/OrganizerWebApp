import { Component } from '@angular/core';
import { RegistryService } from '../../../../../../services/registry.service';
import { CommonModule } from '@angular/common';
import { registryEntry } from '../../../../../../interfaces/registryEntry';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryDialogFormComponent } from '../../dialogs/entry-dialog-form/entry-dialog-form.component';
import { RecurringService } from '../../../../../../services/recurring.service';


@Component({
  selector: 'app-registry-entry',
  standalone: true,
  imports: [CommonModule,DatePipe],
  template: `
      <table>
        <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Sum</th>
          <th>Time</th>
          <th></th>
          <th></th>
        </tr>
        </thead>
      <tbody>
        <tr *ngFor="let entry of entriesToday" [ngClass]="{'expense-entry': entry.Type === 'Expenses', 'income-entry': entry.Type === 'Income'}">
          <td class="td"><img [src]="entry.Pictogram"></td>
          <td class="td">{{ entry.Description}}</td>
          <td class="td" >{{ entry.Type === 'Expenses' ? '-' : '+' }}{{ entry.Sum }}</td>
          <td class="td">{{entry.Date | date:' HH:mm':'UTC'}}</td>
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
  styleUrl: './registry-entry.component.css'
})
export class RegistryEntryComponent {

  //entries: RecordModel[] = [];
  
  entries2: registryEntry[] = [];
  entriesToday : registryEntry[] = [];
  entriesYesterday: registryEntry[] = [];
  



  private unsubscribe$ = new Subject<void>();
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();


 

  constructor(public dialog:MatDialog,private registryService: RegistryService,private recurringService:RecurringService) {

    

    this.registryService.entryAdded$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.loadEntries();
    });
    this.registryService.entryDeleted$.pipe(takeUntil(this.unsubscribeDelete$)).subscribe(() => {
      this.loadEntries();
    });
    this.registryService.entryModified$.pipe(takeUntil(this.unsubscribeModified$)).subscribe(() => {
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
    await this.registryService.deleteRecord(entry.Id)
    this.registryService.deleteEntry();
    
    //this.loadEntries();
  }

  async modifyEntry(entry:registryEntry){
    console.log("ok")
    const dialogRef = this.dialog.open(EntryDialogFormComponent,{
      width: '500px', // Adjust the width as needed
      data: {entry} // Optionally pass data to the dialog
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.registryService.modifyEntry();
    //this.loadEntries();
  });

  }


  async loadEntries() {
    try {
      this.entries2 = await this.registryService.getAllEntries();
      this.entriesToday = await this.registryService.getRecentEntriesToday();
      this.entriesYesterday = await this.registryService.getRecentEntriesYesterday();
      //wtf

      //console.log(this.entries2)
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }

  
  

}
