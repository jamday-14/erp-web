import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CommonService } from 'src/app/services/common.service';
import { PurchasingService } from 'src/app/services/purchasing.service';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css']
})
export class PurchaseInvoiceComponent implements AfterViewInit {

  @ViewChild(ListItemComponent)
  private listItemComponent: ListItemComponent;

  @ViewChild(HeaderComponent)
  private headerComponent: HeaderComponent;

  id: number;
  transactionType: string;

  newItem: boolean;
  loading: boolean;

  terms: Array<any>;
  vendors: Array<any>;
  units: Array<any>;
  items: Array<any>;
  orderDetails: Array<any>;
  orders: Array<any>;

  constructor(
    private maintenanceService: MaintenanceService,
    private purchasingService: PurchasingService,
    private router: Router,
    private messaging: MessagingService,
    private common: CommonService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.units = [];
    this.items = [];
    this.vendors = [];
    this.terms = [];
    this.orders = [];
    this.orderDetails = [];
  }

  ngOnInit() {
    this.app.title = "Purchase Invoice Entry";
    this.transactionType = "PI";

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getReferenceData();
    });

  }

  onAddRow(orderDetails: Array<any>) {
    this.orderDetails = orderDetails;
    this.addTableRow();
  }

  onDeleteRow(selectedRows: Array<any>) {

    if (_.size(selectedRows) == 0) {
      this.messaging.warningMessage("Please select item to remove");
      return;
    }

    var nonApiCallsRequest = selectedRows.filter(x => x.billId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.orderDetails, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = selectedRows.filter(x => x.billId != null);
    if (apiCallsRequest != null && apiCallsRequest != []) {
      var deleteRequests = [];
      _.forEach(apiCallsRequest, (row => {
        deleteRequests.push(this.purchasingService.deletePurchasingInvoiceDetail(row.id, row.billId));
      }));
      this.loading = true;
      forkJoin(deleteRequests).subscribe((res) => {
        _.forEach(apiCallsRequest, (row => {
          _.remove(this.orderDetails, function (x) { return x.index == row.index; });
        }));
        this.messaging.successMessage(this.messaging.DELETE_SUCCESS);
        this.loading = false;
      }, (err) => {
        this.messaging.errorMessage(this.messaging.DELETE_ERROR);
        this.loading = false;
      });
    }
  }

  isRowDataEditable(rowData: any): boolean {
    return rowData.rrdetailId == null;
  }

  isDeleteRowsEnabled(orderDetails: Array<any>): boolean {
    if (_.size(orderDetails) == 0)
      return false;
    return _.size(orderDetails.filter(x => x.rrdetailId == null)) > 0;
  }

  isRowQuantityEditable(rowData) {
    return !(rowData.rrdetailId != null && rowData.id != null);
  }

  onVendorChanged(vendorId) {
    this.resetOrdersAndDetails();
    this.initializeOrders(vendorId);
  }

  submit() {
    var controls = this.headerComponent.f;

    if (!this.headerComponent.form.valid) {
      this.messaging.warningMessage(this.messaging.REQUIRED);
      return;
    }

    if (_.size(this.listItemComponent.getOrderDetails()) == 0) {
      this.messaging.warningMessage(this.messaging.ONE_LINE_ITEM);
      return;
    }

    if (!_.every(this.listItemComponent.getOrderDetails(), (x) => { return x.qty > 0 && x.subTotal > 0 })) {
      this.messaging.warningMessage(this.messaging.QTY_AND_PRICE);
      return;
    }

    this.loading = true;

    var headerRequest = this.newItem
      ? this.purchasingService.addPurchasingInvoice({
        date: controls.date.value,
        refNo: controls.refNo.value,
        address: controls.address.value,
        comments: controls.comments.value,
        telNo: controls.telNo.value,
        faxNo: controls.faxNo.value,
        contactPerson: controls.contactPerson.value,
        vendorId: controls.vendorId.value,
        termId: controls.termId.value,
        mopid: controls.mopid.value,
        amount: this.listItemComponent.getTotal('subTotal'),
        totalAmount: 0
      })
      : this.purchasingService.updatePurchasingInvoice({
        id: this.id,
        date: controls.date.value,
        refNo: controls.refNo.value,
        address: controls.address.value,
        comments: controls.comments.value,
        telNo: controls.telNo.value,
        faxNo: controls.faxNo.value,
        contactPerson: controls.contactPerson.value,
        vendorId: controls.vendorId.value,
        termId: controls.termId.value,
        mopid: controls.mopid.value,
        amount: this.listItemComponent.getTotal('subTotal'),
        totalAmount: 0
      })

    headerRequest.subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.listItemComponent.getOrderDetails(), (detail) => {

        if (detail.id == null)
          detailsRequests.push(
            this.purchasingService.addPurchasingInvoiceDetail({

              billId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks,
              rrId: detail.rrId,
              rrdetailId: detail.rrdetailId,
              rrrefNo: detail.refNo,
              closed: detail.closed
            })
          );

        else
          detailsRequests.push(
            this.purchasingService.updatePurchasingInvoiceDetail({
              id: detail.id,
              billId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks,
              rrId: detail.rrId,
              rrdetailId: detail.rrdetailId,
              rrrefNo: detail.refNo,
              closed: detail.closed
            })
          );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/purchase-invoices']);
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

  OnEnter(index, rowData) {
    if (this.orderDetails.length == (index + 1) && rowData.itemCode != null)
      this.addTableRow();
  }

  initializeOrderDetails(rowData): any {
    var records = [];
    if (rowData != null)
      this.purchasingService.queryReceivingReportDetailsPendingInvoice(rowData.id).subscribe((resp) => {
        records = resp;
        _.forEach(records, (record => {
          var item = this.listItemComponent.findItem(record.itemId);
          var unit = this.listItemComponent.findUnit(record.unitId);

          record.qty -= (record.qtyReturn + record.qtyBill)
          this.listItemComponent.computeSubTotal(record);

          this.orderDetails.push({
            index: _.size(this.orderDetails), id: null, billId: null,
            itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, qtyReturn: null,
            unitId: unit.value, unitDescription: unit.label, unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal,
            refNo: rowData.systemNo, closed: record.closed, rrId: record.receivingReportId, rrdetailId: record.id
          });
        }))
        this.listItemComponent.ToggleDetailMenu();
        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
    else
      this.addTableRow();
  }

  resetOrderDetails() {
    this.resetOrdersAndDetails();
    this.initializeOrderDetails(null);
  }

  private resetOrdersAndDetails() {
    this.orders = [];
    this.orderDetails = [];
  }

  private initializeHeader() {
    if (!this.newItem) {

      this.loading = true;
      var headerRequest = this.purchasingService.getPurchasingInvoice(this.id);
      var detailRequest = this.purchasingService.queryPurchasingInvoiceDetails(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.headerComponent.updateForm(headerResponse);

        this.initializeOrders(headerResponse.vendorId);
        this.initializePurchaseInvoiceDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else { this.initializeOrderDetails(null); }
  }

  private getReferenceData(): any {
    this.loading = true;
    var termsRequest = this.maintenanceService.queryTerms();
    var vendorsRequest = this.maintenanceService.queryVendors();
    var unitsRequest = this.maintenanceService.queryUnits();
    var itemsRequest = this.maintenanceService.queryItems();

    forkJoin([termsRequest, vendorsRequest, unitsRequest, itemsRequest])
      .subscribe((response) => {
        let termsResponse = response[0];
        let vendorsReponse = response[1];
        let unitsResponse = response[2];
        let itemsResponse = response[3];

        _.forEach(termsResponse, (element => {
          this.terms.push({ value: element.id, label: element.name })
        }));

        _.forEach(vendorsReponse, (el => {
          this.vendors.push({ value: el.id, label: el.name, address: el.address, contactPerson: el.contactPerson, telNo: el.telNo, faxNo: el.faxNo, termId: el.termId })
        }));

        _.forEach(unitsResponse, (element => {
          this.units.push({ value: element.id, label: element.name })
        }));

        _.forEach(itemsResponse, (element => {
          this.items.push({ value: element.id, label: element.description, code: element.itemCode, unitPrice: element.unitPrice, unitId: element.unitId })
        }));

        this.loading = false;
        this.initializeHeader();

      }, (err) => { this.loading = false; });
  }

  private initializeOrders(vendorId: number): any {
    this.loading = true;
    var records = [];
    this.purchasingService.queryPendingReceivingReportsByVendor(vendorId).subscribe((resp) => {
      records = resp;

      _.forEach(records, (record => {
        this.orders.push({
          id: record.id, date: this.common.toLocaleDate(record.date),
          systemNo: record.systemNo, refNo: record.refNo, closed: record.closed, isLoaded: false
        });
      }))

      if (_.size(this.orders) == 0 && this.newItem) {
        this.initializeOrderDetails(null);
      }

      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  private initializePurchaseInvoiceDetails(arr: Array<any>): any {
    _.forEach(arr, (record => {
      var item = this.listItemComponent.findItem(record.itemId);
      var unit = this.listItemComponent.findUnit(record.unitId);

      this.orderDetails.push({
        index: _.size(this.orderDetails), id: record.id, billId: record.billId, qtyReturn: record.qtyReturn,
        itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
        unitDescription: unit == null ? null : unit.label, rrId: record.drId, rrdetailId: record.rrdetailId, refNo: record.rrrefNo,
        unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks
      });
    }));
    this.listItemComponent.ToggleDetailMenu();
  }

  private addTableRow() {
    this.orderDetails.unshift({
      index: _.size(this.orderDetails), id: null, billId: null,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null, qtyReturn: null,
      unitPrice: null, discount: 0, subTotal: null, refNo: '', closed: false, rrId: null, rrdetailId: null
    });
    this.listItemComponent.ToggleDetailMenu();
    this.listItemComponent.selectedRows = [];
    this.listItemComponent.selectedRows.push(_.first(this.orderDetails));
  }
}
