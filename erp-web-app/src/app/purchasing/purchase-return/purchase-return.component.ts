import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { SalesService } from 'src/app/services/sales.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { CommonService } from 'src/app/services/common.service';
import { HeaderReturnComponent } from 'src/app/components/header-return/header-return.component';
import { PurchasingService } from 'src/app/services/purchasing.service';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.css']
})
export class PurchaseReturnComponent implements AfterViewInit {

  @ViewChild(ListItemComponent)
  private listItemComponent: ListItemComponent;

  @ViewChild(HeaderReturnComponent)
  private headerComponent: HeaderReturnComponent;

  id: number;
  transactionType: string;

  newItem: boolean;
  loading: boolean;

  warehouses: Array<any>;
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
    this.warehouses = [];
    this.orders = [];
    this.orderDetails = [];
  }

  ngOnInit() {
    this.app.title = "Purchase Return Entry";
    this.transactionType = "PR";

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

    var nonApiCallsRequest = selectedRows.filter(x => x.purchaseReturnId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.orderDetails, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = selectedRows.filter(x => x.purchaseReturnId != null);
    if (apiCallsRequest != null && apiCallsRequest != []) {
      var deleteRequests = [];
      _.forEach(apiCallsRequest, (row => {
        deleteRequests.push(this.purchasingService.deletePurchasingReturnDetail(row.id, row.purchaseReturnId));
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
    return rowData.referenceDetailId == null;
  }

  isDeleteRowsEnabled(orderDetails: Array<any>): boolean {
    if (_.size(orderDetails) == 0)
      return false;
    return _.size(orderDetails.filter(x => x.referenceDetailId == null)) > 0;
  }

  isRowQuantityEditable(rowData) {
    return !(rowData.referenceDetailId != null && rowData.id != null);
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
      ? this.purchasingService.addPurchasingReturn({
        date: controls.date.value,
        refNo: controls.refNo.value,
        remarks: controls.remarks.value,
        vendorId: controls.vendorId.value,
        warehouseId: controls.warehouseId.value
      })
      : this.purchasingService.updatePurchasingReturn({
        id: this.id,
        date: controls.date.value,
        refNo: controls.refNo.value,
        remarks: controls.remarks.value,
        vendorId: controls.vendorId.value,
        warehouseId: controls.warehouseId.value
      })
    headerRequest.subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.listItemComponent.getOrderDetails(), (detail) => {
        if (detail.id == null)
          detailsRequests.push(
            this.purchasingService.addPurchasingReturnDetail({
              purchaseReturnId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks,
              referenceId: detail.referenceId,
              referenceDetailId: detail.referenceDetailId,
              referenceTypeId: detail.referenceTypeId,
              referenceNo: detail.refNo,
              warehouseId: controls.warehouseId.value
            })
          );
        else
          detailsRequests.push(
            this.purchasingService.updatePurchasingReturnDetail({
              id: detail.id,
              purchaseReturnId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks,
              referenceId: detail.referenceId,
              referenceDetailId: detail.referenceDetailId,
              referenceTypeId: detail.referenceTypeId,
              referenceNo: detail.refNo,
              warehouseId: controls.warehouseId.value
            })
          );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/purchasing/purchase-returns']);
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
    var response = [];

    if (rowData != null) {

      var request = rowData.referenceTypeId == 8
        ? this.purchasingService.queryReceivingReportDetailsPendingInvoice(rowData.id)
        : this.purchasingService.queryAvailablePurchasingInvoiceDetails(rowData.id);

      request.subscribe((resp) => {
        response = resp;

        _.forEach(response, (record => {
          var item = this.listItemComponent.findItem(record.itemId);
          var unit = this.listItemComponent.findUnit(record.unitId);

          if (rowData.referenceTypeId == 8)
            record.qty = record.qty - (record.qtyReturn + record.qtyBill);

          this.listItemComponent.computeSubTotal(record);

          if (rowData.referenceTypeId == 8)
            this.orderDetails.push({
              index: _.size(this.orderDetails), id: null, purchaseReturnId: null,
              itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
              unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, refNo: rowData.systemNo, remarks: null,
              referenceId: record.receivingReportId, referenceDetailId: record.id, referenceTypeId: rowData.referenceTypeId
            });
          else
            this.orderDetails.push({
              index: _.size(this.orderDetails), id: null, purchaseReturnId: null,
              itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
              unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, refNo: rowData.systemNo, remarks: null,
              referenceId: record.billId, referenceDetailId: record.id, referenceTypeId: rowData.referenceTypeId
            });
        }))
        this.listItemComponent.ToggleDetailMenu();
        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
    }

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
      var headerRequest = this.purchasingService.getPurchasingReturn(this.id);
      var detailRequest = this.purchasingService.queryPurchasingReturnDetails(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.headerComponent.form.patchValue({
          date: new Date(this.common.toLocaleDate(headerResponse.date)),
          vendorId: headerResponse.vendorId,
          systemNo: headerResponse.systemNo,
          refNo: headerResponse.refNo,
          warehouseId: headerResponse.warehouseId,
          remarks: headerResponse.remarks
        });

        this.initializeOrders(headerResponse.vendorId);
        this.initializePurchaseReturnDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else { this.initializeOrderDetails(null); }
  }

  private getReferenceData(): any {
    this.loading = true;
    var warehouseRequest = this.maintenanceService.queryWarehouses();
    var vendorsRequest = this.maintenanceService.queryVendors();
    var unitsRequest = this.maintenanceService.queryUnits();
    var itemsRequest = this.maintenanceService.queryItems();

    forkJoin([warehouseRequest, vendorsRequest, unitsRequest, itemsRequest])
      .subscribe((response) => {
        let warehousResponse = response[0];
        let vendorsReponse = response[1];
        let unitsResponse = response[2];
        let itemsResponse = response[3];

        _.forEach(warehousResponse, (element => {
          this.warehouses.push({ value: element.id, label: element.name })
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
    var responses = [];
    var requests = [];
    requests.push(this.purchasingService.queryPendingReceivingReportsByVendor(vendorId));
    requests.push(this.purchasingService.queryAvailablePurchasingInvoicesByVendor(vendorId));

    forkJoin(requests).subscribe((resp) => {
      responses = resp;
      _.forEach(responses[0], (record => {
        this.orders.push({
          id: record.id, date: this.common.toLocaleDate(record.date), systemNo: record.systemNo,
          refNo: record.refNo, closed: record.closed, isLoaded: false, referenceTypeId: 8
        });
      }))

      _.forEach(responses[1], (record => {
        this.orders.push({
          id: record.id, date: this.common.toLocaleDate(record.date), systemNo: record.systemNo,
          refNo: record.refNo, closed: record.closed, isLoaded: false, referenceTypeId: 9
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

  private initializePurchaseReturnDetails(arr: Array<any>): any {
    _.forEach(arr, (record => {
      var item = this.listItemComponent.findItem(record.itemId);
      var unit = this.listItemComponent.findUnit(record.unitId);

      this.orderDetails.push({
        index: _.size(this.orderDetails), id: record.id, purchaseReturnId: record.purchaseReturnId,
        itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
        unitDescription: unit == null ? null : unit.label, referenceId: record.referenceId, referenceDetailId: record.referenceDetailId,
        refNo: record.referenceNo, unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks
      });
    }));
    this.listItemComponent.ToggleDetailMenu();
  }

  private addTableRow() {
    this.orderDetails.push({
      index: _.size(this.orderDetails), id: null, purchaseReturnId: null,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null, remarks: null,
      unitPrice: null, discount: 0, subTotal: null, refNo: '', closed: false, referenceId: null, referenceDetailId: null, referenceTypeId: null
    });
    this.listItemComponent.ToggleDetailMenu();
    this.listItemComponent.selectedRows = [];
    this.listItemComponent.selectedRows.push(_.first(this.orderDetails));
  }

}
