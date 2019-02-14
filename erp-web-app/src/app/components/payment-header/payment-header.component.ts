import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-payment-header',
  templateUrl: './payment-header.component.html',
  styleUrls: ['./payment-header.component.css']
})
export class PaymentHeaderComponent implements OnInit {

  @Input() transactionType: string;
  @Input() people: Array<any>;
  @Input() modeOfPayments: Array<any>;
  @Input() banks: Array<any>;
  @Input() newItem: boolean;
  @Output() submit = new EventEmitter<Array<any>>();
  @Output() resetOrderDetails = new EventEmitter<Array<any>>();
  @Output() onPeopleChanged = new EventEmitter<Array<any>>();

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
          ////this.resetOrderDetails.emit(null);
        }
      })
    }
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      date: [new Date(), Validators.required],
      refNo: [''],
      systemNo: [''],
      mopid: [null, Validators.required],
      amount: [0, Validators.required],
      bankId: [null],
      checkDate: [null],
      checkRefNo: ['']
    });

    if (this.isPeopleACustomer()) {
      this.form.addControl("customerId", new FormControl(null, Validators.required))
    } else {
      this.form.addControl("vendorId", new FormControl(null, Validators.required))
    }
  }

  updateForm(headerResponse: any): any {
    throw new Error("Method not implemented.");
  }

  isPeopleACustomer(): boolean {
    return _.indexOf(["SIP"], this.transactionType) != -1;
  }

  peopleChanged(event) {
    if (event.value) {
      this.onPeopleChanged.emit(event.value);
    }
  }
}
