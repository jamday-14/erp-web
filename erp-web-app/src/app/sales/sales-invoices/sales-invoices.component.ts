import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.css']
})
export class SalesInvoicesComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;

  constructor(
    private router : Router,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.app.title = "Sales Invoice";
    this.initializeMenu();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/sales-invoice']);
        }
      },
      {
        label: 'Refresh', icon: 'pi pi-refresh', command: () => {
          //this.getData();
        }
      }
    ];
  }

}
