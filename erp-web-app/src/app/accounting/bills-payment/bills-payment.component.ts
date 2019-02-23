import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagingService } from 'src/app/services/messaging.service';
import { CommonService } from 'src/app/services/common.service';
import { AppComponent } from 'src/app/app.component';
import { forkJoin } from 'rxjs';
import { AccountingService } from 'src/app/services/accounting.service';
import _ from "lodash";
import { PurchasingService } from 'src/app/services/purchasing.service';
import { PaymentHeaderComponent } from '../components/payment-header/payment-header.component';
import { PaymentDetailComponent } from '../components/payment-detail/payment-detail.component';

@Component({
  selector: 'app-bills-payment',
  templateUrl: './bills-payment.component.html',
  styleUrls: ['./bills-payment.component.css']
})
export class BillsPaymentComponent implements AfterViewInit {

  @ViewChild(PaymentHeaderComponent)
  private headerComponent: PaymentHeaderComponent;

  @ViewChild(PaymentDetailComponent)
  private detailComponent: PaymentDetailComponent;

  id: number;
  transactionType: string;

  newItem: boolean;
  loading: boolean;

  modeOfPayments: Array<any>;
  banks: Array<any>;
  vendors: Array<any>;
  details: Array<any>;
  invoices: Array<any>;
  adjustments: Array<any>;

  constructor(
    private maintenanceService: MaintenanceService,
    private accoutingService: AccountingService,
    private purchasingService: PurchasingService,
    private router: Router,
    private messaging: MessagingService,
    private common: CommonService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.vendors = [];
    this.modeOfPayments = [];
    this.banks = [];
    this.details = [];
    this.adjustments = [];
    this.invoices = [];
  }

  ngOnInit() {

    this.app.title = "Bills Payment Entry";
    this.transactionType = "BP";

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getReferenceData();
    });

  }

  private getReferenceData(): any {
    this.loading = true;
    var mopRequest = this.maintenanceService.queryPaymentModes();
    var vendorsRequest = this.maintenanceService.queryVendors();
    var banksRequest = this.maintenanceService.queryBanks();

    forkJoin([mopRequest, vendorsRequest, banksRequest])
      .subscribe((response) => {
        let mopResponse = response[0];
        let vendorsReponse = response[1];
        let banksResponse = response[2];

        _.forEach(mopResponse, (element => {
          this.modeOfPayments.push({ value: element.id, label: element.name })
        }));

        _.forEach(vendorsReponse, (el => {
          this.vendors.push({ value: el.id, label: el.name, address: el.address, contactPerson: el.contactPerson, telNo: el.telNo, faxNo: el.faxNo, termId: el.termId })
        }));

        _.forEach(banksResponse, (element => {
          this.banks.push({ value: element.id, label: element.name })
        }));

        this.loading = false;
        this.initializeHeader();

      }, (err) => { this.loading = false; });
  }

  private initializeHeader() {
    if (!this.newItem) {

      this.loading = true;
      var headerRequest = this.accoutingService.getBillPayment(this.id);
      var detailRequest = this.accoutingService.queryBillPaymentDetails(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.headerComponent.updateForm(headerResponse);

        ////this.initializeOrders(headerResponse.customerId);
        this.initializePaymentDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else {
      //this.addTableRow();
    }
  }

  initializePaymentDetails(arr: Array<any>): any {

  }

  loadInvoice(inv) {
    this.details.unshift({
      index: _.size(this.details), id: null, billId: inv.id, billRefNo: inv.refNo, billSystemNo: inv.systemNo,
      billAmount: inv.amount, billAmountPaid: inv.amountPaid, billAmountDue: inv.amountDue, amount: 0,
      amountPaidAfterPayment: null, amountDueAfterPayment: null, remarks: ''
    });
    this.detailComponent.ToggleDetailMenu();
    this.detailComponent.selectedRows = [];
    this.detailComponent.selectedRows.push(_.first(this.details));
  }

  onVendorChanged(vendorId) {
    this.loadVendorInvoices(vendorId);
  }

  loadVendorInvoices(vendorId: any): any {
    this.invoices = [];
    this.purchasingService.queryVendorInvoicesForPayment(vendorId)
      .subscribe((resp) => {
        this.invoices = resp;
      }, (err) => { })
  }

  submit() {
    var controls = this.headerComponent.f;

    if (!this.headerComponent.form.valid) {
      this.messaging.warningMessage(this.messaging.REQUIRED);
      return;
    }

    if (_.size(this.detailComponent.getDetails()) == 0) {
      this.messaging.warningMessage(this.messaging.ONE_LINE_ITEM);
      return;
    }

    if (!_.every(this.detailComponent.getDetails(), (x) => { return x.amount > 0 })) {
      this.messaging.warningMessage(this.messaging.AMOUNT);
      return;
    }

    this.loading = true;

    var headerRequest = this.newItem ?
      this.accoutingService.addBillPayment({
        date: controls.date.value,
        refNo: controls.refNo.value,
        vendorId: controls.vendorId.value,
        mopid: controls.mopid.value,
        amount: controls.amount.value,
        bankId: controls.bankId.value,
        checkDate: controls.checkDate.value,
        checkRefNo: controls.checkRefNo.value
      })
      : this.accoutingService.updateBillPayment({
        id: this.id,
        date: controls.date.value,
        refNo: controls.refNo.value,
        vendorId: controls.vendorId.value,
        mopid: controls.mopid.value,
        bankId: controls.bankId.value,
        checkDate: controls.checkDate.value,
        checkRefNo: controls.checkRefNo.value
      });

    headerRequest.subscribe((resp) => {

      let header: any;
      let detailsRequests = [];
      header = resp;

      _.forEach(this.detailComponent.getDetails(), (detail) => {

        if (detail.id == null)
          detailsRequests.push(
            this.accoutingService.addBillPaymentDetail(
              header.id,
              {
                billId: detail.billId,
                billAmount: detail.billAmount,
                billAmountPaid: detail.billAmountPaid,
                billAmountDue: detail.billAmountDue,
                amount: detail.amount
              })
          );
        else
          detailsRequests.push(
            this.accoutingService.updateBillPaymentDetail({
              id: detail.id,
              billId: header.billId,
              billAmount: detail.billAmount,
              billAmountPaid: detail.billAmountPaid,
              billAmountDue: detail.billAmountDue,
              amount: detail.amount
            })
          );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/accounting/bills-payments'])
          }, 1000);

        }, (err) => {
          this.loading = false;
          this.messaging.errorMessage(this.messaging.ADD_ERROR);
        });
    }, (err) => {
      this.loading = false;
      this.messaging.errorMessage(this.messaging.ADD_ERROR);
    });
  }

  onAddRowAdjustment(adjustments: Array<any>){
    this.adjustments = adjustments;
    this.adjustments.unshift({});
  }
}
