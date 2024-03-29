import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { StockDataComponent } from './stock-data.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'search', component: StockDataComponent, data: { title: extract('Stock Search') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class StockDataRoutingModule { }
