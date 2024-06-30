import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryDialogFormComponent } from '../../dialogs/entry-dialog-form/entry-dialog-form.component';
import { SavingsService } from '../../../../../../services/finance-services/savings.service';
import { ConfirmationDialogService } from '../../../../../../services/confirmation-dialog.service';
import { RegistryService } from '../../../../../../services/finance-services/registry.service';

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
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrl: './savings-entry.component.css'
})
export class SavingsEntryComponent {

  entriesToday : registryEntry[] = [];
  
  private unsubscribe$ = new Subject<void>();
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();

  constructor(public dialog:MatDialog,private savingsService:SavingsService,private registryService:RegistryService,private confirmService:ConfirmationDialogService) {

    

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
      await this.savingsService.deleteRecord(entry.Id)
      this.savingsService.deleteEntry();
    }
    
    this.loadEntries();
  }

  async modifyEntry(entry:registryEntry){
    console.log("ok")
    const dialogRef = this.dialog.open(EntryDialogFormComponent,{
      width: '500px', 
      data: {entry} 
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    console.log("wtffff")
    //this.savingsService.modifyEntry();
    this.loadEntries();
  });

  }


  async loadEntries() {
    try {
      this.entriesToday = await this.savingsService.getRecentEntriesToday();

    } catch (error) {
      console.error('Error loading entries:', error);
    }
  }

  

}
