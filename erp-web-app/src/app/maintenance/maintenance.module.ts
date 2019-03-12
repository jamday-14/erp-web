import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceComponent } from './maintenance.component';
import { CustomersComponent } from './customers/customers.component';
import { EmployeesComponent } from './employees/employees.component';
import { VendorsComponent } from './vendors/vendors.component';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { VendorComponent } from './vendor/vendor.component';
import { VendorItemComponent } from './components/vendor-item/vendor-item.component';
import { ItemsComponent } from './items/items.component';

export const routes: Routes = [
  {
    path: '',
    component: MaintenanceComponent,
    children: [
      { path: '', redirectTo: 'customers', pathMatch: 'full' },
      { path: 'customers', component: CustomersComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'vendor/:id', component: VendorComponent },
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
    MaintenanceComponent,
    CustomersComponent,
    EmployeesComponent,
    ItemsComponent,
    VendorsComponent,
    VendorComponent,
    VendorItemComponent
  ],
  exports: [
    VendorItemComponent
  ]
})
export class MaintenanceModule { }
