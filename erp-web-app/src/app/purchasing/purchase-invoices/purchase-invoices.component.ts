import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { forkJoin } from 'rxjs';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { CommonService } from 'src/app/services/common.service';
import { PurchasingService } from 'src/app/services/purchasing.service';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.css']
})
export class PurchaseInvoicesComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;
  orders: Array<any>;
  vendors: Array<any>;
  cols: any[];
  enableFilter: boolean;

  constructor(
    private router: Router,
    private app: AppComponent,
    private purchasingService: PurchasingService,
    private common: CommonService,
    private maintenanceService: MaintenanceService
  ) {
    this.orders = [];
    this.vendors = [];
    this.enableFilter = false;
  }

  ngOnInit() {
    this.app.title = "Purchase Invoices";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/purchasing/purchase-invoice', 0]);
        }
      },
      {
        label: 'Refresh', icon: 'pi pi-refresh', command: () => {
          this.getData();
        }
      },
      {
        label: 'Filter', icon: 'pi pi-filter', command: () => {
          this.enableFilter = !this.enableFilter;
        }
      }
    ];
  }

  initializeColumns(): any {
    this.cols = [
      { field: 'systemNo', header: 'System No.' },
      { field: 'date', header: 'Date' },
      { field: 'vendor', header: 'Vendor' },
      { field: 'refNo', header: 'Reference No' },
      { field: 'amount', header: 'Amount' },
      { field: 'amountPaid', header: 'Amount Paid' },
      { field: 'amountDue', header: 'Amount Due' },
      { field: 'closed', header: 'Closed' }
    ];
  }

  getData(): any {
    this.loading = true;
    this.orders = [];

    var vendorsRequest = this.maintenanceService.queryVendors();
    var invoiceRequest = this.purchasingService.queryPurchasingInvoices();

    forkJoin([vendorsRequest, invoiceRequest])
      .subscribe((response) => {

        this.vendors = response[0];
        let purchaseOrdersResponse = response[1];

        _.forEach(purchaseOrdersResponse, (record => {

          var vendor = this.findVendor(record.vendorId);

          this.orders.push({
            id: record.id, date: new Date(this.common.toLocaleDate(record.date)), 
            vendor: vendor != null ? vendor.name : '', systemNo: record.systemNo, refNo: record.refNo,
            amount: record.amount, amountPaid: record.amountPaid, amountDue: record.amountDue, closed: record.closed
          });
        }))

        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
  }
  findVendor(vendorId: any): any {
    return this.vendors.find(x => x.id == vendorId);
  }

}
