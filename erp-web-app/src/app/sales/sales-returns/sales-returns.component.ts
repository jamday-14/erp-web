import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html',
  styleUrls: ['./sales-returns.component.css']
})
export class SalesReturnsComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;

  constructor(
    private router : Router,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.app.title = "Sales Return";
    this.initializeMenu();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/sales-return']);
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
