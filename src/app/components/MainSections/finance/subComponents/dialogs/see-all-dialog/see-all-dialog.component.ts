import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegistryService } from '../../../../../../services/finance-services/registry.service';
import { CommonModule } from '@angular/common';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';
import { EntryDialogFormComponent } from '../entry-dialog-form/entry-dialog-form.component';
import { ConfirmationDialogService } from '../../../../../../services/confirmation-dialog.service';

@Component({
  selector: 'app-see-all-dialog',
  standalone: true,
  imports: [MatDialogModule,CommonModule],
  template: `
  <div class="dialog">
    <div mat-dialog-title class="dialogTitle">All entries</div>
    <div mat-dialog-content>
    
      <table>
        <thead>
        <tr>
            <th></th>
            <th>Title</th>
            <th>Sum</th>
            <th>Time</th>
            <th>Source</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
      

      <tr *ngFor="let item of items" [ngClass]="{'expense-entry': item.Type === 'Expenses', 'income-entry': item.Type === 'Income'}">

      <td class="td"><img [src]="item.Pictogram"></td>
          <td class="td">{{ item.Description}}</td>
          <td class="td" >{{ item.Type === 'Expenses' ? '-' : '+' }}{{ item.Sum }}</td>
          <td class="td">{{item.Date |  date:' dd MMM yyyy HH:mm ':'UTC'}}</td>
          <td class="td">{{item.Source}}</td>
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
</div>
  `,
  styleUrl: './see-all-dialog.component.css'
})
export class SeeAllDialogComponent {

  items : any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;
  savings = false

  ngOnClose():void{
    this.savings = false
  }

  async loadData() {
    let data
    if(this.savings == true)
    {
      let filterString = "Type = 'Savings+' || Type = 'Savings-'"
      data = await this.registryService.getPaginated(this.currentPage,this.itemsPerPage,filterString)
    }  
    else{
      data = await this.registryService.getPaginated(this.currentPage,this.itemsPerPage,undefined)
    }
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

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public registryService : RegistryService,
  public dialog:MatDialog,private confirmService:ConfirmationDialogService)
  {

    //console.log(data)
    console.log(Object.keys(data).length === 0)
    if(Object.keys(data).length !== 0 )
      this.savings = true
    //console.log(this.savings)
    this.loadData();
  }

  
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  async deleteEntry(entry: registryEntry){
    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this entry?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
      console.log(entry);
      await this.registryService.deleteRecord(entry.Id)
      this.registryService.deleteEntry();
      this.loadData()
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
    this.loadData();
    //this.loadEntries();
  });

  }

}
