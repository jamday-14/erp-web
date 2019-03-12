import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Location } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { AppComponent } from 'src/app/app.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements AfterViewInit {

  @Input() newItem: boolean;
  @Output() submit = new EventEmitter<Array<any>>();

  form: FormGroup;
  menuItems: MenuItem[];
  item: any;
  id: number;
  currencies: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private common: CommonService,
    private messageService: MessageService,
    private app: AppComponent,
    private router: Router,
    private route: ActivatedRoute,
    private maintenanceService: MaintenanceService
  ) { this.currencies = []; }

  ngOnInit() {
    this.app.title = "Vendor Entry";

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
    this.initializeMenu();
    this.getReferenceData();
    this.initializeForm(null);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      //this.getReferenceData();
    });

  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Back', icon: 'pi pi-arrow-left', command: () => {
          this.location.back();
        }
      },
      {
        label: 'Save', icon: 'pi pi-save', command: () => {
          this.submit.emit();
        }
      },
    ];

    if (this.newItem) {
      this.menuItems.push({
        label: 'Reset', icon: 'pi pi-circle-off', command: () => {
          this.initializeForm(null);
        }
      })
    }
  }

  getReferenceData(): any {
    this.maintenanceService.queryCurrencies().subscribe((resp) => {
      let arr: any;
      arr = resp;
      arr.forEach(element => {
        this.currencies.push({ value: element.id, label: element.name })
      });
    }, () => { });
  }

  initializeForm(item: any): any {
    this.newItem = item == null ? true : false;

    this.form = this.formBuilder.group({
      name: [item != null ? item.name : '', Validators.required],
      address: [item != null ? item.address : ''],
      telNo: [item != null ? item.telNo : ''],
      faxNo: [item != null ? item.faxNo : ''],
      contactPerson: [item != null ? item.contactPerson : ''],
      currencyId: [item != null ? item.currencyId : null]
    });
  }

  get f() { return this.form.controls; }

  createItem() {
    if (!this.form.valid) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Please complete all required fields.' });
      return;
    }

    if (!this.newItem) {
      this.messageService.add({ severity: 'warn', summary: 'Warning Message', detail: 'Updating of record is not yet implemented.' });
      return;
    }
    this.maintenanceService.addVendor({
      name: this.f.name.value,
      address: this.f.address.value,
      telNo: this.f.telNo.value,
      faxNo: this.f.faxNo.value,
      contactPerson: this.f.contactPerson.value,
      currencyId: this.f.currencyId.value
    }).subscribe((resp) => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Record has been created.' });
    }, (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Failed creating a record.' });
    });
  }

}
