import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiClientService } from '@app/shared/api-client.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSelect, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-search',
  templateUrl: './stock-data.component.html',
  styleUrls: ['./stock-data.component.scss']
})
export class StockDataComponent implements OnInit {
  
  displayedColumns: string[] = ['col_client_20', 'party_a', 'party_b', 'contract_date', 'match_status'];
  @ViewChild('paginator') match_paginator: MatPaginator;
  @ViewChild(MatSort) match_sort: MatSort;
  matchTable = new MatTableDataSource<any>();
  keys:any[]= [];
  aggregate_buy:number=0;
  aggregate_sell:number=0;

  constructor(private api: ApiClientService
    , private spinner: NgxSpinnerService
    , private snackbar: MatSnackBar
    , private dialog: MatDialogRef<StockDataComponent>
    , private new_dialog: MatDialog
    , @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.spinner.show();
    this.matchTable = new MatTableDataSource<any>(this.data.client_mismatch);
    this.matchTable.paginator = this.match_paginator;
    this.matchTable.sort = this.match_sort;
    this.spinner.hide();
    this.keys = Object.keys(this.data.client_mismatch[0]);
    this.data.client_mismatch.forEach((entry:any)=>{
      let amt_str = entry["32B"].split(' ');
      let amt = Number.parseFloat(amt_str.pop())
      this.aggregate_buy = this.aggregate_sell + amt;


      amt_str = entry["32B"].split(' ');
      amt = Number.parseFloat(amt_str.pop())
      this.aggregate_sell = this.aggregate_sell + amt;
    });
  }

  onNoClick() {
    this.dialog.close();
  }

  forceMatch(){
    this.data.self_data.match_status = 1;
    this.api.socgen_data().update(this.data.self_data.id,this.data.self_data).then(data=>{
      this.snackbar.open("Successfully force matched the data","Dismiss",{
        duration: 2000
      });
      this.dialog.close('update');
    }).catch(err=>{
      this.snackbar.open("Cannot force match the data","Dismiss",{
        duration: 2000
      });
    });
  }

  selectRow(row: any): void {
    this.spinner.show();
    let dialogRef = this.new_dialog.open(StockDataComponent, {
      width: 'auto',
      height: '90%',
      data: {
        self_data: this.data.self_data,
        client_match: [row],
        client_mismatch: [row]
      }
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result=='update'){
        this.ngOnInit();
      }
    });
    this.spinner.hide();
  }

  applyFilter(filterValue: string) {
    this.matchTable.filter = filterValue.trim().toLowerCase();
  }
}
