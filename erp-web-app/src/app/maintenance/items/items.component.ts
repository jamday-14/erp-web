import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MaintenanceService } from '../../services/maintenance.service';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  form: FormGroup;
  newItem: boolean;

  menuItems: MenuItem[];
  records: any;
  item: any;
  items: any[];
  cols: any[];
  loading = false;

  units: Array<any>;
  displayDialog = false;

  constructor(
    private maintenanceService: MaintenanceService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.units = [];
  }

  ngOnInit() {
    this.initializeMenu();

    this.initializeTableColumns();

    this.getReferenceData();

    this.getData();
  }
  getReferenceData(): any {
    this.maintenanceService.queryUnits().subscribe((resp) => {
      let arr: any;
      arr = resp;
      arr.forEach(element => {
        this.units.push({ value: element.id, label: element.name })
      });
    }, (err) => { });
  }

  initializeForm(item: any): any {
    this.newItem = item == null ? true : false;

    this.form = this.formBuilder.group({
      itemCode: [item != null ? item.itemCode : '', Validators.required],
      description: [item != null ? item.description : '', Validators.required],
      unitPrice: [item != null ? item.unitPrice : '', Validators.required],
      costPrice: [item != null ? item.costPrice : '', Validators.required],
      quantity: [item != null ? item.quantity : '', Validators.required],
      unitId: [item != null ? item.unitId : null, Validators.required],
      isPurchased: [item != null ? item.isPurchased : false],
      isForSale: [item != null ? item.isForSale : false],
      isInventory: [item != null ? item.isInventory : false],
      isImported: [item != null ? item.isImported : false]
    });
  }

  private initializeTableColumns() {
    this.cols = [
      { field: 'itemCode', header: 'Item Code' },
      { field: 'description', header: 'Description' },
      { field: 'unitPrice', header: 'Unit Price' },
      { field: 'costPrice', header: 'Cost Price' },
      { field: 'quantity', header: 'Quantity' }
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
    this.maintenanceService.queryItems().subscribe((resp) => {
      this.records = resp;
      this.items = this.records;
      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
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

    this.maintenanceService.addItem({
      itemCode: this.f.itemCode.value,
      description: this.f.description.value,
      unitPrice: this.f.unitPrice.value,
      costPrice: this.f.costPrice.value,
      quantity: this.f.quantity.value,
      unitId: this.f.unitId.value,
      ipurchased: this.f.isPurchased.value,
      isForSale: this.f.isForSale.value,
      isImported: this.f.isImported.value,
      isInventory: this.f.isInventory.value
    }).subscribe((resp) => {
      this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Record has been created.' });
      this.toggleDialog(false);
      this.getData();
    }, (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'Failed creating a record.' });
    });
  }

  onRowSelect(event) {
    this.item = this.commonService.cloneItem(event.data);
    this.initializeForm(this.item);
    this.toggleDialog(true);
  }

  toggleDialog(display: boolean) {
    this.displayDialog = display;
  }

}
