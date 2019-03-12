import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";

@Component({
  selector: 'app-vendor-item',
  templateUrl: './vendor-item.component.html',
  styleUrls: ['./vendor-item.component.css']
})
export class VendorItemComponent implements OnInit {

  @Input() items: Array<any>;
  @Output() addRow = new EventEmitter<Array<any>>();
  @Output() deleteRow = new EventEmitter<Array<any>>();
  
  searchedItems: any[];
  footerData: any;
  selectedRows: any;
  detailMenuItems: MenuItem[];
  allSelected: boolean;
  
  constructor(private sumPipe: SumFilterPipe) { 
    this.detailMenuItems = [];
    this.items = [];
    this.allSelected = false;
  }

  ngOnInit() {
    this.initializeMenu();
  }

  initializeMenu() {
    this.detailMenuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.addRow.emit(this.items);
        }
      },
      {
        label: 'Select All', icon: 'pi pi-list', command: () => {
          this.allSelected = !this.allSelected;
          this.detailMenuItems[1].label = this.allSelected ? 'De-select All' : 'Select All';
          this.selectedRows = this.allSelected ? this.getAllItems() : [];
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
    //this.detailMenuItems[2].disabled = !this.isDeleteDetailsEnabled();
  }

  itemChanged(event, rowData) {
    let item = this.findItem(event.value);

    rowData.itemId = item.value;
    rowData.description = item.label;
    rowData.itemCode = item.code;

    this.ToggleDetailMenu();
  }

  findItem(itemId) {
    var item = this.items.find(x => x.value == itemId);
    if (item == null)
      item = { value: null, label: '' };
    return item;
  }

  getAllItems(): any {
    return this.items;
  }

  getTotal(property: string) {
    return this.sumPipe.transform(this.getAllItems(), property);
  }

  getTotalItem() {
    return _.size(this.getAllItems());
  }

}
