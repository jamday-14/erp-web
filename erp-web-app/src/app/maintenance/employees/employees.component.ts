import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MaintenanceService } from '../../services/maintenance.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

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
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'address', header: 'Address' },
      { field: 'telNo', header: 'Contact No.' },
      { field: 'sssno', header: 'SSS No' },
      { field: 'philHealthNo', header: 'Philhealth No.' },
      { field: 'pagibigNo', header: 'Pagibig No.' },
      { field: 'tinno', header: 'Tin No.' },
      { field: 'isSalesPerson', header: 'Is Sales Person' }
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
    this.maintenanceService.queryEmployees().subscribe((resp) => {
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
