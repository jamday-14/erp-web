import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MaintenanceService } from '../services/maintenance.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  private menuItems: MenuItem[];
  currentIndex = 0;
  records: any;
  items: any = [];
  loading = false;

  constructor(private maintenanceService: MaintenanceService) { }

  ngOnInit() {

    this.menuItems = [
      { label: 'New', icon: 'pi pi-file'},
      { label: 'Refresh', icon: 'pi pi-refresh'}
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


}
