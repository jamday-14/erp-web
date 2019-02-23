import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagingService } from 'src/app/services/messaging.service';
import { CommonService } from 'src/app/services/common.service';
import { AppComponent } from 'src/app/app.component';
import { forkJoin } from 'rxjs';
import { AccountingService } from 'src/app/services/accounting.service';
import _ from "lodash";
import { PurchasingService } from 'src/app/services/purchasing.service';
import { VoucherHeaderComponent } from '../components/voucher-header/voucher-header.component';
import { VoucherDetailComponent } from '../components/voucher-detail/voucher-detail.component';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css']
})
export class JournalVoucherComponent implements AfterViewInit {

  @ViewChild(VoucherHeaderComponent)
  private headerComponent: VoucherHeaderComponent;

  @ViewChild(VoucherDetailComponent)
  private detailComponent: VoucherDetailComponent;

  id: number;
  transactionType: string;

  newItem: boolean;
  loading: boolean;

  subsidiaries: Array<any>;
  accounts: Array<any>;
  details: Array<any>;
  vouchers: Array<any>;

  constructor(
    private maintenanceService: MaintenanceService,
    private accountingService: AccountingService,
    private purchasingService: PurchasingService,
    private router: Router,
    private messaging: MessagingService,
    private common: CommonService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.subsidiaries = [];
    this.accounts = [];
    this.details = [];
    this.vouchers = [];
  }

  ngOnInit() {
    this.app.title = "Journal Voucher Entry";
    this.transactionType = "JV";

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getReferenceData();
    });

  }

  getReferenceData(): any {

  }

  onAddRow(details: Array<any>) {
    this.details = details;
    this.details.unshift({});
  }

}
