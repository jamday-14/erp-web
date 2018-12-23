import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-orders',
  templateUrl: './sales-orders.component.html',
  styleUrls: ['./sales-orders.component.css']
})
export class SalesOrdersComponent implements OnInit {

  menuItems: MenuItem[];

  constructor(
    private router : Router
  ) { }

  ngOnInit() {
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
