import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';
import { InventoryDetailComponent } from 'src/app/components/inventory-detail/inventory-detail.component';
import { InventoryHeaderComponent } from 'src/app/components/inventory-header/inventory-header.component';
import { InventoryService } from 'src/app/services/inventory.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-goods-transfer-receipt',
  templateUrl: './goods-transfer-receipt.component.html',
  styleUrls: ['./goods-transfer-receipt.component.css']
})
export class GoodsTransferReceiptComponent implements AfterViewInit {

  @ViewChild(InventoryDetailComponent)
  private inventoryDetailComponent: InventoryDetailComponent;

  @ViewChild(InventoryHeaderComponent)
  private inventoryHeaderComponent: InventoryHeaderComponent;

  id: number;
  transactionType: string;

  newItem: boolean;
  loading: boolean;

  warehouses: Array<any>;
  reasons: Array<any>;
  units: Array<any>;
  items: Array<any>;
  details: Array<any>;
  referenceHeaders: Array<any>

  constructor(
    private maintenanceService: MaintenanceService,
    private inventoryService: InventoryService,
    private router: Router,
    private messaging: MessagingService,
    private common: CommonService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.units = [];
    this.items = [];
    this.reasons = [];
    this.warehouses = [];
    this.details = [];
    this.referenceHeaders = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
    this.transactionType = "GTR";
    this.app.title = "Goods Transfer Received - Entry";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getReferenceData();
    });

  }

  private initializeHeader() {
    if (!this.newItem) {
      this.loading = true;
      var detailRequest = this.inventoryService.queryGoodsTransferReceiptDetails(this.id);
      var headerRequest = this.inventoryService.getGoodsTransferReceipt(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.inventoryHeaderComponent.updateForm(headerResponse);

        this.initializeReferenceHeader(headerResponse.toWarehouseId);
        this.initializeGoodsTransferReceivedDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else {
      this.initializeGoodsTransferReceivedDetails(null);
    }
  }

  private getReferenceData(): any {
    this.loading = true;
    var warehousesRequest = this.maintenanceService.queryWarehouses();
    var reasonsRequest = this.maintenanceService.queryCustomers();
    var unitsRequest = this.maintenanceService.queryUnits();
    var itemsRequest = this.maintenanceService.queryItems();

    forkJoin([warehousesRequest, reasonsRequest, unitsRequest, itemsRequest])
      .subscribe((response) => {
        let warehousesResponse = response[0];
        let reasonsReponse = response[1];
        let unitsResponse = response[2];
        let itemsResponse = response[3];

        _.forEach(warehousesResponse, (element => {
          this.warehouses.push({ value: element.id, label: element.name })
        }));

        _.forEach(reasonsReponse, (element => {
          this.reasons.push({ value: element.id, label: element.name })
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

  private resetHeadersAndDetails() {
    this.referenceHeaders = [];
    this.details = [];
  }

  onWarehouseChanged(warehouseId) {
    this.resetHeadersAndDetails();
    this.initializeReferenceHeader(warehouseId);
  }

  resetHeaderDetails() {
    this.resetHeadersAndDetails();
    this.initializeGoodsTransferReceivedDetails(null);
  }

  initializeGoodsTransferReceivedDetails(arr: Array<any>): any {
    _.forEach(arr, (record => {
      var item = this.inventoryDetailComponent.findItem(record.itemId);
      var unit = this.inventoryDetailComponent.findUnit(record.unitId);
      var reason = this.inventoryDetailComponent.findReason(record.reasonId);

      this.details.push({
        index: _.size(this.details), id: record.id, goodTransferReceivedId: record.goodTransferReceivedId, qtyOnHand: record.qtyOnHand,
        itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
        remarks: record.remarks, reasonId: reason.value, reasonDescription: reason.label,
        refNo: record.gtrefNo, gtid: record.gtid, gtdetailId: record.gtdetailId
      });
    }));

    this.inventoryDetailComponent.ToggleDetailMenu();
  }

  initializeDetails(rowData): any {
    var records = [];
    if (rowData != null) {
      this.loading = true;
      this.inventoryService.queryGoodsTransferDetailPendingReceipt(rowData.id).subscribe(
        (resp) => {
          records = resp;
          _.forEach(records, (record => {
            var item = this.inventoryDetailComponent.findItem(record.itemId);
            var unit = this.inventoryDetailComponent.findUnit(record.unitId);
            var reason = this.inventoryDetailComponent.findReason(record.reasonId);

            record.qty -= record.qtyReceived;

            this.details.push({
              index: _.size(this.details), id: null, goodTransferReceivedId: null, qtyOnHand: null,
              itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
              remarks: record.remarks, reasonId: reason != null ? reason.value : null, reasonDescription: reason != null ? reason.label : '',
              refNo: rowData.systemNo, gtid: record.goodsTransferId, gtdetailId: record.id
            });

          }));

          this.inventoryDetailComponent.ToggleDetailMenu();
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        });
    }
    else
      this.addTableRow();
  }

  private addTableRow() {
    this.details.unshift({

      index: _.size(this.details), id: null, goodTransferReceivedId: null, qtyOnHand: 0,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
      remarks: '', reasonId: null, reasonDescription: '',
      refNo: null, gtid: null, gtdetailId: null
    });
    this.inventoryDetailComponent.ToggleDetailMenu();
    this.inventoryDetailComponent.selectedRows = [];
    this.inventoryDetailComponent.selectedRows.push(_.first(this.details));
  }

  private initializeReferenceHeader(warehouseId: number): any {
    this.loading = true;
    var records = [];
    this.inventoryService.queryGoodsTransfersByWarehouse(warehouseId).subscribe((resp) => {
      records = resp;
      _.forEach(records, (record => {
        this.referenceHeaders.push({
          id: record.id, date: this.common.toLocaleDate(record.date),
          systemNo: record.systemNo, refNo: record.refNo, closed: record.closed, isLoaded: false
        });
      }))

      if (_.size(this.referenceHeaders) == 0 && this.newItem) {
        this.initializeGoodsTransferReceivedDetails(null);
      }

      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  onAddRow(details: Array<any>) {
    this.details = details;
    this.addTableRow();
  }

  onDeleteRow(selectedRows: Array<any>) {

    if (_.size(selectedRows) == 0) {
      this.messaging.warningMessage("Please select item to remove");
      return;
    }

    var nonApiCallsRequest = selectedRows.filter(x => x.goodTransferReceivedId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.details, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = selectedRows.filter(x => x.goodTransferReceivedId != null);
    if (apiCallsRequest != null && apiCallsRequest != []) {
      var deleteRequests = [];
      _.forEach(apiCallsRequest, (row => {
        deleteRequests.push(this.inventoryService.deleteGoodsTransferReceiptDetail(row.id, row.goodTransferReceivedId));
      }));
      this.loading = true;
      forkJoin(deleteRequests).subscribe((res) => {
        _.forEach(apiCallsRequest, (row => {
          _.remove(this.details, function (x) { return x.index == row.index; });
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
    return rowData.qtyOnHand == 0;
  }

  isDeleteRowsEnabled(orderDetails: Array<any>): boolean {
    if (_.size(orderDetails) == 0)
      return false;

    return _.size(orderDetails.filter(x => x.qtyOnHand == 0)) > 0;
  }

  isRowQuantityEditable(rowData) {
    return rowData.qtyOnHand == 0;
  }

  submit() {
    var controls = this.inventoryHeaderComponent.f;

    if (!this.inventoryHeaderComponent.form.valid) {
      this.messaging.warningMessage(this.messaging.REQUIRED);
      return;
    }

    if (_.size(this.inventoryDetailComponent.getDetails()) == 0) {
      this.messaging.warningMessage(this.messaging.ONE_LINE_ITEM);
      return;
    }

    if (!_.every(this.inventoryDetailComponent.getDetails(), (x) => { return x.qty > 0 })) {
      this.messaging.warningMessage(this.messaging.QTY_AND_PRICE);
      return;
    }

    this.loading = true;

    var headerRequest = this.newItem
      ? this.inventoryService.addGoodsTransferReceipt({
        date: controls.date.value,
        refNo: controls.refNo.value,
        description: controls.description.value,
        warehouseId: controls.warehouseId.value
      })
      : this.inventoryService.updateGoodsTransferReceipt({
        id: this.id,
        date: controls.date.value,
        refNo: controls.refNo.value,
        description: controls.description.value,
        warehouseId: controls.warehouseId.value
      })

    headerRequest.subscribe((resp) => {

      let entry: any;
      let detailsRequests = [];
      entry = resp;

      _.forEach(this.inventoryDetailComponent.getDetails(), (detail) => {

        if (detail.id == null)
          detailsRequests.push(
            this.inventoryService.addGoodsTransferReceiptDetail(
              {
                goodTransferReceivedId: entry.id,
                itemId: detail.itemId,
                qty: detail.qty,
                unitId: detail.unitId,
                reasonId: detail.reasonId,
                remarks: detail.remarks,
                gtid: detail.gtid,
                gtdetailId: detail.gtdetailId,
                gtrefNo: detail.refNo
              })
          );
        else {
          detailsRequests.push(
            this.inventoryService.updateGoodsTransferReceiptDetail({
              id: detail.id,
              goodTransferReceivedId: detail.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitId: detail.unitId,
              reasonId: detail.reasonId,
              remarks: detail.remarks,
              gtid: detail.gtid,
              gtdetailId: detail.gtdetailId,
              gtrefNo: detail.refNo
            })
          );
        }
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/inventory/goods-transfer-receipts']);
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
