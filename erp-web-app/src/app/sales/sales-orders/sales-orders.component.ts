import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-sales-orders',
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.css']
})
export class SalesOrdersComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;

  constructor(
    private router : Router,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.app.title = "Sales Order";
    this.initializeMenu();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/sales-order']);
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
