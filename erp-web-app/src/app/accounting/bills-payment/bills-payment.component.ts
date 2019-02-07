import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentHeaderComponent } from 'src/app/components/payment-header/payment-header.component';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { SalesService } from 'src/app/services/sales.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagingService } from 'src/app/services/messaging.service';
import { CommonService } from 'src/app/services/common.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-bills-payment',
  templateUrl: './bills-payment.component.html',
  styleUrls: ['./bills-payment.component.css']
})
export class BillsPaymentComponent implements OnInit {

  @ViewChild(PaymentHeaderComponent)
  private headerComponent: PaymentHeaderComponent;

  id: number;
  transactionType: string;

  newItem: boolean;
  loading: boolean;

  modeOfPayments: Array<any>;
  customers: Array<any>;

  constructor(
    private maintenanceService: MaintenanceService,
    private salesService: SalesService,
    private router: Router,
    private messaging: MessagingService,
    private common: CommonService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.customers = [];
    this.modeOfPayments = [];
  }

  ngOnInit() {

    this.app.title = "Bills Payment Entry";
    this.transactionType = "BP";

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
  }

}
