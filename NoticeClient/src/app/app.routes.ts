import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: './components/app-home/app-home.component',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
