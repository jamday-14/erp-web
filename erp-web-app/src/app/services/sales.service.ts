import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
        
  constructor(public api: ApiService) { }

  addSalesOrder(request: any) {
    return this.api.post('sales/orders', request);
  }

  addSalesOrderDetail(request: any) {
    return this.api.post('sales/order/detail', request);
  }

  addDeliveryReceipt(request: any) {
    return this.api.post('sales/delivery-receipts', request);
  }

  addDeliveryReceiptDetail(request: any) {
    return this.api.post('sales/delivery-receipts/detail', request);
  }

  addSalesInvoice(request: any) {
    return this.api.post('sales/invoices', request);
  }

  addSalesInvoiceDetail(request: any) {
    return this.api.post('sales/invoices/detail', request);
  }

  queryDeliveryReceiptsByCustomer(customerId: number): any {
    return this.api.get(`sales/delivery-receipts/${customerId}/pending`, null, false);
  }

  queryDeliveryReceiptDetails(id: number): any {
    return this.api.get(`sales/delivery-receipts/${id}/details`, null, false);
  }

  querySalesOrdersByCustomer(customerId: number): any {
    return this.api.get(`sales/orders/${customerId}/pending`, null, false);
  }

  querySalesOrderDetails(id: number): any {
    return this.api.get(`sales/orders/${id}/details`, null, false);
  }
}
