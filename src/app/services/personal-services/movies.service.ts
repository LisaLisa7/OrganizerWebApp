import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { ListMovie } from '../../interfaces/personal-interfaces/list-movie';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MoviesService {

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


  constructor() { }


  async getAllList(){
    
    const records = await  this.pb.collection("MovieList").getFullList({requestKey: null})

    const movies : ListMovie[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      
      
      return{
      Id: record['id'],
      Title: record['Title'],
      Status: record['Status'],
      Rating : record['Rating'],
      Review : record['Review']
      };

    }));
    console.log(movies);
    return movies;
  }


  
  async getMoviesByStatus(status:string)
  {

    const filterString = `Status = "${status}"`
    console.log(filterString);


    const entries = await this.pb.collection("MovieList").getFullList({requestKey:null,filter:filterString})


    console.log(entries);

    const movies : ListMovie[] = await Promise.all(entries.map(async (record: { [key: string]: any }) => {

      return {
        Id: record['id'],
        Title: record['Title'],
        Status: record['Status'],
        Rating : record['Rating'],
        Review : record['Review']
      }
    }));

    return movies;


  }

  async deleteListMovie(id : string)
  {
    try{
    const rec = await this.pb.collection("MovieList").delete(id);
    }
    catch(e){
      console.log("Delete failed")
    }
  }

  async updateListMovie(id:string,form:any)
  {
    try{
      const rec = await this.pb.collection("MovieList").update(id,form);
    }
    catch(e){
      console.log("Update failed");
    }
  }

  async insertMovieIntoList(data:any)
  {
    const rec = await this.pb.collection("MovieList").create(data);
  }

}


