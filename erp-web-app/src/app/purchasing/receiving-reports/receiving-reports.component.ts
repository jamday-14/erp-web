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
  selector: 'app-receiving-reports',
  templateUrl: './receiving-reports.component.html',
  styleUrls: ['./receiving-reports.component.css']
})
export class ReceivingReportsComponent implements OnInit {

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
    this.app.title = "Receiving Reports";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/purchasing/receiving-report', 0]);
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
    var purchasingOrdersRequest = this.purchasingService.queryReceivingReports();

    forkJoin([vendorsRequest, purchasingOrdersRequest])
      .subscribe((response) => {

        this.vendors = response[0];
        let purchasingOrdersResponse = response[1];

        _.forEach(purchasingOrdersResponse, (record => {

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
