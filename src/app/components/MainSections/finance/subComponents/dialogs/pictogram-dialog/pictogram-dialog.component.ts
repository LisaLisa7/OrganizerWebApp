import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { PictogramService } from '../../../../../../services/finance-services/pictogram.service';
import { PictogramEntry } from '../../../../../../interfaces/finance-interfaces/pictogram-entry';
@Component({
  selector: 'app-pictogram-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div mat-dialog-content>
      <div class="categoriesContainer">
        <button class="category-button" (click)="loadData()" >All</button>
        <div *ngFor="let category of categories" class="category-buttons-Container">
          <button class="category-button" (click)="loadDataByCategory(category)">{{category}}</button>
        </div>
      </div>
      <div class = "pictogramContainerWrapper">
        <div class = "pictogramContainer">
          
          <div *ngFor="let entry of idk" class="entry" (click)="selectPic(entry)">
            <img [src] = "entry.Url" >
            <p>{{entry.Title}}</p>
            
          </div>
        </div>
      </div>

    </div>
  `,
  styleUrl: './pictogram-dialog.component.css'
})
export class PictogramDialogComponent {

  idk : PictogramEntry[] = [];
  categories: string[] = [];

  constructor(public dialogRef: MatDialogRef<PictogramDialogComponent>,
    private pictogramService:PictogramService) {

      this.loadData();
    }

  selectPic(entry:PictogramEntry){
    
    const obj = {
      picId: entry.Id,
      picUrl: entry.Url
    }
    console.log("selected pic: ")
    
    this.dialogRef.close(obj);
  }

  async loadDataByCategory(category:string){
    console.log(category);
    
    this.idk = await this.pictogramService.getAllByCategory(category);
    console.log(this.idk);

  }


  async loadData(){
    try{
      this.idk = await this.pictogramService.getAllPictograms();
      this.categories = await this.pictogramService.getAllCategories();

      console.log(this.idk);
    }catch(error)
    {
      console.error("error loading pictograms", error);
    }
  }
  
  

  onClose():void{
    console.log("closed pictogram dialog");
  }

  onSubmit():void{
    console.log("submited pictogram dialog");
  }

}
