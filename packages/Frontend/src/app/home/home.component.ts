import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiClientService } from '@app/shared/api-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { MatTableDataSource, MatPaginator, MatSort, MatSortable, MatDialogRef, MatDialog, MatTab } from '@angular/material';
import { StockDataComponent } from '@app/stock-data/stock-data.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  chart: any;
  displayedColumns: string[] = ['col_socgen_20', 'col_client_20', 'party_a', 'party_b', 'contract_date', 'match_status', 'relationship'];
  searchForm: FormGroup;
  oneToOneMatch: any[] = [];
  filteredOneToOneMatch: any = [];
  clientMatch: any;
  clientMisMatch: any;
  categories = ['Date', 'Currency', 'Confirmation_status'];
  sub_categories = {
    Date: ['Trade_Date', 'Settlement_Date'],
    Currency: ['Buy_ccy', 'Sell_ccy', 'Buy_amount', 'Sell_amount', 'Rate'],
    Confirmation_status: ['Status', 'Counterparty_Bic', 'Reference']
  };
  searchKeys = {
    Buy_ccy: "32B",
    Sell_ccy: "33B",
    Buy_amount: "32B",
    Sell_amount: "33B",
    Rate: "36",
    Counterparty_Bic: "82A",
    Reference:"20",
    Trade_Date:"30T",
    Settlement_Date:"30V"
  };
  searchDate:any;
  oneToOneMatchTable = new MatTableDataSource<any>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiClientService
    , private spinner: NgxSpinnerService
    , private dialog: MatDialog) {
    this.searchForm = new FormGroup({
      'searchText': new FormControl('', {
      }),
      'searchCategories': new FormControl('', {
      }),
      'searchSubCategories': new FormControl('', {
      }),
      'searchDropdown': new FormControl('', {
      }),
      'searchDate': new FormControl('', {
      })
    });
    this.searchForm.setValue({
      searchText: "",
      searchCategories: "Date",
      searchSubCategories: "Trade_Date",
      searchDropdown: null,
      searchDate:null
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.api.socgen_data().find({
      query: {
        $oneMatch: {
          value: "true"
        }
      }
    }).then((data: any) => {
      this.oneToOneMatch = data.data;
      this.filteredOneToOneMatch = this.oneToOneMatch;
      this.clientMatch = data.match;
      this.clientMisMatch = data.mismatch;
      this.oneToOneMatchTable = new MatTableDataSource<any>(this.filteredOneToOneMatch);
      this.oneToOneMatchTable.paginator = this.paginator;
      this.oneToOneMatchTable.sort = this.sort;
      this.oneToOneMatchTable.paginator = this.paginator;
      this.oneToOneMatchTable.sort = this.sort;
      let matched_count=0;
      let mismatched_count=0;
      let unmatched_count=0;
      this.oneToOneMatch.forEach((entry:any)=>{
        if(entry.match_status==1){
          matched_count++;
        }else if(entry.match_status==2){
          mismatched_count++;
        }else{
          unmatched_count++;
        }
      });
      let feed_in_data = [matched_count,mismatched_count,unmatched_count];
      this.chart = new Chart("canvas", {
        type: 'doughnut',
        data: {
          labels: ['Match','Mismatch','Unmatched'],
          datasets: [
            {
              data: feed_in_data,
              backgroundColor:["lightred","lightblue","lightgreen"]
            }
          ]
        }
    });
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }


  selectRow(row: any): void {
    this.spinner.show();
    let dialogRef = this.dialog.open(StockDataComponent, {
      width: 'auto',
      height: '90%',
      data: {
        self_data: row,
        client_match: this.clientMatch[row.id],
        client_mismatch: this.clientMisMatch[row.id]
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
    this.oneToOneMatchTable.filter = filterValue.trim().toLowerCase();
  }

  updateCategory() {
    this.searchForm.patchValue({
      searchSubCategories: this.sub_categories[this.searchForm.get("searchCategories").value][0]
    });
  }

  search() {
    this.spinner.show();
    if (this.searchForm.get('searchSubCategories').value == "Buy_ccy" || this.searchForm.get('searchSubCategories').value == "Sell_ccy" || this.searchForm.get('searchSubCategories').value == "Buy_amount" || this.searchForm.get('searchSubCategories').value == "Sell_amount" || this.searchForm.get('searchSubCategories').value == "Rate" || this.searchForm.get('searchSubCategories').value == "Counterparty_Bic" || this.searchForm.get('searchSubCategories').value == "Reference") {
      this.filteredOneToOneMatch = this.oneToOneMatch.filter(entry => {
        return entry[this.searchKeys[this.searchForm.get('searchSubCategories').value]].indexOf(this.searchForm.get('searchText').value) != -1;
      });
    }
    if(this.searchForm.get('searchSubCategories').value == "Status"){
      this.filteredOneToOneMatch = this.oneToOneMatch.filter(entry=>{
        return entry.match_status==this.searchForm.get('searchDropdown').value
      })
    }
    if(this.searchForm.get('searchCategories').value == "Date"){
      console.log(moment(this.searchForm.get('searchDate').value).startOf('day'));
      console.log("-------------");
      this.filteredOneToOneMatch = this.oneToOneMatch.filter(entry => {
        console.log(moment(entry[this.searchKeys[this.searchForm.get('searchSubCategories').value]]));
        return moment(entry[this.searchKeys[this.searchForm.get('searchSubCategories').value]]).startOf('day').isSame(moment(this.searchForm.get('searchDate').value).add(1,'days').startOf('day'), 'day');
      });
    }
    this.oneToOneMatchTable = new MatTableDataSource<any>(this.filteredOneToOneMatch);
    this.oneToOneMatchTable.paginator = this.paginator;
    this.oneToOneMatchTable.sort = this.sort;
    this.spinner.hide();
  }

}

export interface Data {
  id: number;
  col_socgen_20: string;
  col_client_20: string;
  match_status: number;
}