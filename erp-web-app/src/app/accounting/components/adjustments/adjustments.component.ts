import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";

@Component({
  selector: 'app-adjustments',
  templateUrl: './adjustments.component.html',
  // styleUrls: ['./adjustments.component.css']
})
export class AdjustmentsComponent implements OnInit {

  @Input() adjustments: Array<any>;
  @Input() transactionType: string;
  @Output() addRow = new EventEmitter<Array<any>>();
  @Output() deleteRow = new EventEmitter<Array<any>>();
  @Input() isRowDataEditable: (value: any) => boolean;
  @Input() isDeleteRowsEnabled: (value: any) => boolean;
  @Input() isRowQuantityEditable: (value: any) => boolean;

  footerData: any;
  selectedRows: any;
  detailMenuItems: MenuItem[];
  allSelected: boolean;

  constructor(
    private sumPipe: SumFilterPipe
  ) {
    this.detailMenuItems = [];
    this.adjustments = [];
    this.allSelected = false;
  }

  ngOnInit() {
    this.initializeMenu();
  }

  initializeMenu() {
    this.detailMenuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.addRow.emit(this.adjustments);
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
    //this.detailMenuItems[1].disabled = !this.isDeleteDetailsEnabled();
  }

  // compute(rowData) {
  //   rowData.amountPaidAfterPayment = _.sum([_.toNumber(rowData.billAmountPaid), _.toNumber(rowData.amount)]);
  //   rowData.amountDueAfterPayment = _.subtract(_.toNumber(rowData.billAmountDue), _.toNumber(rowData.amount));
  // }

  getDetails(): any {
    return this.adjustments.filter(x => x.billId != null);
  }

  getTotal(property: string) {
    return this.sumPipe.transform(this.getDetails(), property);
  }

  getTotalItem() {
    return _.size(this.getDetails());
  }
}
