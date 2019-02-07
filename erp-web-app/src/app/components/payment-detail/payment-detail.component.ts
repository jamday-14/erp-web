import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {

  @Input() details: Array<any>;
  @Input() units: Array<any>;
  @Input() items: Array<any>;
  @Input() reasons: Array<any>;
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
    this.reasons = [];
    this.details = [];
    this.allSelected = false;
  }

  ngOnInit() {
    this.initializeMenu();
  }

  initializeMenu() {
    this.detailMenuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.addRow.emit(this.details);
        }
      },
      {
        label: 'Select All', icon: 'pi pi-list', command: () => {
          this.allSelected = !this.allSelected;
          this.detailMenuItems[1].label = this.allSelected ? 'De-select All' : 'Select All';
          this.selectedRows = this.allSelected ? this.getDetails() : [];
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

  findReason(id) {
    var reason = this.reasons.find(x => x.value == id);
    if (reason == null)
      reason = { value: null, label: '' };
    return reason;
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

  reasonChanged(event, rowData) {
    if (event.value) {
      let unit = this.findUnit(event.value);

      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }
  }

  getDetails(): any {
    return this.details.filter(x => x.itemCode != null);
  }

  getTotal(property: string) {
    return this.sumPipe.transform(this.getDetails(), property);
  }

  getTotalItem() {
    return _.size(this.getDetails());
  }

  OnEnter(index, rowData) {
    if (this.details.length == (index + 1) && rowData.itemCode != null)
      this.addRow.emit(this.details);
  }

  isDetailEditable(rowData) {
    return this.isRowDataEditable(rowData);
  }

  isDeleteDetailsEnabled(): boolean {
    return this.isDeleteRowsEnabled(this.getDetails());
  }

  isQuantityEditable(rowData): boolean {
    return this.isRowQuantityEditable(rowData)
  }

  isQtyOnHandVisible(): boolean {
    return _.indexOf(["IE", "IR", "GT"], this.transactionType) != -1;
  }

  isQtyReceivedVisible(): boolean {
    return this.transactionType == "GT";
  }

  isQtyLeftVisible(): boolean {
    return this.transactionType == "GT";
  }

  isRefNoVisible(): boolean {
    return this.transactionType == "GTR";
  }

}
