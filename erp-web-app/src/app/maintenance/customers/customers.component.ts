import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MaintenanceService } from '../../services/maintenance.service';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  form: FormGroup;
  newItem: boolean;

  menuItems: MenuItem[];

  records: any;
  item: any;
  items: any[];
  cols: any[];

  loading = false;
  displayDialog = false;

  customerTypes: Array<any>;
  salesPersons: Array<any>;
  terms: Array<any>;

  constructor(
    private maintenanceService: MaintenanceService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private messageService: MessageService) {
    this.customerTypes = [];
    this.salesPersons = [];
    this.terms = [];
  }

  ngOnInit() {

    this.initializeMenu();

    this.initializeTableColumns();

    this.getReferenceData();

    this.getData();
  }

  initializeForm(item: any): any {
    this.newItem = item == null ? true : false;

    this.form = this.formBuilder.group({
      name: [item != null ? item.name : '', Validators.required],
      code: [item != null ? item.code : ''],
      address: [item != null ? item.address : ''],
      telNo: [item != null ? item.telNo : ''],
      faxNo: [item != null ? item.faxNo : ''],
      contactPerson: [item != null ? item.contactPerson : ''],
      tinno: [item != null ? item.tinno : ''],
      customerTypeId: [item != null ? item.customerTypeId : null],
      registeredName: [item != null ? item.registeredName : ''],
      registeredOwner: [item != null ? item.registeredOwner : ''],
      businessStyle: [item != null ? item.businessStyle : ''],
      termId: [item != null ? item.termId : null],
      salesPersonId: [item != null ? item.salesPersonId : null]
    });
  }

  private initializeTableColumns() {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'telNo', header: 'Contact No.' },
      { field: 'contactPerson', header: 'Contact Person' },
      { field: 'registeredName', header: 'Registered Name.' },
      { field: 'registeredOwner', header: 'Registered Owner' },
      { field: 'tinno', header: 'Tin No.' },
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

  getReferenceData(): any {
    this.maintenanceService.queryCustomerTypes().subscribe((resp) => {
      let arr: any;
      arr = resp;
      arr.forEach(element => {
        this.customerTypes.push({ value: element.id, label: element.name })
      });
    }, (err) => { });
    this.maintenanceService.queryTerms().subscribe((resp) => {
      let arr: any;
      arr = resp;
      arr.forEach(element => {
        this.terms.push({ value: element.id, label: element.name })
      });
    }, (err) => { });
    this.maintenanceService.queryEmployees()
      //.pipe(filter(x=> x.isSalesPerson == true))
      .subscribe((resp) => {
        let arr: any;
        arr = resp;
        arr.forEach(element => {
          this.salesPersons.push({ value: element.id, label: element.firstName + " " + element.lastName })
        });
      }, (err) => { });
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
    this.item = this.commonService.cloneItem(event.data);
    this.initializeForm(this.item);
    this.toggleDialog(true);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

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
    this.maintenanceService.addCustomer({
      name: this.f.name.value,
      code: this.f.code.value,
      address: this.f.address.value,
      telNo: this.f.telNo.value,
      faxNo: this.f.faxNo.value,
      contactPerson: this.f.contactPerson.value,
      tinno: this.f.tinno.value,
      customerTypeId: this.f.customerTypeId.value,
      registeredName: this.f.registeredName.value,
      registeredOwner: this.f.registeredOwner.value,
      businessStyle: this.f.businessStyle.value,
      termId: this.f.termId.value,
      salesPersonId: this.f.salesPersonId.value
    }).subscribe((resp) => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Record has been created.' });
      this.toggleDialog(false);
      this.getData();
    }, (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Failed creating a record.' });
    });
  }

  toggleDialog(display: boolean) {
    this.displayDialog = display;
  }
}
