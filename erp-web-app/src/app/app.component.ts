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
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Sales Quotation' },
          { label: 'Sales Order', routerLink: ['/sales-orders']},
          { label: 'Delivery Receipt' , routerLink: ['/delivery-receipts']},
          { label: 'Sales Invoice' , routerLink: ['/sales-invoices']},
          { label: 'Sales Return' }
        ]
      },
      {
        label: 'Purchasing',
        icon: 'pi pi-shopping-cart',
        items: [
          { label: 'Purchase Request' },
          { label: 'Purchase Order' },
          { label: 'Goods Receipt' },
          { label: 'Goods Return' },
          { label: 'Bills' },
          { label: 'Bills Payment' }
        ]
      },
      {
        label: 'Inventory',
        icon: 'pi pi-bars',
        items: [
          { label: 'Inventory Adjustment' },
          { label: 'Relocate Goods'},
          { label: 'Physical Inventory' }
        ]
      },
      {
        label: 'Accounting',
        icon: 'pi pi-money-bill',
        items: [
          { label: 'Chart of Accounts' },
          { label: 'Subsidiary'},
          { label: 'Journal Voucher' },
          { label: 'Check Voucher' },
          { label: 'Cash Receipt Voucher'}
        ]
      },
      {
        label: 'Reports',
        icon: 'pi pi-file',
        items: [
          { label: 'Inventory Balance' },
          { label: 'Inventory Ledger'},
          { label: 'Trial Balance' },
          { label: 'General Ledger' },
          { label: 'Subsidiary Ledger'},
          { label: 'Balance Sheet' },
          { label: 'Income Statement' }
        ]
      },
      {
        label: 'Maintenance',
        icon: 'pi pi-cog',
        items: [
          { label: 'Customer', icon: 'pi pi-fw pi-users', routerLink: ['/customers'] },
          { label: 'Employee ', icon: 'pi pi-fw pi-users', routerLink: ['/employees'] },
          { label: 'Item', icon: 'pi pi-fw pi-list', routerLink: ['/items'] },
          { label: 'Vendor', icon: 'pi pi-fw pi-users', routerLink: ['/vendors'] },
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
