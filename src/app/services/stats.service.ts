import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { registryEntry } from '../interfaces/registryEntry';
import { PictogramEntry } from '../interfaces/pictogram-entry';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }
  pb = new PocketBase('http://127.0.0.1:8090');


  


  async getCategoryOfPictogram(id:string){
  const record = await this.pb.collection('Pictograms').getOne(id, {
    fields: "Category",requestKey:null});

    console.log(record);
    return record;
    
  }



  calculateProportionsPieChart(currentMonthEntries:registryEntry[]) {
    const typeCounts: { [type: string]: number } = {};
    let pieChartData;

    // Count the number of entries for each type
    currentMonthEntries.forEach(entry => {
      if (typeCounts[entry.Type]) {
        typeCounts[entry.Type]++;
      } else {
        typeCounts[entry.Type] = 1;
      }
    });

    // Calculate proportions
    const totalEntries = currentMonthEntries.length;
    pieChartData = Object.keys(typeCounts).map(type => ({
      name: type,
      value: (typeCounts[type] / totalEntries) * 100 // Calculate percentage
    }));

    return pieChartData;
  }


  
  async calculateProportionsPieChart2(currentMonthEntries:registryEntry[]) 
  {

    const typeCounts: { [type: string]: number } = {};
    let count = 0;

    // Iterate over the current month entries
    for (const entry of currentMonthEntries) {
      // Get the category for the entry's pictogram
      if(entry.Type === "Expenses")
      {
        count += 1;
      const category = await this.getCategoryOfPictogram(entry.Pictogram);
      
      // Increment the count for the category
      if (category) {
        typeCounts[category['Category']] = (typeCounts[category['Category']] || 0) + 1;
      }
    }
    }
    

    // Convert the typeCounts object into an array of { category, count } objects
    const pieChartData = Object.keys(typeCounts).map(category => ({
      name : category,
      value: (typeCounts[category] /count) * 100 // Calculate percentage
    }));

    return pieChartData;
    //console.log(pieChartData);
  }

  async getFked(){
    let monthlyData = [
      {
        "name": "Germany",
        "series": [
          {
            "name": "2010",
            "value": 7300000
          },
          {
            "name": "2011",
            "value": 8940000
          }
        ]
      },
    
      {
        "name": "USA",
        "series": [
          {
            "name": "2010",
            "value": 7870000
          },
          {
            "name": "2011",
            "value": 8270000
          }
        ]
      },
    
      {
        "name": "France",
        "series": [
          {
            "name": "2010",
            "value": 5000002
          },
          {
            "name": "2011",
            "value": 5800000
          }
        ]
      }
    ];
    


    return monthlyData;
  }
    

  
  


  


  calculateDataBarChart(currentMonthEntries:registryEntry[])
  {

    const typeSum: { [type: string]: number } = {};
  let barChartData;

  // Count the sum of entries for each type
  currentMonthEntries.forEach(entry => {
    if (typeSum[entry.Type]) {
      typeSum[entry.Type] += entry.Sum;
    } else {
      typeSum[entry.Type] = entry.Sum;
    }
  });

  // Convert typeSum to barChartData
  barChartData = Object.keys(typeSum).map(type => ({
    name: type,
    value: typeSum[type]
  }));

  return barChartData;

  }
  
}
