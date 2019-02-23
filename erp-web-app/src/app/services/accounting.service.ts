import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  queryVouchers(): any {
    return this.api.get('accounting/chart-of-accounts', null, false);
  }

  constructor(public api: ApiService) { }

  queryAccounts(): any {
    return this.api.get('accounting/chart-of-accounts', null, false);
  }

  addAccount(request: any) {
    return this.api.post('accounting/chart-of-accounts', request, false);
  }

  queryBillPaymentDetails(id: number): any {
    return this.api.get(`accounting/bill-payments/${id}/details`, null, false);
  }
  getBillPayment(id: number): any {
    return this.api.get(`accounting/bill-payments/${id}`, null, false);
  }

  updateBillPaymentDetail(arg0: { id: any; billId: any; billAmount: any; billAmountPaid: any; billAmountDue: any; amount: any; }): any {
    throw new Error("Method not implemented.");
  }
  updateBillPayment(request: any): any {
    throw new Error("Method not implemented.");
  }
  addBillPayment(request: any): any {
    return this.api.post('accounting/bill-payments', request, false);
  }

  addBillPaymentDetail(id: number, request: any): any {
    return this.api.post(`accounting/bill-payments/${id}/details`, request);
  }
}
