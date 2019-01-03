import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-delivery-receipts',
  templateUrl: './delivery-receipts.component.html',
  styleUrls: ['./delivery-receipts.component.css']
})
export class DeliveryReceiptsComponent implements OnInit {

  menuItems: MenuItem[];
  loading: boolean;

  constructor(
    private router : Router,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.app.title = "Delivery Receipt";
    this.initializeMenu();
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.router.navigate(['/delivery-receipt']);
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
