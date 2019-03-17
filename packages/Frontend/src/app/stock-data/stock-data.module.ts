import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { StockDataRoutingModule } from './stock-data-routing.module';
import { StockDataComponent } from './stock-data.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    StockDataRoutingModule,
    FormsModule
  ],
  declarations: [
    StockDataComponent
  ]
})
export class StockDataModule { }
