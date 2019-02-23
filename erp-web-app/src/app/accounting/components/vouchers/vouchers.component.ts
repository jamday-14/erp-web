import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import _ from "lodash";

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent implements OnInit {

  @Input() vouchers: Array<any>;
  @Input() transactionType: string;
  @Output() refresh = new EventEmitter<Array<any>>();
  @Output() navigate = new EventEmitter<Array<any>>();

  menuItems: MenuItem[];
  loading: boolean;
  cols: any[];
  enableFilter: boolean;

  constructor() {
    this.enableFilter = false;
  }

  ngOnInit() {
    this.initializeMenu();
    this.initializeColumns();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.navigate.emit();
          
        }
      },
      {
        label: 'Refresh', icon: 'pi pi-refresh', command: () => {
          this.refresh.emit();
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
      { field: 'systemNo', header: 'System No.' },
      { field: 'date', header: 'Date' },
      { field: 'refNo', header: 'Reference No' },
      { field: 'description', header: 'Description' }
    ];
  }
}
