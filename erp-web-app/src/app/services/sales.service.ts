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

  queryDeliveryReceiptsByCustomer(customerId: number): any {
    return this.api.get(`sales/delivery-receipts/${customerId}/pending`, null);
  }

  queryDeliveryReceiptDetails(id: number): any {
    return this.api.get(`sales/delivery-receipts/${id}/details`, null);
  }

  querySalesOrdersByCustomer(customerId: number): any {
    return this.api.get(`sales/orders/${customerId}/pending`, null);
  }

  querySalesOrderDetails(id: number): any {
    return this.api.get(`sales/orders/${id}/details`, null);
  }
}
