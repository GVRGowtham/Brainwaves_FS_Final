import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiClientService } from '@app/shared/api-client.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { StockDataComponent } from '@app/stock-data/stock-data.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  
  displayedColumns: string[] = ['col_socgen_20', 'col_client_20', 'party_a', 'party_b', 'contract_date', 'match_status', 'relationship'];
  ruleForm: FormGroup;
  oneToOneMatch:any[]=[];
  clientMatch:any[]=[];
  clientMisMatch:any[]=[];
  filteredOneToOneMatch:any[]=[];
  oneToOneMatchTable = new MatTableDataSource<any>();
  operators = ["less_than", "less_than_eq"]
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiClientService
    , private spinner: NgxSpinnerService
    , private dialog: MatDialog) {
    this.ruleForm = new FormGroup({
      'ruleCurrency': new FormControl('', {
      }),
      'ruleOperator': new FormControl('', {
      }),
      'ruleValue': new FormControl('', {
      })
    });
  }

  ngOnInit() {
    debugger;
    this.spinner.show();
    this.api.socgen_data().find({
      query: {
        $oneMatch: {
          value: "true"
        }
      }
    }).then((data: any) => {
      this.oneToOneMatch = data.data;
      this.clientMatch = data.match;
      this.clientMisMatch = data.mismatch;
      this.filteredOneToOneMatch = this.oneToOneMatch;
      this.oneToOneMatchTable = new MatTableDataSource<any>(this.filteredOneToOneMatch);
      this.oneToOneMatchTable.paginator = this.paginator;
      this.oneToOneMatchTable.sort = this.sort;
      this.oneToOneMatchTable.paginator = this.paginator;
      this.oneToOneMatchTable.sort = this.sort;
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  rules(){
    for(let i=0;i<this.oneToOneMatch.length;i++){
      let soc_curr = this.oneToOneMatch[i]["32B"].split(" ")[0];
      let soc_value = Number.parseFloat(this.oneToOneMatch[i]["32B"].split(" ").pop());
      if(soc_curr!=this.ruleForm.get("ruleCurrency").value){continue;}
      for(let j=0;j<this.clientMisMatch[this.oneToOneMatch[i].id].length;j++){
        let client_curr = this.clientMisMatch[this.oneToOneMatch[i].id][j]["33B"].split(" ")[0];
        let client_value = Number.parseFloat(this.clientMisMatch[this.oneToOneMatch[i].id][j]["33B"].split(" ").pop());
        debugger;
        if(soc_curr!=client_curr){continue;}
        if(this.ruleForm.get("ruleOperator").value=="less_than"){
          if(Math.abs(soc_value-client_value)< Number.parseFloat(this.ruleForm.get("ruleValue").value)){
            this.oneToOneMatch[i].match_status=1;
            if(this.clientMatch[this.oneToOneMatch[i].id]){
              this.clientMatch[this.oneToOneMatch[i].id].push(this.clientMisMatch[this.oneToOneMatch[i].id][j]);
            }else{
              this.clientMatch[this.oneToOneMatch[i].id]=[this.clientMisMatch[this.oneToOneMatch[i].id][j]];
            }
            continue;
          }
        }else if(this.ruleForm.get("ruleOperator").value=="less_than_eq"){
          if(Math.abs(soc_value-client_value)<= Number.parseFloat(this.ruleForm.get("ruleValue").value)){
            this.oneToOneMatch[i].match_status=1;
            if(this.clientMatch[this.oneToOneMatch[i].id]){
              this.clientMatch[this.oneToOneMatch[i].id].push(this.clientMisMatch[this.oneToOneMatch[i].id][j]);
            }else{
              this.clientMatch[this.oneToOneMatch[i].id]=[this.clientMisMatch[this.oneToOneMatch[i].id][j]];
            }
            continue;
          }
        }
      }
    }
    this.filteredOneToOneMatch = this.oneToOneMatch;
    this.oneToOneMatchTable = new MatTableDataSource<any>(this.filteredOneToOneMatch);
    this.oneToOneMatchTable.paginator = this.paginator;
    this.oneToOneMatchTable.sort = this.sort;
    this.oneToOneMatchTable.paginator = this.paginator;
    this.oneToOneMatchTable.sort = this.sort;
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
}
