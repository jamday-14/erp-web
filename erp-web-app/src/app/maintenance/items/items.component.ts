import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MaintenanceService } from '../../services/maintenance.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  menuItems: MenuItem[];
  records: any;
  item: any;
  selectedItem: any;
  items: any[];
  cols: any[];
  loading = false;
  displayDialog = false;

  constructor(
    private maintenanceService: MaintenanceService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.initializeMenu();

    this.initializeTableColumns();

    this.getData();
  }

  private initializeTableColumns() {
    this.cols = [
      { field: 'itemCode', header: 'Item Code' },
      { field: 'description', header: 'Description' },
      { field: 'unitPrice', header: 'Unit Price' },
      { field: 'costPrice', header: 'Cost Price' },
      { field: 'quantity', header: 'Quantity' }
    ];
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.displayDialog = true;
          this.item = {};
        }
      },
      {
        label: 'Refresh', icon: 'pi pi-refresh', command: () => {
          this.getData();
        }
      }
    ];
  }

  getData(): any {
    this.loading = true;
    this.maintenanceService.queryItems().subscribe((resp) => {
      this.records = resp;
      this.items = this.records;
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }


  onRowSelect(event) {
    this.item = this.commonService.cloneItem(event.data);
  }

}
