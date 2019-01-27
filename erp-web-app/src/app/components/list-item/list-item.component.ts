import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Input() orderDetails: Array<any>;
  @Input() units: Array<any>;
  @Input() items: Array<any>;
  @Input() warehouses: Array<any>;
  @Input() transactionType: string;
  @Output() addRow = new EventEmitter<Array<any>>();
  @Output() deleteRow = new EventEmitter<Array<any>>();
  @Input() isRowDataEditable: (value: any) => boolean;
  @Input() isDeleteRowsEnabled: (value: any) => boolean;
  @Input() isRowQuantityEditable: (value: any) => boolean;

  searchedItems: any[];
  footerData: any;
  selectedRows: any;
  detailMenuItems: MenuItem[];
  allSelected: boolean;

  constructor(
    private sumPipe: SumFilterPipe
  ) {
    this.detailMenuItems = [];
    this.items = [];
    this.units = [];
    this.warehouses = [];
    this.orderDetails = [];
    this.allSelected = false;
  }

  ngOnInit() {
    this.initializeMenu();
  }

  initializeMenu() {
    this.detailMenuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.addRow.emit(this.orderDetails);
        }
      },
      {
        label: 'Select All', icon: 'pi pi-list', command: () => {
          this.allSelected = !this.allSelected;
          this.detailMenuItems[1].label = this.allSelected ? 'De-select All' : 'Select All';
          this.selectedRows = this.allSelected ? this.getOrderDetails() : [];
        }
      },
      {
        label: 'Delete', icon: 'pi pi-times', command: () => {
          this.deleteRow.emit(this.selectedRows);
        }
      },
    ];
  }

  ToggleDetailMenu() {
    this.detailMenuItems[2].disabled = !this.isDeleteDetailsEnabled();
  }

  itemChanged(event, rowData) {
    let item = this.findItem(event.value);
    let unit = this.findUnit(item.unitId);

    rowData.itemId = item.value;
    rowData.description = item.label;
    rowData.itemCode = item.code;
    rowData.unitPrice = item.unitPrice;

    if (unit) {
      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }

    this.ToggleDetailMenu();
  }

  warehouseChanged(event, rowData) {
    if (event.value) {
      let warehouse = this.findWarehouse(event.value);

      rowData.warehouseId = warehouse.value;
      rowData.warehouseDescription = warehouse.label;
    }
  }

  findItem(itemId) {
    var item = this.items.find(x => x.value == itemId);
    if (item == null)
      item = { value: null, label: '' };
    return item;
  }

  findUnit(id) {
    var unit = this.units.find(x => x.value == id);
    if (unit == null)
      unit = { value: null, label: '' };
    return unit;
  }

  findWarehouse(id) {
    var warehouse = this.warehouses.find(x => x.value == id);
    if (warehouse == null)
      warehouse = { value: null, label: '' };
    return warehouse;
  }

  searchItems(event) {
    this.searchedItems = this.items.filter((item) => {
      return (item.label.toLowerCase().indexOf(event.query.toLowerCase()) > -1);
    })
  }

  computeSubTotal(rowData) {
    rowData.subTotal = (rowData.qty * rowData.unitPrice) - rowData.discount;
  }

  unitChanged(event, rowData) {
    if (event.value) {
      let unit = this.findUnit(event.value);

      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }
  }

  getOrderDetails(): any {
    return this.orderDetails.filter(x => x.itemCode != null);
  }

  getTotal(property: string) {
    return this.sumPipe.transform(this.getOrderDetails(), property);
  }

  getTotalItem() {
    return _.size(this.getOrderDetails());
  }

  OnEnter(index, rowData) {
    if (this.orderDetails.length == (index + 1) && rowData.itemCode != null)
      this.addRow.emit(this.orderDetails);
  }

  isDetailEditable(rowData) {
    return this.isRowDataEditable(rowData);
  }

  isDeleteDetailsEnabled(): boolean {
    return this.isDeleteRowsEnabled(this.getOrderDetails());
  }

  isQuantityEditable(rowData): boolean {
    return this.isRowQuantityEditable(rowData)
  }

  isQtyReturnVisible(): boolean {
    return _.indexOf(["SI", "DR", "PI", "RR"], this.transactionType) != -1;
  }

  isQtyDrVisible(): boolean {
    return this.transactionType == "SO";
  }

  isQtyReceivedVisible(): boolean {
    return this.transactionType == "PO";
  }

  isQtyBilledVisible(): boolean {
    return this.transactionType == "RR";
  }

  isQtyInvoiceVisible() {
    return this.transactionType == "DR";
  }

  isRefNoVisible(): boolean {
    return this.transactionType != "SO";
  }

  isPeopleACustomer() {
    return _.indexOf(["SO", "SI", "DR", "SR"], this.transactionType) != -1;
  }

  isWarehouseVisible(): boolean {
    return _.indexOf(["DR", "RR"], this.transactionType) != -1;
  }

}
