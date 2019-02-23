import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";

@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.css']
})
export class VoucherDetailComponent implements OnInit {

  @Input() details: Array<any>;
  @Input() subsidiaries: Array<any>;
  @Input() accounts: Array<any>;
  @Input() transactionType: string;
  @Output() addRow = new EventEmitter<Array<any>>();
  @Output() deleteRow = new EventEmitter<Array<any>>();


  footerData: any;
  selectedRows: any;
  detailMenuItems: MenuItem[];
  allSelected: boolean;

  constructor(
    private sumPipe: SumFilterPipe
  ) {
    this.detailMenuItems = [];
    this.accounts = [];
    this.subsidiaries = [];
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
          this.detailMenuItems[0].label = this.allSelected ? 'De-select All' : 'Select All';
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
    //this.detailMenuItems[1].disabled = !this.isDeleteDetailsEnabled();
  }

  getDetails(): any {
    return this.details.filter(x => x.billId != null);
  }

  getTotal(property: string) {
    return this.sumPipe.transform(this.getDetails(), property);
  }

  getTotalItem() {
    return _.size(this.getDetails());
  }

}
