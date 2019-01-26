import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import _ from "lodash";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() transactionType: string;
  @Input() customers: Array<any>;
  @Input() terms: Array<any>;
  @Input() newItem: boolean;
  @Output() submit = new EventEmitter<Array<any>>();
  @Output() resetOrderDetails = new EventEmitter<Array<any>>();
  @Output() onCustomerChanged = new EventEmitter<Array<any>>();

  form: FormGroup;
  menuItems: MenuItem[];

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.initializeMenu();
    this.initializeForm();
  }

  get f() { return this.form.controls; }

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
          this.initializeForm();
          this.resetOrderDetails.emit(null);
        }
      })
    }
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      date: [null, Validators.required],
      refNo: [''],
      systemNo: [''],
      customerId: [null, Validators.required],
      address: [''],
      telNo: [''],
      faxNo: [''],
      contactPerson: [''],
      termId: [null]
    });

    if (_.indexOf(["SI", "DR"], this.transactionType) != -1) {
      this.form.addControl("comments", new FormControl(""))
      this.form.addControl("mopid", new FormControl(null))
    }
  }

  private findCustomer(customerId) {
    return this.customers.find(x => x.value == customerId);
  }

  updateForm(headerResponse: any) {
    this.form.patchValue({
      date: new Date(this.common.toLocaleDate(headerResponse.date)),
      customerId: headerResponse.customerId,
      systemNo: headerResponse.systemNo,
      refNo: headerResponse.refNo,
      address: headerResponse.address,
      telNo: headerResponse.telNo,
      faxNo: headerResponse.faxNo,
      contactPerson: headerResponse.contactPerson,
      termId: headerResponse.termId
    });
  }

  customerChanged(event) {
    if (event.value) {
      var control = this.f;
      let customer = this.findCustomer(event.value);

      control.address.setValue(customer.address);
      control.telNo.setValue(customer.telNo);
      control.faxNo.setValue(customer.faxNo);
      control.contactPerson.setValue(customer.contactPerson);
      control.termId.setValue(customer.termId);

      this.onCustomerChanged.emit(event.value);
    }
  }

  isCommentsVisible(): boolean {
    return _.indexOf(["SI", "DR"], this.transactionType) != -1;
  }

  isMOPVisible(): boolean {
    return _.indexOf(["SI", "DR"], this.transactionType) != -1;
  }

}
