import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { Game } from '../../interfaces/personal-interfaces/game';
import { ListGame } from '../../interfaces/personal-interfaces/list-game';
import { filter } from 'd3';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  pb = new PocketBase('http://127.0.0.1:8090');


  private entryDeletedSubject = new BehaviorSubject<void>(undefined);
  entryDeleted$ = this.entryDeletedSubject.asObservable();
  private entryModifiedSubject = new BehaviorSubject<void>(undefined);
  entryModified$ = this.entryModifiedSubject.asObservable();
  

  modifyEntry():void{
    this.entryModifiedSubject.next(undefined);
  }

  deleteEntry():void{
    this.entryDeletedSubject.next(undefined);
  }


  constructor() { 
    
  }


  async getAllGames(){

    const records = await  this.pb.collection("Games").getList(1,10,{requestKey: null})

    const games : Game[] = records.items.map((record: { [key: string]: any }) => {


      return {
      Id: record['id'],
      Name: record['Name'],
      Description: record['Description'],
      Studio : record['Studio'],
      Platforms: record['Platforms'],
      Genres: record['Genres'], 
      Tags: record['Tags'],
      URL : record['URL'] 
      }
    });
    console.log(games);
    
    return games;
  }

  async getGameNameById(id: string){
    const rec = await this.pb.collection("Games").getOne(id,{fields: "Name",requestKey:null});
    return rec['Name'];
    
  }

  async checkIfGameExistsInList(id:string){
    let filterString = `GameId = '${id}'`

    try{
      const rec = await this.pb.collection("GameList").getFirstListItem(filterString)
      console.log("exista")
      return true
    }
    catch(e)
    {
      console.log("nu exista in lista");
      return false
    }
  }

  async getAllList(){
    
    const records = await  this.pb.collection("GameList").getFullList({requestKey: null})
    let name = ""

    const games : ListGame[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      
      
      
      name = await this.getGameNameById(record['GameId']);
      
      return{
      Id: record['id'],
      Name: name,
      Status: record['Status'],
      Rating : record['Rating'],
      Review : record['Review']
      };

    }));
    console.log(games);
    return games;
  }

  
  async getGameByName(name:string)
  {
    const filterString = `Name ~ "${name}"`

    const records = await  this.pb.collection("Games").getList(1,20,{requestKey: null,filter:filterString})

    const games : Game[] = records.items.map((record: { [key: string]: any }) => {

      

      return {
        Id: record['id'],
        Name: record['Name'],
        Description: record['Description'],
        Studio : record['Studio'],
        Platforms: record['Platforms'],
        Genres: record['Genres'], 
        Tags: record['Tags'],
        URL : record['URL'] 
      }
    });
    console.log(games);
    
    return games;



  }

  async insertGameIntoList(data:any)
  {
    let exista = await this.checkIfGameExistsInList(data.GameId)
    let rec
    if (exista == false)
      rec = await this.pb.collection("GameList").create(data);
    else
      console.log("nu se poate insera")
  }


  async getPaginated(pageNumber:any,itemsPerPage:any,filter:any)
  {
    let resultList;

    if(filter == undefined)
      {
        resultList = await this.pb.collection('Games').getList(pageNumber, itemsPerPage, {
          filter: '',requestKey: null});
      }
      else
      {
        resultList = await this.pb.collection('Games').getList(pageNumber, itemsPerPage, {
          filter: filter,requestKey: null});
      }

      const entries: Game[] = await Promise.all(resultList.items.map(async (record: { [key: string]: any }) => {
    
        return {
          Id: record['id'],
          Name: record['Name'],
          Description: record['Description'],
          Studio : record['Studio'],
          Platforms: record['Platforms'],
          Genres: record['Genres'], 
          Tags: record['Tags'],
          URL : record['URL'] 
          
        };
      }));
  
  
      return {
        items : entries,
        currentPage : resultList.page,
        totalPages : resultList.totalPages
      };


  }

  async getGamesByStatus(status:string)
  {

    const filterString = `Status = "${status}"`
    console.log(filterString);

    let name = '';

    const entries = await this.pb.collection("GameList").getFullList({requestKey:null,filter:filterString})


    console.log(entries);

    const games : ListGame[] = await Promise.all(entries.map(async (record: { [key: string]: any }) => {

      name = await this.getGameNameById(record['GameId']);
      

      return {
        Id: record['id'],
        Name: name,
        Status: record['Status'],
        Rating : record['Rating'],
        Review : record['Review'],
        Platform : record['Platform']
      }
    }));

    return games;


  }
  async deleteListGame(id : string)
  {
    try{
    const rec = await this.pb.collection("GameList").delete(id);
    }
    catch(e){
      console.log("Delete failed")
    }
  }

  async updateListGame(id:string,form:any)
  {
    try{
      const rec = await this.pb.collection("GameList").update(id,form);
    }
    catch(e){
      console.log("Update failed");
    }
  }


}
