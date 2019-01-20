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
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})
export class PurchaseOrdersComponent implements OnInit {

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
    this.app.title = "Purchase Orders";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/purchase-order', 0]);
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
      { field: 'closed', header: 'Closed' }
    ];
  }

  getData(): any {
    this.loading = true;
    this.orders = [];

    var vendorsRequest = this.maintenanceService.queryVendors();
    var purchaseOrdersRequest = this.purchasingService.queryPurchasingOrders();

    forkJoin([vendorsRequest, purchaseOrdersRequest])
      .subscribe((response) => {

        this.vendors = response[0];
        let purchaseOrdersResponse = response[1];

        _.forEach(purchaseOrdersResponse, (record => {

          var vendor = this.findVendor(record.vendorId);

          this.orders.push({
            id: record.id, date: new Date(this.common.toLocaleDate(record.date)), 
            vendor: vendor != null ? vendor.name : '', systemNo: record.systemNo, refNo: record.refNo, closed: record.closed
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
