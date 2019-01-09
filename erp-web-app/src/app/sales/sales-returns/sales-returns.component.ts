import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SalesService } from 'src/app/services/sales.service';
import { forkJoin } from 'rxjs';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";

@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html',
  styleUrls: ['./sales-returns.component.css']
})
export class SalesReturnsComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;
  orders: Array<any>;
  customers: Array<any>;
  warehouses: Array<any>;
  cols: any[];
  enableFilter: boolean;

  constructor(
    private router: Router,
    private app: AppComponent,
    private salesService: SalesService,
    private maintenanceService: MaintenanceService
  ) {
    this.orders = [];
    this.customers = [];
    this.warehouses = [];
    this.enableFilter = false;
  }

  ngOnInit() {
    this.app.title = "Sales Returns";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/sales-return']);
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
      { field: 'customer', header: 'Customer' },
      { field: 'refNo', header: 'Reference No' },
      { field: 'warehouse', header: 'Warehouse' },
      { field: 'closed', header: 'Closed' }
    ];
  }

  getData(): any {
    this.loading = true;
    this.orders = [];

    var customersRequest = this.maintenanceService.queryCustomers();
    var salesOrdersRequest = this.salesService.querySalesReturns();
    var warehousesRequest = this.maintenanceService.queryWarehouses();

    forkJoin([customersRequest, salesOrdersRequest, warehousesRequest])
      .subscribe((response) => {

        this.customers = response[0];
        let salesOrdersResponse = response[1];
        this.warehouses = response[2];

        _.forEach(salesOrdersResponse, (record => {

          var customer = this.findCustomer(record.customerId);
          var warehouse = this.findWarehouse(record.warehouseId);

          this.orders.push({
            id: record.id, date: record.date, customer: customer != null ? customer.name : '', systemNo: record.systemNo,
            refNo: record.refNo, warehouse: warehouse != null ? warehouse.name : '', closed: record.closed
          });
        }))

        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
  }
  findCustomer(customerId: any): any {
    return this.customers.find(x => x.id == customerId);
  }
  findWarehouse(id: any): any {
    return this.warehouses.find(x => x.id == id);
  }
}
