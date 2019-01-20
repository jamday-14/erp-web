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
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html',
  styleUrls: ['./purchase-returns.component.css']
})
export class PurchaseReturnsComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;
  orders: Array<any>;
  vendors: Array<any>;
  warehouses: Array<any>;
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
    this.warehouses = [];
    this.enableFilter = false;
  }

  ngOnInit() {
    this.app.title = "Purchase Returns";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/purchase-return', 0]);
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
      { field: 'warehouse', header: 'Warehouse' },
      { field: 'closed', header: 'Closed' }
    ];
  }

  getData(): any {
    this.loading = true;
    this.orders = [];

    var vendorsRequest = this.maintenanceService.queryVendors();
    var returnsRequest = this.purchasingService.queryPurchasingReturns();
    var warehousesRequest = this.maintenanceService.queryWarehouses();

    forkJoin([vendorsRequest, returnsRequest, warehousesRequest])
      .subscribe((response) => {

        this.vendors = response[0];
        let salesOrdersResponse = response[1];
        this.warehouses = response[2];

        _.forEach(salesOrdersResponse, (record => {

          var vendor = this.findVendor(record.vendorId);
          var warehouse = this.findWarehouse(record.warehouseId);

          this.orders.push({
            id: record.id, date:new Date(this.common.toLocaleDate(record.date)), 
            vendor: vendor != null ? vendor.name : '', systemNo: record.systemNo,
            refNo: record.refNo, warehouse: warehouse != null ? warehouse.name : '', closed: record.closed
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
  findWarehouse(id: any): any {
    return this.warehouses.find(x => x.id == id);
  }

}
