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
  title = 'Dashboard';
  items: MenuItem[];
  settings: any[];

  constructor(router: Router, private userService: UserService) {
    router.navigate(['/home']);
  }

  ngOnInit() {
    this.login();
    this.initializeNavigationMenu();
    this.initializeSettingsMenu();
  }

  initializeSettingsMenu(): any {
    this.settings = [{
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      items: [
        { label: 'My Profile', icon: 'pi pi-fw pi-user' },
        { label: 'Change Password', icon: 'pi pi-fw pi-lock' }
      ]
    },
    { label: 'Log out', icon: 'pi pi-fw pi-sign-out' }
    ];
  }
  private initializeNavigationMenu() {
    this.items = [
      { label: 'Home', icon: 'pi pi-home', routerLink: ['/home'] },
      {
        label: 'Sales',
        routerLink: ['/sales'],
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Sales Order', routerLink: ['/sales/sales-orders'] },
          { label: 'Delivery Receipt', routerLink: ['/sales/delivery-receipts'] },
          { label: 'Sales Invoice', routerLink: ['/sales/sales-invoices'] },
          { label: 'Sales Return', routerLink: ['/sales/sales-returns'] }
        ]
      },
      {
        label: 'Purchasing',
        routerLink: ['/purchasing'],
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Purchase Order', routerLink: ['/purchasing/purchase-orders'] },
          { label: 'Receiving Report', routerLink: ['/purchasing/receiving-reports'] },
          { label: 'Purchase Invoices', routerLink: ['/purchasing/purchase-invoices'] },
          { label: 'Purchase Return', routerLink: ['/purchasing/purchase-returns'] }
        ]
      },
      {
        label: 'Inventory',
        routerLink: ['/inventory'],
        icon: 'pi pi-bars',
        items: [
          { label: 'Item Entries', routerLink: ['/inventory/item-entries'] },
          { label: 'Item Releases', routerLink: ['/inventory/item-releases'] },
          { label: 'Goods Transfer', routerLink: ['/inventory/goods-transfer'] },
          { label: 'Goods Transfer Received', routerLink: ['/inventory/goods-transfer-received'] }
        ]
      },
      {
        label: 'Accounting',
        icon: 'pi pi-money-bill',
        items: [
          { label: 'Chart of Accounts' },
          { label: 'Subsidiary' },
          { label: 'Journal Voucher' },
          { label: 'Check Voucher' },
          { label: 'Cash Receipt Voucher' }
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-file',
        items: [
          { label: 'Inventory Balance' },
          { label: 'Inventory Ledger' },
          { label: 'Trial Balance' },
          { label: 'General Ledger' },
          { label: 'Subsidiary Ledger' },
          { label: 'Balance Sheet' },
          { label: 'Income Statement' }
        ]
      },
      {
        label: 'Maintenance',
        routerLink: ['/maintenance'],
        icon: 'pi pi-cog',
        items: [
          { label: 'Customer', icon: 'pi pi-fw pi-users', routerLink: ['/maintenance/customers'] },
          { label: 'Employee ', icon: 'pi pi-fw pi-users', routerLink: ['/maintenance/employees'] },
          { label: 'Item', icon: 'pi pi-fw pi-list', routerLink: ['/maintenance/items'] },
          { label: 'Vendor', icon: 'pi pi-fw pi-users', routerLink: ['/maintenance/vendors'] },
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
