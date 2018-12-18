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
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './customers/customers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './services/auth.service';

const appRoutes: Routes = [
  { path: 'sales-orders', component: SalesOrdersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomersComponent },

  //{ path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SalesOrdersComponent,
    HomeComponent,
    CustomersComponent
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export const ListSize = 50;
