import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PurchasingService {

  constructor(public api: ApiService) { }


  addPurchasingOrder(request: any) {
    return this.api.post('purchasing/orders', request);
  }

  addPurchasingOrderDetail(request: any) {
    return this.api.post('purchasing/order/detail', request);
  }

  addReceivingReport(request: any) {
    return this.api.post('purchasing/receiving-reports', request);
  }

  addReceivingReportDetail(request: any) {
    return this.api.post('purchasing/receiving-reports/detail', request);
  }

  addPurchasingInvoice(request: any) {
    return this.api.post('purchasing/bills', request);
  }

  addPurchasingInvoiceDetail(request: any) {
    return this.api.post('purchasing/bills/detail', request);
  }

  addPurchasingReturn(request: any) {
    return this.api.post('purchasing/returns', request);
  }

  addPurchasingReturnDetail(request: any) {
    return this.api.post('purchasing/returns/detail', request);
  }

  queryReceivingReportsByVendor(vendorId: number): any {
    return this.api.get(`purchasing/vendors/${vendorId}/receiving-reports`, null, false);
  }

  queryPendingReceivingReportsByVendor(vendorId: number): any {
    return this.api.get(`purchasing/receiving-reports/${vendorId}/pending`, null, false);
  }

  queryPurchasingInvoicesByVendor(vendorId: number): any {
    return this.api.get(`purchasing/vendors/${vendorId}/bills`, null, false);
  }
  
  queryReceivingReportDetails(id: number): any {
    return this.api.get(`purchasing/receiving-reports/${id}/details`, null, false);
  }

  queryReceivingReportDetailsPendingInvoice(id: number): any {
    return this.api.get(`purchasing/receiving-reports/${id}/details/pending`, null, false);
  }

  queryPurchasingOrdersByVendor(vendorId: number): any {
    return this.api.get(`purchasing/orders/${vendorId}/pending`, null, false);
  }

  queryPurchasingOrderDetails(id: number): any {
    return this.api.get(`purchasing/orders/${id}/details`, null, false);
  }

  queryPurchasingOrderDetailsPendingRR(id: number): any {
    return this.api.get(`purchasing/orders/${id}/details/pending`, null, false);
  }

  queryPurchasingOrders(): any {
    return this.api.get('purchasing/orders', null, false);
  }

  queryReceivingReports(): any {
    return this.api.get('purchasing/receiving-reports', null, false);
  }

  queryPurchasingInvoices(): any {
    return this.api.get('purchasing/bills', null, false);
  }

  queryPurchasingReturns(): any {
    return this.api.get('purchasing/returns', null, false);
  }

  queryPurchasingInvoiceDetails(id: number): any {
    return this.api.get(`purchasing/bills/${id}/details`, null, false);
  }

  queryPurchasingReturnDetails(id: number): any {
    return this.api.get(`purchasing/returns/${id}/details`, null, false);
  }

  queryAvailablePurchasingInvoicesByVendor(vendorId: number): any {
    return this.api.get(`purchasing/vendors/${vendorId}/bills/available`, null, false);
  }

  queryAvailablePurchasingInvoiceDetails(id: any): any {
    return this.api.get(`purchasing/bills/${id}/details/available`, null, false);
  }

  getPurchasingOrder(id: number): any {
    return this.api.get(`purchasing/orders/${id}`, null, false);
  }

  getReceivingReport(id: number): any {
    return this.api.get(`purchasing/receiving-reports/${id}`, null, false);
  }

  getPurchasingInvoice(id: number): any {
    return this.api.get(`purchasing/bills/${id}`, null, false);
  }

  getPurchasingReturn(id: number): any {
    return this.api.get(`purchasing/returns/${id}`, null, false);
  }

  deletePurchasingOrderDetail(sodId: any, soId: any): any {
    return this.api.delete(`purchasing/orders/${soId}/details/${sodId}`);
  }

  deleteReceivingReportDetail(drdId: any, drId: any): any {
    return this.api.delete(`purchasing/receiving-reports/${drId}/details/${drdId}`);
  }

  deletePurchasingInvoiceDetail(sidId: any, siId: any): any {
    return this.api.delete(`purchasing/bills/${siId}/details/${sidId}`);
  }

  deletePurchasingReturnDetail(srdId: any, srId: any): any {
    return this.api.delete(`purchasing/returns/${srId}/details/${srdId}`);
  }

  updatePurchasingOrderDetail(request: any) {
    return this.api.patch(`purchasing/orders/${request.purchasingOrderId}/details/${request.id}`, request);
  }

  updatePurchasingOrder(request: any) {
    return this.api.patch(`purchasing/orders/${request.id}`, request);
  }

  updateReceivingReportDetail(request: any) {
    return this.api.patch(`purchasing/receiving-reports/${request.deliveryReceiptId}/details/${request.id}`, request);
  }

  updateReceivingReport(request: any) {
    return this.api.patch(`purchasing/receiving-reports/${request.id}`, request);
  }

  updatePurchasingInvoiceDetail(request: any) {
    return this.api.patch(`purchasing/bills/${request.purchasingInvoiceId}/details/${request.id}`, request);
  }

  updatePurchasingInvoice(request: any) {
    return this.api.patch(`purchasing/bills/${request.id}`, request);
  }

  updatePurchasingReturnDetail(request: any) {
    return this.api.patch(`purchasing/returns/${request.purchasingReturnId}/details/${request.id}`, request);
  }

  updatePurchasingReturn(request: any) {
    return this.api.patch(`purchasing/returns/${request.id}`, request);
  }
}
