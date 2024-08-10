import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import('./country/country.module').then(m => m.CountryModule)
  },
  { path: '**',
    pathMatch: 'full',
    redirectTo: '/selector'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
