import { SalesComponent } from './sales.component';
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesInvoicesComponent } from './sales-invoices/sales-invoices.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { DeliveryReceiptsComponent } from './delivery-receipts/delivery-receipts.component';
import { DeliveryReceiptComponent } from './delivery-receipt/delivery-receipt.component';
import { SalesReturnsComponent } from './sales-returns/sales-returns.component';
import { SalesReturnComponent } from './sales-return/sales-return.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';

export const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      { path: '', redirectTo: 'sales-orders', pathMatch: 'full' },
      { path: 'sales-orders', component: SalesOrdersComponent },
      { path: 'sales-order/:id', component: SalesOrderComponent },
      { path: 'sales-invoices', component: SalesInvoicesComponent },
      { path: 'sales-invoice/:id', component: SalesInvoiceComponent },
      { path: 'delivery-receipts', component: DeliveryReceiptsComponent },
      { path: 'delivery-receipt/:id', component: DeliveryReceiptComponent },
      { path: 'sales-returns', component: SalesReturnsComponent },
      { path: 'sales-return/:id', component: SalesReturnComponent },
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
    SalesComponent,
    SalesOrdersComponent,
    SalesOrderComponent,
    SalesInvoicesComponent,
    SalesInvoiceComponent,
    DeliveryReceiptsComponent,
    DeliveryReceiptComponent,
    SalesReturnsComponent,
    SalesReturnComponent
  ]
})
export class SalesModule { }
