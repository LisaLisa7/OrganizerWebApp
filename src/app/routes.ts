import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FinanceComponent } from './components/MainSections/finance/finance.component';
import { AcademicComponent } from './components/MainSections/academic/academic.component';
import { PersonalComponent } from './components/MainSections/personal/personal.component';


const routeConfig: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home page'
      },
      {
        path: 'finance',
        component: FinanceComponent,
        title: 'Financial section'
      },
      {
        path: 'academic',
        component: AcademicComponent,
        title: 'Academic section'
      },
      {
        path: 'personal',
        component: PersonalComponent,
        title: 'Personal section'
      }


]

export default routeConfig;