import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
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
  @Input() people: Array<any>;
  @Input() terms: Array<any>;
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
          this.resetOrderDetails.emit(null);
        }
      })
    }
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      date: [new Date(), Validators.required],
      refNo: [''],
      systemNo: [''],
      address: [''],
      telNo: [''],
      faxNo: [''],
      contactPerson: [''],
      termId: [null]
    });

    if (this.isPeopleACustomer()) {
      this.form.addControl("customerId", new FormControl(null, Validators.required))
    } else {
      this.form.addControl("vendorId", new FormControl(null, Validators.required))
    }

    if (this.isMOPVisible) {
      this.form.addControl("mopid", new FormControl(null))
    }

    if (this.isCommentsVisible) {
      this.form.addControl("comments", new FormControl(""))
    }
  }

  private findPeople(id) {
    return this.people.find(x => x.value == id);
  }

  updateForm(headerResponse: any) {
    this.form.patchValue({
      date: new Date(this.common.toLocaleDate(headerResponse.date)),
      systemNo: headerResponse.systemNo,
      refNo: headerResponse.refNo,
      address: headerResponse.address,
      telNo: headerResponse.telNo,
      faxNo: headerResponse.faxNo,
      contactPerson: headerResponse.contactPerson,
      termId: headerResponse.termId
    });

    if (this.isPeopleACustomer())
      this.form.patchValue({
        customerId: headerResponse.customerId,
      });
    else {
      this.form.patchValue({
        vendorId: headerResponse.vendorId,
      });
    }

  }

  peopleChanged(event) {
    if (event.value) {
      var control = this.f;
      let people = this.findPeople(event.value);

      control.address.setValue(people.address);
      control.telNo.setValue(people.telNo);
      control.faxNo.setValue(people.faxNo);
      control.contactPerson.setValue(people.contactPerson);
      control.termId.setValue(people.termId);

      this.onPeopleChanged.emit(event.value);
    }
  }

  isCommentsVisible(): boolean {
    return _.indexOf(["SI", "DR", "RR", "PI"], this.transactionType) != -1;
  }

  isMOPVisible(): boolean {
    return _.indexOf(["SI", "DR", "RR", "PI"], this.transactionType) != -1;
  }

  isPeopleACustomer() {
    return _.indexOf(["SO", "SI", "DR", "SR"], this.transactionType) != -1;
  }
}
