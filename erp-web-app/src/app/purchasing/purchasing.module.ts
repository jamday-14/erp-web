
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PurchasingComponent } from './purchasing.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseInvoicesComponent } from './purchase-invoices/purchase-invoices.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { ReceivingReportsComponent } from './receiving-reports/receiving-reports.component';
import { ReceivingReportComponent } from './receiving-report/receiving-report.component';
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { PurchaseReturnComponent } from './purchase-return/purchase-return.component';
import { ComponentsModule } from '../components/components.module';

export const routes: Routes = [
  {
    path: '',
    component: PurchasingComponent,
    children: [
      { path: '', redirectTo: 'purchase-orders', pathMatch: 'full' },
      { path: 'purchase-orders', component: PurchaseOrdersComponent },
      { path: 'purchase-order/:id', component: PurchaseOrderComponent },
      { path: 'purchase-invoices', component: PurchaseInvoicesComponent },
      { path: 'purchase-invoice/:id', component: PurchaseInvoiceComponent },
      { path: 'receiving-reports', component: ReceivingReportsComponent },
      { path: 'receiving-report/:id', component: ReceivingReportComponent },
      { path: 'purchase-returns', component: PurchaseReturnsComponent },
      { path: 'purchase-return/:id', component: PurchaseReturnComponent }
    ]
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PurchasingComponent,
    PurchaseOrdersComponent,
    PurchaseOrderComponent,
    PurchaseInvoicesComponent,
    PurchaseInvoiceComponent,
    ReceivingReportsComponent,
    ReceivingReportComponent,
    PurchaseReturnsComponent,
    PurchaseReturnComponent
  ]
})
export class PurchasingModule { }
