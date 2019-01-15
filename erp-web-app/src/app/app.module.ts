import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './maintenance/customers/customers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { EmployeesComponent } from './maintenance/employees/employees.component';
import { ItemsComponent } from './maintenance/items/items.component';
import { VendorsComponent } from './maintenance/vendors/vendors.component';
import { SalesOrdersComponent } from './sales/sales-orders/sales-orders.component';
import { SalesInvoicesComponent } from './sales/sales-invoices/sales-invoices.component';
import { SalesReturnsComponent } from './sales/sales-returns/sales-returns.component';
import { DeliveryReceiptsComponent } from './sales/delivery-receipts/delivery-receipts.component';
import { MessageService } from 'primeng/api';
import { SalesOrderComponent } from './sales/sales-order/sales-order.component';
import { SumFilterPipe } from './sum-filter.pipe';
import { SalesInvoiceComponent } from './sales/sales-invoice/sales-invoice.component';
import { RequestCacheWithMap } from './services/request-cache.service';
import { CachingInterceptor } from './services/caching-interceptor.service';
import { DeliveryReceiptComponent } from './sales/delivery-receipt/delivery-receipt.component';
import { SalesReturnComponent } from './sales/sales-return/sales-return.component';
import { DatePipe } from '@angular/common';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'vendors', component: VendorsComponent },
  { path: 'sales-orders', component: SalesOrdersComponent },
  { path: 'sales-order/:id', component: SalesOrderComponent },
  { path: 'sales-invoices', component: SalesInvoicesComponent },
  { path: 'sales-invoice/:id', component: SalesInvoiceComponent },
  { path: 'delivery-receipts', component: DeliveryReceiptsComponent },
  { path: 'delivery-receipt/:id', component: DeliveryReceiptComponent },
  { path: 'sales-returns', component: SalesReturnsComponent },
  { path: 'sales-return/:id', component: SalesReturnComponent }
  //{ path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SalesOrdersComponent,
    HomeComponent,
    CustomersComponent,
    EmployeesComponent,
    ItemsComponent,
    VendorsComponent,
    SalesInvoicesComponent,
    SalesReturnsComponent,
    DeliveryReceiptsComponent,
    SalesOrderComponent,
    SumFilterPipe,
    SalesInvoiceComponent,
    DeliveryReceiptComponent,
    SalesReturnComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PanelMenuModule,
    MenubarModule,
    ProgressBarModule,
    TableModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SidebarModule,
    PanelModule,
    ToastModule,
    ChartModule,
    FullCalendarModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    MessagesModule,
    MessageModule,
    CheckboxModule,
    CalendarModule,
    AutoCompleteModule,
    BlockUIModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash: true, enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    RequestCacheWithMap,
    MessageService,
    SumFilterPipe,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export const ListSize = 50;
