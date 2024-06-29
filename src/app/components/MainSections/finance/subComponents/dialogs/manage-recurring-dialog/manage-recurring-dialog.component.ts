import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PictogramDialogComponent } from '../pictogram-dialog/pictogram-dialog.component';
import { RecurringEntryDialogComponent } from '../recurring-entry-dialog/recurring-entry-dialog.component';
import { RecurringService } from '../../../../../../services/finance-services/recurring.service';
import { recurringEntry } from '../../../../../../interfaces/finance-interfaces/recurringEntry';
@Component({
  selector: 'app-manage-recurring-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">All entries</h2>
    <div mat-dialog-content>
    
      <table>
        <thead>
        <tr>
            <th></th>
            <th>Title</th>
            <th>Sum</th>
            <th>Repeat</th>
            <th>On</th>
        </tr>
        </thead>
        <tbody>
      

      <tr *ngFor="let item of items">

      <td class="td"><img [src]="item.Pictogram"></td>
          <td class="td">{{ item.Description}}</td>
          <td class="td" >{{ item.Type === 'Expenses' ? '-' : '+' }}{{ item.Sum }}</td>
          <td class="td">{{item.Repeat}}</td> 
          <td class="td">{{item.MonthDay ? item.MonthDay : '-'}}</td>

          <td class="td"><div class="separator"></div></td>
          <td class="td">
            <div class="actionButtonsContainer">
              <button (click)="deleteEntry(item)">Delete</button>
              <button (click)="modifyEntry(item)">Modify</button>
            </div>
          </td>
      </tr>

  

        </tbody>
      </table>
      <div class = "navigatorContainer">
        <div *ngIf="totalPages > 1">
            <button class="arrowButton" (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
            <button *ngFor="let page of totalPagesArray()" (click)="changePage(page)" [class.active]="page === currentPage">{{ page }}</button>
            <button class="arrowButton"  (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Next</button>
          </div>
      </div>

    </div>
  `,
  styleUrl: './manage-recurring-dialog.component.css'
})
export class ManageRecurringDialogComponent {

  items : any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public recurringService : RecurringService,
  public dialog:MatDialog,
  public dialogRef2: MatDialogRef<PictogramDialogComponent>,
  public dialogRef: MatDialogRef<ManageRecurringDialogComponent>){

    this.loadData();

  }

  async loadData() {
    let data
    
    data = await this.recurringService.getPaginated(this.currentPage,this.itemsPerPage)
    
    this.items = data.items;
    this.totalPages = data.totalPages;
    console.log(this.items)
    console.log(this.totalPages)
  }

  async changePage(pageNumber : number) {
    if (pageNumber >=1 && pageNumber <= this.totalPages)
      {
        this.currentPage = pageNumber;
        await this.loadData();
      }
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  async deleteEntry(entry:recurringEntry){
    console.log(entry);
    await this.recurringService.deleteRecord(entry.Id)
    this.recurringService.deleteEntry();
    this.loadData()
    
    //this.loadEntries();
  }

  async modifyEntry(entry:recurringEntry){
    console.log("ok")
    const dialogRef = this.dialog.open(RecurringEntryDialogComponent,{
      width: '500px',
      data: {entry} 
  });
  dialogRef.afterClosed().subscribe((result: any) => {
    this.recurringService.modifyEntry();
    this.loadData();
    //this.loadEntries();
  });
  

  }

}
