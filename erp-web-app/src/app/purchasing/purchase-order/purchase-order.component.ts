import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { SalesService } from 'src/app/services/sales.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';
import { ListItemComponent } from 'src/app/components/list-item/list-item.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { PurchasingService } from 'src/app/services/purchasing.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements AfterViewInit {

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

  constructor(
    private maintenanceService: MaintenanceService,
    private purchasingService: PurchasingService,
    private router: Router,
    private messaging: MessagingService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.units = [];
    this.items = [];
    this.vendors = [];
    this.terms = [];
    this.orderDetails = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
    this.transactionType = "PO";
    this.app.title = "Purchase Order Entry";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getReferenceData();
    });

  }

  private initializeHeader() {
    if (!this.newItem) {
      this.loading = true;
      var detailRequest = this.purchasingService.queryPurchasingOrderDetails(this.id);
      var headerRequest = this.purchasingService.getPurchasingOrder(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.headerComponent.updateForm(headerResponse);

        this.initializeOrderDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else {
      this.initializeOrderDetails(null);
    }
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

        this.initializeHeader();

        this.loading = false;
      }, (err) => { this.loading = false; });
  }

  initializeOrderDetails(arr: Array<any>): any {
    this.orderDetails = [];

    if (arr == null)
      this.addTableRow();
    else {
      _.forEach(arr, (record => {
        var item = this.listItemComponent.findItem(record.itemId);
        var unit = this.listItemComponent.findUnit(record.unitId);

        this.orderDetails.push({
          index: _.size(this.orderDetails), id: record.id, purchaseOrderId: record.purchaseOrderId, qtyReceived: record.qtyReceived,
          itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
          unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks, closed: record.closed
        });

        this.listItemComponent.ToggleDetailMenu();
      }));
    }
  }

  private addTableRow() {
    this.orderDetails.unshift({
      index: _.size(this.orderDetails), id: null, purchaseOrderId: null,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
      unitPrice: null, discount: null, subTotal: null, remarks: '', closed: false, qtyReceived: 0
    });
    this.listItemComponent.ToggleDetailMenu();
    this.listItemComponent.selectedRows = [];
    this.listItemComponent.selectedRows.push(_.first(this.orderDetails));
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

    var nonApiCallsRequest = selectedRows.filter(x => x.purchaseOrderId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.orderDetails, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = selectedRows.filter(x => x.purchaseOrderId != null);
    if (apiCallsRequest != null && apiCallsRequest != []) {
      var deleteRequests = [];
      _.forEach(apiCallsRequest, (row => {
        deleteRequests.push(this.purchasingService.deletePurchasingOrderDetail(row.id, row.purchaseOrderId));
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
    return rowData.qtyReceived == 0;
  }

  isDeleteRowsEnabled(orderDetails: Array<any>): boolean {
    if (_.size(orderDetails) == 0)
      return false;

    return _.size(orderDetails.filter(x => x.qtyReceived == 0)) > 0;
  }

  isRowQuantityEditable(rowData) {
    return rowData.qtyReceived == 0;
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
      ? this.purchasingService.addPurchasingOrder({
        date: controls.date.value,
        refNo: controls.refNo.value,
        address: controls.address.value,
        telNo: controls.telNo.value,
        faxNo: controls.faxNo.value,
        contactPerson: controls.contactPerson.value,
        systemNo: controls.systemNo.value,
        vendorId: controls.vendorId.value,
        termId: controls.termId.value,
        amount: this.listItemComponent.getTotal('subTotal')
      })
      : this.purchasingService.updatePurchasingOrder({
        id: this.id,
        date: controls.date.value,
        refNo: controls.refNo.value,
        address: controls.address.value,
        telNo: controls.telNo.value,
        faxNo: controls.faxNo.value,
        contactPerson: controls.contactPerson.value,
        termId: controls.termId.value,
        amount: this.listItemComponent.getTotal('subTotal')
      })

    headerRequest.subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.listItemComponent.getOrderDetails(), (detail) => {

        if (detail.id == null)
          detailsRequests.push(
            this.purchasingService.addPurchasingOrderDetail({

              purchaseOrderId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount || 0,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks
            })
          );
        else {
          detailsRequests.push(
            this.purchasingService.updatePurchasingOrderDetail({
              id: detail.id,
              purchaseOrderId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount || 0,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks
            })
          );
        }
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/purchase-orders']);
          }, 1000)

        }, (err) => {
          this.loading = false;
          this.messaging.errorMessage(this.messaging.ADD_ERROR);
        });
    }, (err) => {
      this.loading = false;
      this.messaging.errorMessage(this.messaging.ADD_ERROR);
    });
  }
}
