import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
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

const appRoutes: Routes = [
  { path: 'sales-orders', component: SalesOrdersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'vendors', component: VendorsComponent },

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
    DeliveryReceiptsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export const ListSize = 50;
