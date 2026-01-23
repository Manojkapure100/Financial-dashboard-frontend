import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { DetailpageComponent } from './components/detailpage/detailpage.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'home',
    component: HomepageComponent,
  },
  {
    path: 'company', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'company/:symbol',
    component: DetailpageComponent,
  },
];
