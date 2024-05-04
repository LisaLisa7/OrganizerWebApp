import { Component } from '@angular/core';
import { PictogramService } from '../../../../../services/pictogram.service';
import { CommonModule } from '@angular/common';
import { PictogramEntry } from '../../../../../interfaces/pictogram-entry';
import { MatDialog } from '@angular/material/dialog';
import { NewPictogramDialogComponent } from '../dialogs/new-pictogram-dialog/new-pictogram-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pictograms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pageContainer">
      <div class="button-container">

        <button class="newPictogramButton" (click)="openDialog()"><img class ="buttonPic" [src]="newSVG"><span>Personalize new pictogram</span></button>

      </div>
      
      
      <div class="categoriesContainer">
        <button class="category-button" (click)="loadData()" >All</button>
        <div *ngFor="let category of categories" class="category-buttons-Container">
          <button class="category-button" (click)="loadDataByCategory(category)">{{category}}</button>
        </div>
      
      </div>

      <div class = "pictogramContainerWrapper">
          <div class = "pictogramContainer">
            
            <div *ngFor="let entry of entries" class="entry">
              <img [src] = "entry.Url" class="entry-img" >
              <p>{{entry.Title}}</p>
              <button class="delete-button" (click)="selectPictogram(entry)" >Delete</button>

              
            </div>
          </div>
      </div>


    </div>

  `,
  styleUrl: './pictograms.component.css'
})
export class PictogramsComponent {

  entries : PictogramEntry[] = [];
  categories: string[] = [];
  readonly newSVG = "/assets/addPic.svg";
  

  constructor(private pictogramService:PictogramService,public dialog: MatDialog)
  {
    this.loadData();
    

  }
  async loadDataByCategory(category:string){
    console.log(category);
    
    this.entries = await this.pictogramService.getAllByCategory(category);
    console.log(this.entries);

  }

  async loadData(){
    try{
      this.entries = await this.pictogramService.getAllPictograms();
      this.categories = await this.pictogramService.getAllCategories();
      console.log(this.entries);
      console.log(this.categories);
    }catch(error)
    {
      console.error("error loading pictograms", error);
    }
  }

  openDialog():void{

    //this.registryService.getEntriesByMonth();
    
    const dialogRef = this.dialog.open(NewPictogramDialogComponent, {
      width: '500px', // Adjust the width as needed
      data: {categories : this.categories} // Optionally pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the dialog is closed
      console.log('Dialog closed with result:', result);
      this.loadData();
      //this.registryService.updateEntries();
      //this.savingsService.updateEntries();
      

    });


  }

  async selectPictogram(entry:any){
    console.log(entry.Id);
    await this.pictogramService.deletePictogram(entry.Id);
    console.log("????");
    this.loadData();
  }


}
