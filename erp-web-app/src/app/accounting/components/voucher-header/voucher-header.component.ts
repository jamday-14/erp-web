import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MenuItem } from 'primeng/api';
import _ from "lodash";

@Component({
  selector: 'app-voucher-header',
  templateUrl: './voucher-header.component.html',
  styleUrls: ['./voucher-header.component.css']
})
export class VoucherHeaderComponent implements OnInit {

  @Input() transactionType: string;
  @Input() newItem: boolean;
  @Output() submit = new EventEmitter<Array<any>>();

  form: FormGroup;
  menuItems: MenuItem[];

  constructor(
    private formBuilder: FormBuilder,
    private location: Location
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
      description: ['']
    });

  }

  updateForm(headerResponse: any): any {
    throw new Error("Method not implemented.");
  }
}
