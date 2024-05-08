import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { Game } from '../../interfaces/personal-interfaces/game';
import { ListGame } from '../../interfaces/personal-interfaces/list-game';
import { filter } from 'd3';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  pb = new PocketBase('http://127.0.0.1:8090');


  constructor() { }


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
    const rec = await this.pb.collection("Games").getOne(id,{fields: "Name"});
    return rec['Name'];
    
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
      Review : record['Review'],
      Platform : record['Platform']
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
    const rec = await this.pb.collection("GameList").create(data);
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
      
        //console.log(this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'}));
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
  
        //const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
        //const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})
        
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


}
