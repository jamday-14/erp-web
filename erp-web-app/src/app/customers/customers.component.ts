import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  menuItems: MenuItem[];
  currentIndex = 0;
  records: any;
  item: any;
  selectedItem: any;
  items: any[];
  cols: any[];
  loading = false;

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit() {

    this.menuItems = [
      { label: 'New', icon: 'pi pi-file' },
      { label: 'Refresh', icon: 'pi pi-refresh' }
    ];

    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'telNo', header: 'Contact No.' }
    ];

    this.getData();
  }

  getData(): any {
    this.loading = true;
    this.maintenanceService.queryCustomers().subscribe((resp) => {
      this.records = resp;
      this.items = this.records;
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }


  onRowSelect(event) {
    this.item = this.cloneCar(event.data);
  }

  cloneCar(c: any): any {
    let item = {};
    for (let prop in c) {
      item[prop] = c[prop];
    }
    return item;
  }
}
