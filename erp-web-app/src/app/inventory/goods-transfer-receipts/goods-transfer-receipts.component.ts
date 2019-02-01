import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { forkJoin } from 'rxjs';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { CommonService } from 'src/app/services/common.service';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-goods-transfer-receipts',
  templateUrl: './goods-transfer-receipts.component.html',
  styleUrls: ['./goods-transfer-receipts.component.css']
})
export class GoodsTransferReceiptsComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;
  receipts: Array<any>;
  warehouses: Array<any>;
  cols: any[];
  enableFilter: boolean;

  constructor(
    private router: Router,
    private app: AppComponent,
    private inventoryService: InventoryService,
    private common: CommonService,
    private maintenanceService: MaintenanceService
  ) {
    this.menuItems = [];
    this.receipts = [];
    this.warehouses = [];
    this.enableFilter = false;
  }

  ngOnInit() {
    this.app.title = "Item Entries";
    this.initializeMenu();
    this.initializeColumns();
    this.getData();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/inventory/goods-transfer-receipt', 0]);
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
      { field: 'warehouse', header: 'Warehouse' },
      { field: 'refNo', header: 'Reference No' }
    ];
  }

  getData(): any {
    this.loading = true;
    this.receipts = [];

    var warehousesRequest = this.maintenanceService.queryWarehouses();
    var entriesRequest = this.inventoryService.queryGoodsTransferReceipts();

    forkJoin([warehousesRequest, entriesRequest])
      .subscribe((response) => {

        this.warehouses = response[0];
        let entriesResponse = response[1];

        _.forEach(entriesResponse, (record => {

          var warehouse = this.findWarehouse(record.warehouseId);

          this.receipts.push({
            id: record.id, date: new Date(this.common.toLocaleDate(record.date)), 
            warehouse: warehouse != null ? warehouse.name : '', systemNo: record.systemNo, refNo: record.refNo
          });
        }))

        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
  }

  findWarehouse(warehouseId: any): any {
    return this.warehouses.find(x => x.id == warehouseId);
  }
}
