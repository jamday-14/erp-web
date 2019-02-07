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
    ChartOfAccountsComponent
  ]
})
export class AccountingModule { }
