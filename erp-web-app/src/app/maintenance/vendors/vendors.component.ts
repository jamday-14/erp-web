import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MaintenanceService } from '../../services/maintenance.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {

  form: FormGroup;
  newItem: boolean;

  menuItems: MenuItem[];
  vendors: any;
  cols: any[];

  loading = false;

  constructor(
    private maintenanceService: MaintenanceService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initializeMenu();

    this.initializeTableColumns();

    this.getData();
  }

  private initializeTableColumns() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'telNo', header: 'Contact No.' },
      { field: 'contactPerson', header: 'Contact Person' }
    ];
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/maintenance/vendor', 0]);
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
    this.maintenanceService.queryVendors().subscribe((resp) => {
      this.vendors = resp;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }
}
