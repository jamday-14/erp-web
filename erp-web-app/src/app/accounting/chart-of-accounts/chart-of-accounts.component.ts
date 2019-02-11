import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import _ from "lodash";
import { AccountingService } from 'src/app/services/accounting.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;
  accounts: Array<any>;
  accountTypes: Array<any>;
  account: any;
  customers: Array<any>;
  cols: any[];
  enableFilter: boolean;
  displayDialog = false;
  form: FormGroup;
  newItem: boolean;

  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private app: AppComponent,
    private accountingService: AccountingService,
    private maintenanceServie: MaintenanceService,
    private messageService: MessageService
  ) {

    this.accounts = [];
    this.accountTypes = [];
    this.customers = [];
    this.enableFilter = false;
  }

  ngOnInit() {
    this.app.title = "Chart of Accounts";
    this.initializeMenu();
    this.initializeTabs();
    this.initializeColumns();
    this.getData();
  }

  initializeTabs(): any {
    this.maintenanceServie.queryAccountTypes()
      .subscribe((resp) => {
        _.forEach(resp, (element => {
          this.accountTypes.push({ value: element.id, label: element.name2 })
        }));
      }, (err) => { })
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.toggleDialog(true);
          this.initializeForm(null);
          this.account = {};
        }
      },
      {
        label: 'Refresh', icon: 'pi pi-refresh', command: () => {
          this.getData();
        }
      },
      {
        label: 'Filter', icon: 'pi pi-filter', command: () => {
          this.enableFilter = !this.enableFilter;
        }
      }
    ];
  }

  initializeColumns(): any {
    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'active', header: 'Active' },
      { field: 'isPostable', header: 'Is Postable' }
    ];
  }

  initializeForm(item: any): any {
    this.newItem = item == null ? true : false;

    this.form = this.formBuilder.group({
      code: [item != null ? item.code : '', Validators.required],
      name: [item != null ? item.name : '', Validators.required],
      active: [item != null ? item.active : true],
      isPostable: [item != null ? item.isPostable : false,],
      isBankAccount: [item != null ? item.isBankAccount : false],
      accountTypeId: [item != null ? item.accountTypeId : null, Validators.required],
    });
  }

  getData() {
    this.loading = true;
    this.accounts = [];

    this.accountingService.queryAccounts()
      .subscribe((response) => {
        this.accounts = response;
        this.loading = false;
      }, (error) => { this.loading = false; });
  }

  onRowSelect(event) {
    this.account = this.commonService.cloneItem(event.data);
    this.initializeForm(this.account);
    this.toggleDialog(true);
  }

  toggleDialog(display: boolean) {
    this.displayDialog = display;
  }

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

    this.accountingService.addAccount({
      code: this.f.code.value,
      name: this.f.name.value,
      active: this.f.active.value,
      isPostable: this.f.isPostable.value,
      isBankAccount: this.f.isBankAccount.value,
      accountTypeId: this.f.accountTypeId.value,
      level: 0
    }).subscribe((resp) => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Record has been created.' });
      this.toggleDialog(false);
      this.getData();
    }, (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Failed creating a record.' });
    });
  }

}
