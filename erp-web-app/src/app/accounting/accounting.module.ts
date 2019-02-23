import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { JournalVouchersComponent } from './journal-vouchers/journal-vouchers.component';
import { CheckVouchersComponent } from './check-vouchers/check-vouchers.component';
import { CashVouchersComponent } from './cash-vouchers/cash-vouchers.component';
import { CashReceiptVouchersComponent } from './cash-receipt-vouchers/cash-receipt-vouchers.component';
import { BillsPaymentsComponent } from './bills-payments/bills-payments.component';
import { BillsPaymentComponent } from './bills-payment/bills-payment.component';
import { SalesInvoicePaymentsComponent } from './sales-invoice-payments/sales-invoice-payments.component';
import { SalesInvoicePaymentComponent } from './sales-invoice-payment/sales-invoice-payment.component';
import { AccountingComponent } from './accounting.component';
import { ComponentsModule } from '../components/components.module';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { SharedModule } from '../shared/shared.module';
import { AdjustmentsComponent } from './components/adjustments/adjustments.component';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { PaymentHeaderComponent } from './components/payment-header/payment-header.component';
import { PaymentReferenceHeaderComponent } from './components/payment-reference-header/payment-reference-header.component';
import { VoucherHeaderComponent } from './components/voucher-header/voucher-header.component';
import { VoucherDetailComponent } from './components/voucher-detail/voucher-detail.component';
import { VouchersComponent } from './components/vouchers/vouchers.component';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';


export const routes: Routes = [
  {
    path: '',
    component: AccountingComponent,
    children: [
      { path: '', redirectTo: 'bills-payments', pathMatch: 'full' },
      { path: 'bills-payments', component: BillsPaymentsComponent },
      { path: 'bills-payment/:id', component: BillsPaymentComponent },
      { path: 'sales-invoice-payments', component: SalesInvoicePaymentsComponent },
      { path: 'sales-invoice-payment/:id', component: SalesInvoicePaymentComponent },
      { path: 'journal-vouchers', component: JournalVouchersComponent },
      { path: 'journal-voucher/:id', component: JournalVoucherComponent },
      { path: 'check-vouchers', component: CheckVouchersComponent },
      { path: 'cash-vouchers', component: CashVouchersComponent },
      { path: 'cash-receipt-vouchers', component: CashReceiptVouchersComponent },
      { path: 'chart-of-accounts', component: ChartOfAccountsComponent },
      //{ path: 'chart-of-accounts', loadChildren:'./chart-of-accounts/chart-of-accounts.module#ChartOfAccountsModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BillsPaymentsComponent,
    BillsPaymentComponent,
    SalesInvoicePaymentsComponent,
    SalesInvoicePaymentComponent,
    JournalVouchersComponent, 
    CheckVouchersComponent, 
    CashVouchersComponent, 
    CashReceiptVouchersComponent, 
    AccountingComponent,
    ChartOfAccountsComponent,
    AdjustmentsComponent,
    PaymentDetailComponent,
    PaymentHeaderComponent,
    PaymentReferenceHeaderComponent,
    VoucherHeaderComponent,
    VoucherDetailComponent,
    VouchersComponent,
    JournalVoucherComponent
  ]
})
export class AccountingModule { }
