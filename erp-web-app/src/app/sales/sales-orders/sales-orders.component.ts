import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SalesService } from 'src/app/services/sales.service';
import { forkJoin } from 'rxjs';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sales-orders',
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.css']
})
export class SalesOrdersComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;
  orders: Array<any>;
  customers: Array<any>;
  cols: any[];
  enableFilter: boolean;

  constructor(
    private router: Router,
    private app: AppComponent,
    private salesService: SalesService,
    private common: CommonService,
    private maintenanceService: MaintenanceService
  ) {
    this.orders = [];
    this.customers = [];
    this.enableFilter = false;
  }

  ngOnInit() {
    this.app.title = "Sales Orders";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/sales/sales-order', 0]);
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
      { field: 'closed', header: 'Closed' }
    ];
  }

  getData(): any {
    this.loading = true;
    this.orders = [];

    var customersRequest = this.maintenanceService.queryCustomers();
    var salesOrdersRequest = this.salesService.querySalesOrders();

    forkJoin([customersRequest, salesOrdersRequest])
      .subscribe((response) => {

        this.customers = response[0];
        let salesOrdersResponse = response[1];

        _.forEach(salesOrdersResponse, (record => {

          var customer = this.findCustomer(record.customerId);

          this.orders.push({
            id: record.id, date: new Date(this.common.toLocaleDate(record.date)), 
            customer: customer != null ? customer.name : '', systemNo: record.systemNo, refNo: record.refNo, closed: record.closed
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
}
