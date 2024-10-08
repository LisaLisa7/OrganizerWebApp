import { Component } from '@angular/core';
import { RegistryService } from '../../../../../../services/finance-services/registry.service';
import { CommonModule } from '@angular/common';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryDialogFormComponent } from '../../dialogs/entry-dialog-form/entry-dialog-form.component';
import { RecurringService } from '../../../../../../services/finance-services/recurring.service';
import { ConfirmationDialogService } from '../../../../../../services/confirmation-dialog.service';


@Component({
  selector: 'app-registry-entry',
  standalone: true,
  imports: [CommonModule,DatePipe],
  template: `
    <div *ngIf="this.entriesToday.length!=0; else noEntriesTodayTemplate">
      
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
            <td class="td"><img *ngIf="entry.Pictogram" [src]="entry.Pictogram"></td>
            
            <td class="td">{{ entry.Description}}</td>
            <td class="td" >{{ entry.Type === 'Expenses' ? '-' : '+' }}{{ entry.Sum }}</td>
            <td class="td">{{entry.Date | date:' HH:mm':'UTC'}}</td>
            <td class="td"><div class="separator"></div></td>
            <td class="td">
              <button (click)="deleteEntry(entry)">Delete</button>
              <button (click)="modifyEntry(entry)">Modify</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ng-template #noEntriesTodayTemplate>
        <div>
          <h1>No entries for today!</h1>
        </div>
    </ng-template>
    
  `,
  styleUrl: './registry-entry.component.css'
})
export class RegistryEntryComponent {

  entriesToday : registryEntry[] = [];
  
  private unsubscribe$ = new Subject<void>();
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();

  constructor(public dialog:MatDialog,private registryService: RegistryService,private recurringService:RecurringService,private confirmService:ConfirmationDialogService) {

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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async deleteEntry(entry: registryEntry){
    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this entry?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){

      console.log(entry);
      await this.registryService.deleteRecord(entry.Id)
      this.registryService.deleteEntry();
    }
    
    //this.loadEntries();
  }

  async modifyEntry(entry:registryEntry){
    console.log("ok")
    const dialogRef = this.dialog.open(EntryDialogFormComponent,{
      width: '500px', 
      data: {entry} 
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.registryService.modifyEntry();
  });

  }

  async loadEntries() {
    try {
      this.entriesToday = await this.registryService.getRecentEntriesToday();
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }

}
