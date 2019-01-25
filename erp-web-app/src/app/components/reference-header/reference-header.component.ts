import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-reference-header',
  templateUrl: './reference-header.component.html',
  styleUrls: ['./reference-header.component.css']
})
export class ReferenceHeaderComponent implements OnInit {

  @Input() orders: Array<any>;
  @Output() initializeOrderDetails = new EventEmitter<Array<any>>();

  cols: any[];

  constructor() { }

  ngOnInit() {
    this.initializeColumns();
  }

  
  loadDetail(rowData) {
    rowData.isLoaded = true;
    this.initializeOrderDetails.emit(rowData);
  }

  private initializeColumns(): any {
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'refNo', header: 'Reference No' },
      { field: 'systemNo', header: 'System No.' },
      { field: 'action', header: '' },
    ];
  }
}
