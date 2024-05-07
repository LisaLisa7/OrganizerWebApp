import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { Game } from '../../interfaces/personal-interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  pb = new PocketBase('http://127.0.0.1:8090');


  constructor() { }


  async getAllGames(){

    const records = await  this.pb.collection("Games").getFullList({requestKey: null})

    const games : Game[] = records.map((record: { [key: string]: any }) => ({
      Id: record['id'],
      Name: record['Name'],
      Description: record['Description'],
      Studio : record['Studio'],
      Platforms : record['Platforms'],
      Tags : record['Tags']
    }));
    console.log(games);
    return games;
  }
}
