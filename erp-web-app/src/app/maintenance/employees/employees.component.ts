import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MaintenanceService } from '../../services/maintenance.service';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  form: FormGroup;
  newItem: boolean;
  
  menuItems: MenuItem[];
  records: any;
  item: any;
  items: any[];
  cols: any[];
  
  loading = false;
  displayDialog = false;

  constructor(
    private maintenanceService: MaintenanceService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.initializeMenu();

    this.initializeTableColumns();

    this.getData();
  }

  private initializeForm(item: any): any {
    this.newItem = item == null ? true : false;

    this.form = this.formBuilder.group({
      firstName: [item != null ? item.firstName : '', Validators.required],
      middleName: [item != null ? item.middleName : ''],
      lastName: [item != null ? item.lastName : '', Validators.required],
      telNo: [item != null ? item.telNo : ''],
      address: [item != null ? item.address : '', Validators.required],
      bday: [item != null ? item.bday : null],
      philHealthNo: [item != null ? item.philHealthNo : ''],
      sssno: [item != null ? item.sssno : ''],
      tinno: [item != null ? item.tinno : ''],
      pagibigNo: [item != null ? item.pagibigNo : ''],
      isRegular: [item != null ? item.isRegular : false],
      isContract: [item != null ? item.isContract : false],
      isExtendContract: [item != null ? item.isExtendContract : false],
      isSalesPerson: [item != null ? item.isSalesPerson : false]
    });
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
          this.toggleDialog(true);
          this.initializeForm(null);
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

  get f() { return this.form.controls; }

  onRowSelect(event) {
    this.item = this.commonService.cloneItem(event.data);
    this.initializeForm(this.item);
    this.toggleDialog(true);
  }

  toggleDialog(display: boolean) {
    this.displayDialog = display;
  }

  createItem() {
    if (!this.form.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please complete all required fields.' });
      return;
    }

    if (!this.newItem) {
      this.toggleDialog(false);
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Updating of record is not yet implemented.' });
      return;
    }
    this.maintenanceService.addEmployee({
      firstName: this.f.firstName.value,
      middleName: this.f.middleName.value,
      lastName: this.f.lastName.value,
      telNo: this.f.telNo.value,
      address: this.f.address.value,
      bday: this.f.bday.value,
      philHealthNo: this.f.philHealthNo.value,
      sssno: this.f.sssno.value,
      tinno: this.f.tinno.value,
      pagibigNo: this.f.pagibigNo.value,
      isRegular: this.f.isRegular.value,
      isContract: this.f.isContract.value,
      isExtendContract: this.f.isExtendContract.value,
      isSalesPerson: this.f.isSalesPerson.value
    }).subscribe((resp) => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Record has been created.' });
      this.toggleDialog(false);
      this.getData();
    }, (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Failed creating a record.' });
    });
  }
  
}
