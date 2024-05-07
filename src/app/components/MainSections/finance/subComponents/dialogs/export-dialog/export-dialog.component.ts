import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RegistryService } from '../../../../../../services/finance-services/registry.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { registryEntry } from '../../../../../../interfaces/finance-interfaces/registryEntry';
import { saveAs } from 'file-saver';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2 mat-dialog-title style="text-align: center;">Export</h2>
    <div mat-dialog-content>

      
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
  styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {

  currentDate : any;
  registryEntries : registryEntry[] = [];
  
  fieldNames :any;

  exportType :string = 'pdf';


  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>,private registryService:RegistryService){

    this.currentDate = new Date().toDateString();
    this.loadData();


  }
  toggleSelected(typeE : string)
  {
    this.exportType = typeE; 
  }

  async loadData(){
    this.registryEntries = await this.registryService.getAllEntries();
    console.log(this.fieldNames);


  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(entry => Object.values(entry).join(',')).join('\n');
    return header + rows;
}

// Function to download CSV file
  downloadCSV(data: any[], filename: string): void {
      const filteredEntries = data.map(({ Id, Pictogram, ...rest }) => rest);
      const csvContent = this.convertToCSV(filteredEntries);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, filename);
  }

  generateCSVAndDownload(): void {
    this.downloadCSV(this.registryEntries, 'data.csv');
  }

  export(){
    if(this.exportType === 'pdf')
      this.exportPDF();
    else
      this.exportCSV();
  }


  public exportPDF(): void {

    const filteredEntries = this.registryEntries.map(({ Id, Pictogram, ...rest }) => rest);
    const fieldNames = Object.keys(filteredEntries[0]);
    const fieldValues = filteredEntries.map(entry => Object.values(entry));
    console.log(fieldValues);

    const numColumns = fieldNames.length;
    const columnWidths = Array(numColumns).fill('auto');

    // Define document definition
    const docDefinition: TDocumentDefinitions = {
      content: [
        {text:this.currentDate},
        { text: "All entries", style: 'header' },   
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
            margin: [0, 20, 0, 20] as [number, number, number, number] // [left, top, right, bottom]
        },
      },
      
  };

    pdfMake.createPdf(docDefinition).download("data.pdf");
    
  }

  exportCSV(){


    this.generateCSVAndDownload();
  }


}
