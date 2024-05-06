import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RegistryService } from '../../../../../../services/registry.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { registryEntry } from '../../../../../../interfaces/registryEntry';

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
        <input id="tab-1" type="radio" class="pdf-radio" checked="checked" name="tab" />
        <label for="tab-1" class="tab">PDF</label>
        <input id="tab-2" type="radio" class="csv-radio" name="tab" />
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

  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>,private registryService:RegistryService){

    this.currentDate = new Date().toDateString();
    this.loadData();


  }

  async loadData(){
    this.registryEntries = await this.registryService.getAllEntries();
    console.log(this.fieldNames);


  }


  public export(): void {

    const filteredEntries = this.registryEntries.map(({ Id, Pictogram, ...rest }) => rest);
    const fieldNames = Object.keys(filteredEntries[0]);
    const fieldValues = filteredEntries.map(entry => Object.values(entry));
    console.log(fieldValues);

    const numColumns = fieldNames.length;
  const columnWidths = Array(numColumns).fill('auto');

    // Define document definition
    const docDefinition: TDocumentDefinitions = {
      content: [
          {
              table: {
                  headerRows: 1,
                  widths: columnWidths,
                  body: [
                      // Header row
                    fieldNames.map(fieldName => ({
                      text: fieldName,
                      bold: true, // Make the header row bold
                      alignment: 'center' // Center align the header row
                  })),
                      ...fieldValues.map(entryValues => entryValues.map(value => String(value)))
                    ]
              }
          }
      ]
  };

    pdfMake.createPdf(docDefinition).download("test.pdf");
  }


}
