import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { SearchComponent } from './search.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'search', component: SearchComponent, data: { title: extract('Stock Search') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SearchRoutingModule { }
