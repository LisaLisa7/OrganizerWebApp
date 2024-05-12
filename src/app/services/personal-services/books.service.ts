import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { BehaviorSubject } from 'rxjs';
import { ListBook } from '../../interfaces/personal-interfaces/list-book';


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor() { }


  pb = new PocketBase('http://127.0.0.1:8090');

  private entryAddedSubject = new BehaviorSubject<void>(undefined);
  entryAdded$ = this.entryAddedSubject.asObservable();
  private entryDeletedSubject = new BehaviorSubject<void>(undefined);
  entryDeleted$ = this.entryDeletedSubject.asObservable();
  private entryModifiedSubject = new BehaviorSubject<void>(undefined);
  entryModified$ = this.entryModifiedSubject.asObservable();
  

  updateEntries():void{
    this.entryAddedSubject.next(undefined);
  }

  modifyEntry():void{
    this.entryModifiedSubject.next(undefined);
  }

  deleteEntry():void{
    this.entryDeletedSubject.next(undefined);
  }




  async getAllList(){
    
    const records = await  this.pb.collection("BookList").getFullList({requestKey: null})

    const books : ListBook[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      
      
      return{
      Id: record['id'],
      Title: record['Title'],
      Author: record['Author'],
      Status: record['Status'],
      Rating : record['Rating'],
      Review : record['Review']
      };

    }));
    console.log(books);
    return books;
  }


  
  async getBooksByStatus(status:string)
  {

    const filterString = `Status = "${status}"`
    console.log(filterString);


    const entries = await this.pb.collection("BookList").getFullList({requestKey:null,filter:filterString})


    console.log(entries);

    const books : ListBook[] = await Promise.all(entries.map(async (record: { [key: string]: any }) => {

      return {
        Id: record['id'],
        Title: record['Title'],
        Author: record['Author'],
        Status: record['Status'],
        Rating : record['Rating'],
        Review : record['Review']
      }
    }));

    return books;


  }

  async deleteListBook(id : string)
  {
    try{
    const rec = await this.pb.collection("BookList").delete(id);
    }
    catch(e){
      console.log("Delete failed")
    }
  }

  async updateListBook(id:string,form:any)
  {
    try{
      const rec = await this.pb.collection("BookList").update(id,form);
    }
    catch(e){
      console.log("Update failed");
    }
  }

  async insertBookIntoList(data:any)
  {
    const rec = await this.pb.collection("BookList").create(data);
  }



}
