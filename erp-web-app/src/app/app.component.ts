import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'erp-web-app';
  items: MenuItem[];

  constructor(router: Router, private userService: UserService) {
    router.navigate(['/home']);
  }

  ngOnInit() {
    this.login();
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
      {
        label: 'Sales',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Sales Quotation', icon: 'pi pi-fw pi-user-plus' },
          { label: 'Sales Order', icon: 'pi pi-fw pi-user-plus', routerLink: ['/sales-orders'] },
          { label: 'Sales Invoice', icon: 'pi pi-fw pi-user-plus' }
        ]
      },
      {
        label: 'Purchasing',
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Purchase Order', icon: 'pi pi-fw pi-refresh' },
          { label: 'Goods Receipt ', icon: 'pi pi-fw pi-refresh' },
          { label: 'Bills Payment', icon: 'pi pi-fw pi-refresh' }
        ]
      },
      {
        label: 'Inventory',
        icon: 'pi pi-bars',
        items: [
          { label: 'Sales Quotation', icon: 'pi pi-fw pi-user-plus' },
          { label: 'Sales Order', icon: 'pi pi-fw pi-user-plus' },
          { label: 'Sales Invoice', icon: 'pi pi-fw pi-user-plus' }
        ]
      },
      {
        label: 'Accounting',
        icon: 'pi pi-money-bill',
        items: [
          { label: 'Purchase Order', icon: 'pi pi-fw pi-refresh' },
          { label: 'Goods Receipt ', icon: 'pi pi-fw pi-refresh' },
          { label: 'Bills Payment', icon: 'pi pi-fw pi-refresh' }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-pw pi-file',
        items: [
          { label: 'Sales Quotation', icon: 'pi pi-fw pi-user-plus' },
          { label: 'Sales Order', icon: 'pi pi-fw pi-user-plus' },
          { label: 'Sales Invoice', icon: 'pi pi-fw pi-user-plus' }
        ]
      },
      {
        label: 'Maintenance',
        icon: 'pi pi-fw pi-cog',
        items: [
          { label: 'Customer', icon: 'pi pi-fw pi-refresh', routerLink: ['/customers'] },
          { label: 'Employee ', icon: 'pi pi-fw pi-refresh' },
          { label: 'Item', icon: 'pi pi-fw pi-refresh' },
          { label: 'Vendor', icon: 'pi pi-fw pi-refresh' },
        ]
      },
    ];
  }
  login(): any {
    this.userService.login({ email: "admin", password: "Password1" }).subscribe((resp) => {

    }, (err) => {

    });
  }
}
