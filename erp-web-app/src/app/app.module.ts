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
import { MessageService } from 'primeng/api';
import { SumFilterPipe } from './sum-filter.pipe';
import { RequestCacheWithMap } from './services/request-cache.service';
import { CachingInterceptor } from './services/caching-interceptor.service';
import { DatePipe } from '@angular/common';

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'vendors', component: VendorsComponent },
  { path: 'sales', loadChildren:'./sales/sales.module#SalesModule' },
  { path: 'purchasing', loadChildren:'./purchasing/purchasing.module#PurchasingModule' },
  { path: 'inventory', loadChildren:'./inventory/inventory.module#InventoryModule' }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomersComponent,
    EmployeesComponent,
    ItemsComponent,
    VendorsComponent,
    SumFilterPipe
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
