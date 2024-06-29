import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { registryEntry } from '../../interfaces/finance-interfaces/registryEntry';

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

    currentMonthEntries.forEach(entry => {
      if (typeCounts[entry.Type]) {
        typeCounts[entry.Type]++;
      } else {
        typeCounts[entry.Type] = 1;
      }
    });

    const totalEntries = currentMonthEntries.length;
    pieChartData = Object.keys(typeCounts).map(type => ({
      name: type,
      value: (typeCounts[type] / totalEntries) * 100 
    }));

    return pieChartData;
  }


  
  async calculateProportionsPieChart2(currentMonthEntries:registryEntry[]) 
  {

    const typeCounts: { [type: string]: number } = {};
    let count = 0;

    for (const entry of currentMonthEntries) {
      if(entry.Type === "Expenses" && entry.Pictogram)
      {
        count += 1;
        const category = await this.getCategoryOfPictogram(entry.Pictogram);
        
        if (category) {
          typeCounts[category['Category']] = (typeCounts[category['Category']] || 0) + 1;
        }
      }
    }
    
    const pieChartData = Object.keys(typeCounts).map(category => ({
      name : category,
      value: (typeCounts[category] /count) * 100 
    }));

    return pieChartData;
  }


  async calculateDataBarChart2(currentMonthEntries:registryEntry[],lastMonthEntries:registryEntry[],
                              currentMonthName: string, lastMonthName: string
  )
  {
    
     
    const currentMonthIncome = currentMonthEntries
    .filter(entry => entry.Type === 'Income')
    .reduce((sum, entry) => sum + entry.Sum, 0);

    const currentMonthExpenses = currentMonthEntries
    .filter(entry => entry.Type === 'Expenses')
    .reduce((sum, entry) => sum + entry.Sum, 0);

    const lastMonthIncome = lastMonthEntries
    .filter(entry => entry.Type === 'Income')
    .reduce((sum, entry) => sum + entry.Sum, 0);

    const lastMonthExpenses = lastMonthEntries
    .filter(entry => entry.Type === 'Expenses')
    .reduce((sum, entry) => sum + entry.Sum, 0);

    const data: any[] = [
      {
        name: "Income",
        series: [
          { name: currentMonthName, value: currentMonthIncome },
          { name: lastMonthName, value: lastMonthIncome }
        ]
      },
      {
        name: "Expenses",
        series: [
          { name: currentMonthName, value: currentMonthExpenses },
          { name: lastMonthName, value: lastMonthExpenses }
        ]
      }
    ];
  
    return data;

  }
  
  calculateDataBarChart(currentMonthEntries:registryEntry[])
  {

    const typeSum: { [type: string]: number } = {};
  let barChartData;

  currentMonthEntries.forEach(entry => {
    if (typeSum[entry.Type]) {
      typeSum[entry.Type] += entry.Sum;
    } else {
      typeSum[entry.Type] = entry.Sum;
    }
  });

  barChartData = Object.keys(typeSum).map(type => ({
    name: type,
    value: typeSum[type]
  }));

  return barChartData;

  }
  
}
