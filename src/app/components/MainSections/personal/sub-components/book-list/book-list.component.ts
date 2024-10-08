import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListBook } from '../../../../../interfaces/personal-interfaces/list-book';
import { Subject, takeUntil } from 'rxjs';
import { BooksService } from '../../../../../services/personal-services/books.service';
import { MatDialog } from '@angular/material/dialog';
import { BookUpdateDialogComponent } from '../dialogs/lists-dialogs/book-update-dialog/book-update-dialog.component';
import { InsertBookDialogComponent } from '../dialogs/lists-dialogs/insert-book-dialog/insert-book-dialog.component';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pageContainer" >
      <div class="container">

          <div class="some-buttons-container">
              <button class="newButton" (click)="openDialog()" >
                <img class ="entryButtonPic" [src]="entryButtonPath"><span>Add new entry</span>
              </button>

          </div>

        
          <div *ngFor="let status of statusArray" class="statusContainer">
            
          <button type="button" class="tab tab-selector" [ngClass]="{'active': status === currentStatus}" (click)="buttonClick(status)">{{ status }}</button>

          </div>

          <div class="gameContainer">

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th (click)="sortRating()" class="clickable">Rating</th>
                <th>Review</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let book of bookData">
                <td>{{book.Title}}</td>
                <td>{{book.Author}}</td>
                <td>{{book.Status}}</td>
                <td>{{book.Rating}}/10</td>
                <td>{{book.Review}}</td>
                <td class="td"><div class="separator"></div></td>
                <td>
                  <div class="buttonContainer">
                  <button (click)="deleteEntry(book)">Delete</button>
                  <button (click)="modifyEntry(book)">Modify</button>
                  </div>
                </td>                

              </tr>
            </tbody>


          </table>

          </div>
     

      </div>
    </div>
  `,
  styleUrl: './book-list.component.css'
})
export class BookListComponent {

  statusArray = ['All','Reading','Read','Plan to Read','On Hold', 'Dropped'];


  readonly entryButtonPath = "/assets/plus.svg";


  bookData : ListBook[] = [];

  currentStatus :string = 'All'
  ascending = true;

  
  private unsubscribeDelete$ = new Subject<void>();
  private unsubscribeModified$ = new Subject<void>();

  constructor(private booksService : BooksService,public dialog: MatDialog,private confirmService:ConfirmationDialogService){

    this.booksService.entryDeleted$.pipe(takeUntil(this.unsubscribeDelete$)).subscribe(() => {

      if(this.currentStatus!= 'All')
        this.getBooksByStatus(this.currentStatus)
      else
        this.loadData();

    });
    this.booksService.entryModified$.pipe(takeUntil(this.unsubscribeModified$)).subscribe(() => {

      if(this.currentStatus!= 'All')
        this.getBooksByStatus(this.currentStatus)
      else
        this.loadData();

    });
  }

  async loadData(){
    this.bookData = await this.booksService.getAllList();
    
  }

  sortRating(){

    if(this.ascending == true)
    {
      console.log(1);
      this.bookData.sort((a, b) => a.Rating - b.Rating);
      this.ascending = false;
    }
    else
    {
      console.log(2);
      this.bookData.sort((a, b) => b.Rating - a.Rating);
      this.ascending = true;

    }

    console.log("sort");
  }


  
  buttonClick(status:string){

    this.currentStatus = status
    switch(status)
    {
      case 'All':
        this.getAllBooks();
        break;
      default:
        this.getBooksByStatus(status);


    }
  }

  async getAllBooks(){
    this.bookData = await this.booksService.getAllList();
  }

  async getBooksByStatus(status:string)
  {
    console.log(status);
    this.bookData = await this.booksService.getBooksByStatus(status);
  }

  async deleteEntry(entry: ListBook){
    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this book?");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
      console.log(entry);
      await this.booksService.deleteListBook(entry.Id)
      this.booksService.deleteEntry();
    }
    
    //this.loadEntries();
  }

  async modifyEntry(entry:ListBook){
    
    console.log("ok")
    //console.log(entry)
    const dialogRef = this.dialog.open(BookUpdateDialogComponent,{
      width: '500px',
      data: {entry} 
  })
  dialogRef.afterClosed().subscribe((result: any) => {
    this.booksService.modifyEntry();    
    
  });
  }

  openDialog(){
    console.log("ok")
    //console.log(entry)
    const dialogRef = this.dialog.open(InsertBookDialogComponent,{
      width: '500px',
      data: {} 
    })
    
    dialogRef.afterClosed().subscribe((result: any) => {
      this.booksService.modifyEntry();
      //this.loadEntries();
      
    });

  }
  
}
