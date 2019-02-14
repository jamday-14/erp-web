import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-payment-reference-header',
  templateUrl: './payment-reference-header.component.html',
  styleUrls: ['./payment-reference-header.component.css']
})
export class PaymentReferenceHeaderComponent implements OnInit {

  @Input() records: Array<any>;
  @Output() loadInvoice = new EventEmitter<Array<any>>();

  cols: any[];

  constructor() { }

  ngOnInit() {
    this.initializeColumns();
  }

  
  loadDetail(rowData) {
    rowData.isLoaded = true;
    this.loadInvoice.emit(rowData);
  }

  private initializeColumns(): any {
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'refNo', header: 'Reference No' },
      { field: 'systemNo', header: 'System No.' },
      { field: 'amount', header: 'Amount' },
      { field: 'amountPaid', header: 'Amount Paid' },
      { field: 'amountDue', header: 'Amount Due' },
      { field: 'action', header: '' },
    ];
  }

}
