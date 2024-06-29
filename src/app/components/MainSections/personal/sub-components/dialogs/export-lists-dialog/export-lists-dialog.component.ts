import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import { saveAs } from 'file-saver';
import { BooksService } from '../../../../../../services/personal-services/books.service';
import { GamesService } from '../../../../../../services/personal-services/games.service';
import { MoviesService } from '../../../../../../services/personal-services/movies.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ListGame } from '../../../../../../interfaces/personal-interfaces/list-game';
import { ListBook } from '../../../../../../interfaces/personal-interfaces/list-book';
import { ListMovie } from '../../../../../../interfaces/personal-interfaces/list-movie';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-export-lists-dialog',
  standalone: true,
  imports: [MatFormFieldModule,MatDialogModule,FormsModule,MatSelectModule],
  template: `
   <h2 mat-dialog-title style="text-align: center;">Export</h2>
    <div mat-dialog-content>

      <form>
        <mat-form-field>
        <mat-label>List</mat-label>
            <mat-select [(ngModel)]="selectedList"
            name="List" required>
              @for (list of listOptions; track list){
                <mat-option [value] = "list.value">{{list.viewValue}}</mat-option>
              }
            </mat-select>
        </mat-form-field>
      </form>
        
        <div class="radio-button-container">
          <h3>Type of export
          <span>
          <input id="tab-1" type="radio" class="pdf-radio" checked name="tab" (change)="toggleSelected('pdf')" />
          <label for="tab-1" class="tab">PDF</label>
          <input id="tab-2" type="radio" class="csv-radio" name="tab" (change)="toggleSelected('csv')"  />
          <label for="tab-2" class="tab">CSV</label>
          </span></h3>
        </div>

      
      
    </div>

    <div mat-dialog-actions class="buttonContainer">
      <button mat-button (click)="export()">export</button>
    </div>
  `,
  styleUrl: './export-lists-dialog.component.css'
})
export class ExportListsDialogComponent {


  currentDate : any;
  selectedList : string = 'Game List';

  readonly listOptions = [
    { value: 'Game List', viewValue: 'Game List' },
    { value: 'Movie List', viewValue: 'Movie List' },
    { value: 'Book List', viewValue: 'Book List' }
  ];

  
  fieldNames :any;

  exportType :string = 'pdf';

  gameEntries : ListGame[] = [];
  bookEntries : ListBook[] = [];
  movieEntries : ListMovie[] = [];


  constructor(public dialogRef: MatDialogRef<ExportListsDialogComponent>,
            private booksService:BooksService,private gamesService:GamesService,private moviesService:MoviesService
  ){

    this.currentDate = new Date().toDateString();
    this.loadData();


  }
  toggleSelected(typeE : string)
  {
    this.exportType = typeE; 
  }

  async loadData(){
    this.gameEntries = await this.gamesService.getAllList();
    this.movieEntries = await this.moviesService.getAllList();
    this.bookEntries = await this.booksService.getAllList();

    console.log(this.fieldNames);


  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(entry => Object.values(entry).join(',')).join('\n');
    return header + rows;
}


  downloadCSV(data: any[], filename: string): void {
      const filteredEntries = data.map(({ Id, ...rest }) => rest);
      const csvContent = this.convertToCSV(filteredEntries);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, filename);
  }

  generateCSVAndDownload(): void {
    switch(this.selectedList)
    {
      case "Game List":
        this.downloadCSV(this.gameEntries, 'GameList.csv');
        break;
      case "Movie List":
        this.downloadCSV(this.movieEntries, 'MovieList.csv');
        break;
      case "Book List":
        this.downloadCSV(this.bookEntries, 'BookList.csv');
        break;
      
    }
  }


  export(){
    if(this.exportType === 'pdf')
      this.exportPDF();
    else
      this.exportCSV();
  }


  public exportPDF(): void {

    let filteredEntries

 
    switch(this.selectedList)
    {
      case "Game List":
        filteredEntries = this.gameEntries.map(({ Id, ...rest }) => rest);
        break;
      case "Movie List":
        filteredEntries = this.movieEntries.map(({ Id, ...rest }) => rest);
        break;
      default:
        filteredEntries = this.bookEntries.map(({ Id, ...rest }) => rest);
        break;
    }

    const fieldNames = Object.keys(filteredEntries[0]);
    const fieldValues = filteredEntries.map(entry => Object.values(entry));
    console.log(fieldValues);

    const numColumns = fieldNames.length;
    const columnWidths = Array(numColumns).fill('auto');

    const docDefinition: TDocumentDefinitions = {
      content: [
        {text:this.currentDate},
        { text: this.selectedList, style: 'header' },   
        {
            columns: [
                { width: '*', text: '' },
                {
                    width: 'auto',
                    layout: 'lightHorizontalLines', 
                    table: {
                        headerRows: 1,
                        widths: columnWidths,
                        body: [
                            fieldNames.map(fieldName => ({
                                text: fieldName,
                                style: 'tableHeader'
                            })),
                            ...fieldValues.map(entryValues => entryValues.map(value => String(value)))
                        ]
                    },
                    //pageBreak: 'after'
                },
                { width: '*', text: '' },
            ]
        },
        
      ],
      styles: {
          tableHeader: {
              bold: true,
              alignment: 'center'
          },
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 20, 0, 20] as [number, number, number, number] // [stg, sus, drpt, jos]
        },
      },
      
  };

    pdfMake.createPdf(docDefinition).download("data.pdf");
     
  }

 
  exportCSV(){


    this.generateCSVAndDownload();
  }


}
