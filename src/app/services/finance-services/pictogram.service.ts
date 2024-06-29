import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { PictogramEntry } from '../../interfaces/finance-interfaces/pictogram-entry';

@Injectable({
  providedIn: 'root'
})
export class PictogramService {

  pb = new PocketBase('http://127.0.0.1:8090');
  constructor() { 
  }

  async getAllCategories():Promise<string[]>{

    let entries = await this.getAllPictograms();
    const categories = [...new Set(entries.map(obj => obj.Category))];

    return categories;
  }

  async getAllByCategory(category:string):Promise<any>{
    const filterString = `Category = "${category}"`;

    let records = await this.pb.collection('Pictograms').getFullList({filter: filterString});
    let entries = await Promise.all(records.map(async (record: {[key: string]:any}) =>
    {

      const firstFilename = record['Pic'];
      const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})

      return {
        Id: record['id'],
        Pic: record['Pic'],
        Url: url,
        Category: record['Category'],
        Title: record['Title']
      }

    }));

    return entries;


  }

  async addPictogram(formData: any)
  {
    const createRec = await this.pb.collection('Pictograms').create(formData);
  }

  async deletePictogram(id:string)
  {
    const deleteRec = await this.pb.collection('Pictograms').delete(id);
  }

  async getAllPictograms() : Promise<PictogramEntry[]>{

    const records = await this.pb.collection('Pictograms').getFullList({
      sort: '-created',requestKey: null,
    });

    const entries: PictogramEntry[] = await Promise.all(records.map(async (record: {[key: string]:any}) =>
    {

      const firstFilename = record['Pic']; 
      const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})

      return {
        Id: record['id'],
        Pic: record['Pic'],
        Url: url,
        Category: record['Category'],
        Title: record['Title']
      }

    }));

    //console.log(entries); 
    return entries;
  }
}
