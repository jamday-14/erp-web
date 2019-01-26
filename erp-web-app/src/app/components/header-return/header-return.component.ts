import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import _ from "lodash";

@Component({
  selector: 'app-header-return',
  templateUrl: './header-return.component.html',
  styleUrls: ['./header-return.component.css']
})
export class HeaderReturnComponent implements OnInit {

  @Input() transactionType: string;
  @Input() customers: Array<any>;
  @Input() warehouses: Array<any>;
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
      remarks: [''],
      warehouseId: [null, Validators.required]
    });
  }

  updateForm(headerResponse: any) {
    this.form.patchValue({
      date: new Date(this.common.toLocaleDate(headerResponse.date)),
      customerId: headerResponse.customerId,
      systemNo: headerResponse.systemNo,
      refNo: headerResponse.refNo,
      remarks: headerResponse.remarks,
      warehouseId: headerResponse.warehouseId
    });
  }

  customerChanged(event) {
    if (event.value) {
      this.onCustomerChanged.emit(event.value);
    }
  }
}
