import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import _ from "lodash";

@Component({
  selector: 'app-inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.css']
})
export class InventoryHeaderComponent implements OnInit {

  @Input() transactionType: string;
  @Input() warehouses: Array<any>;
  @Input() newItem: boolean;
  @Output() submit = new EventEmitter<Array<any>>();
  @Output() resetDetails = new EventEmitter<Array<any>>();

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
          this.resetDetails.emit(null);
        }
      })
    }
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      date: [new Date(), Validators.required],
      refNo: [''],
      systemNo: [''],
      description: [''],
      warehouseId: [null, Validators.required]
    });
  }

  updateForm(headerResponse: any) {
    this.form.patchValue({
      date: new Date(this.common.toLocaleDate(headerResponse.date)),
      systemNo: headerResponse.systemNo,
      refNo: headerResponse.refNo,
      description: headerResponse.description,
      warehouseId: headerResponse.warehouseId
    });
  }
}
