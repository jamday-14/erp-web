import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AccountingService } from 'src/app/services/accounting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal-vouchers',
  templateUrl: './journal-vouchers.component.html',
  styleUrls: ['./journal-vouchers.component.css']
})
export class JournalVouchersComponent implements OnInit {

  vouchers: Array<any>;
  loading: boolean;

  constructor(
    private app: AppComponent,
    private router: Router,
    private accountingService: AccountingService) { }

  ngOnInit() {

    this.app.title = "Journal Vouchers";
  }

  navigate() {
    this.router.navigate(['/accounting/journal-voucher', 0]);
  }

  refresh(){
    this.getData();
  }

  getData(): any {
    this.loading = true;
    this.vouchers = [];

    // var vouchersRequest = this.accountingService.queryVouchers();

    // vouchersRequest
    //   .subscribe((response) => {

    //     _.forEach(response, (record => {

    //       this.vouchers.push({
    //         id: record.id, date: new Date(this.common.toLocaleDate(record.date)),
    //         systemNo: record.systemNo, refNo: record.refNo, description: record.description
    //       });
    //     }))

    //     this.loading = false;
    //   }, () => {
    //     this.loading = false;
    //   });
  }

}
