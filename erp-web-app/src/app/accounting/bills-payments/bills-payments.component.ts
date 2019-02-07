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
  selector: 'app-bills-payments',
  templateUrl: './bills-payments.component.html',
  styleUrls: ['./bills-payments.component.css']
})
export class BillsPaymentsComponent implements OnInit {

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
    this.app.title = "Bills Payments";
    this.initializeMenu();
    this.initializeColumns();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/accounting/bills-payment', 0]);
        }
      },
      {
        label: 'Refresh', icon: 'pi pi-refresh', command: () => {
          
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
}
