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

      <div class="container-right">
      <h1>Envelope challange</h1>
      <div class="envelope-container">

      <img *ngFor="let envelope of envelopes; let i = index" [src]="envelope.pic" class="envelope-image" (click)="changePic(i)">
      </div>

      </div>
    </div>
  `,
    styleUrl: './savings.component.css',
    imports: [CommonModule, SavingsEntryComponent,SummaryComponent]
})
export class SavingsComponent {

  readonly envelopeOpenPic = "/assets/env.svg";
  readonly envelopeClosedPic = "/assets/env2.svg";
  nrEnvelope = 100;
  envelopes: any[] = [];
  envelopeIndices: number[] = Array.from({ length: this.nrEnvelope }, (_, index) => index);

  summaryList : Summary[] = [];


  changePic(index: number): void {
    this.envelopes[index].pic = this.envelopeOpenPic;
  }

  constructor(public dialog: MatDialog, private registryService: RegistryService){
    this.envelopes = Array.from({ length: this.nrEnvelope }, () => ({ pic: this.envelopeClosedPic }));
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
