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

  addSalesReturn(request: any) {
    return this.api.post('sales/returns', request);
  }

  addSalesReturnDetail(request: any) {
    return this.api.post('sales/returns/detail', request);
  }

  queryDeliveryReceiptsByCustomer(customerId: number): any {
    return this.api.get(`sales/customers/${customerId}/delivery-receipts`, null, false);
  }

  queryPendingDeliveryReceiptsByCustomer(customerId: number): any {
    return this.api.get(`sales/delivery-receipts/${customerId}/pending`, null, false);
  }

  queryDeliveryReceiptDetails(id: number): any {
    return this.api.get(`sales/delivery-receipts/${id}/details`, null, false);
  }

  queryDeliveryReceiptDetailsPendingInvoice(id: number): any {
    return this.api.get(`sales/delivery-receipts/${id}/details/pending`, null, false);
  }

  querySalesOrdersByCustomer(customerId: number): any {
    return this.api.get(`sales/orders/${customerId}/pending`, null, false);
  }

  querySalesOrderDetails(id: number): any {
    return this.api.get(`sales/orders/${id}/details`, null, false);
  }

  querySalesOrderDetailsPendingDR(id: number): any {
    return this.api.get(`sales/orders/${id}/details/pending`, null, false);
  }

  querySalesOrders(): any {
    return this.api.get('sales/orders', null, false);
  }

  queryDeliveryReceipts(): any {
    return this.api.get('sales/delivery-receipts', null, false);
  }

  querySalesInvoices(): any {
    return this.api.get('sales/invoices', null, false);
  }

  querySalesReturns(): any {
    return this.api.get('sales/returns', null, false);
  }

  querySalesInvoiceDetails(id: number): any {
    return this.api.get(`sales/invoices/${id}/details`, null, false);
  }

  querySalesReturnDetails(id: number): any {
    return this.api.get(`sales/returns/${id}/details`, null, false);
  }

  getSalesOrder(id: number): any {
    return this.api.get(`sales/orders/${id}`, null, false);
  }

  getDeliveryReceipt(id: number): any {
    return this.api.get(`sales/delivery-receipts/${id}`, null, false);
  }

  getSalesInvoice(id: number): any {
    return this.api.get(`sales/invoices/${id}`, null, false);
  }

  getSalesReturn(id: number): any {
    return this.api.get(`sales/returns/${id}`, null, false);
  }

  deleteSalesOrderDetail(sodId: any, soId: any): any {
    return this.api.delete(`sales/orders/${soId}/details/${sodId}`);
  }

  deleteDeliveryReceiptDetail(drdId: any, drId: any): any {
    return this.api.delete(`sales/delivery-receipts/${drId}/details/${drdId}`);
  }

  deleteSalesInvoiceDetail(sidId: any, siId: any): any {
    return this.api.delete(`sales/invoices/${siId}/details/${sidId}`);
  }

  updateSalesOrderDetail(request: any) {
    return this.api.patch(`sales/orders/${request.salesOrderId}/details/${request.id}`, request);
  }

  updateSalesOrder(request: any) {
    return this.api.patch(`sales/orders/${request.id}`, request);
  }

  updateDeliveryReceiptDetail(request: any) {
    return this.api.patch(`sales/delivery-receipts/${request.deliveryReceiptId}/details/${request.id}`, request);
  }

  updateDeliveryReceipt(request: any) {
    return this.api.patch(`sales/delivery-receipts/${request.id}`, request);
  }

  updateSalesInvoiceDetail(request: any) {
    return this.api.patch(`sales/invoices/${request.salesInvoiceId}/details/${request.id}`, request);
  }

  updateSalesInvoice(request: any) {
    return this.api.patch(`sales/invoices/${request.id}`, request);
  }
}
