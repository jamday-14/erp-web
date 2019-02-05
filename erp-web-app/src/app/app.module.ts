import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { MessageService } from 'primeng/api';
import { SumFilterPipe } from './sum-filter.pipe';
import { RequestCacheWithMap } from './services/request-cache.service';
import { CachingInterceptor } from './services/caching-interceptor.service';
import { DatePipe } from '@angular/common';


const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'maintenance', loadChildren:'./maintenance/maintenance.module#MaintenanceModule' },
  { path: 'sales', loadChildren:'./sales/sales.module#SalesModule' },
  { path: 'purchasing', loadChildren:'./purchasing/purchasing.module#PurchasingModule' },
  { path: 'inventory', loadChildren:'./inventory/inventory.module#InventoryModule' },
  { path: 'accounting', loadChildren:'./accounting/accounting.module#AccountingModule' },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SumFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenubarModule,
    PanelModule,
    PanelMenuModule,
    ToastModule,
    ChartModule,
    FullCalendarModule,
    HttpClientModule,
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
