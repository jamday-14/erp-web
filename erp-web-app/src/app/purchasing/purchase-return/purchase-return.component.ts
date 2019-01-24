import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { PurchasingService } from 'src/app/services/purchasing.service';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.css']
})
export class PurchaseReturnComponent implements OnInit {

  form: FormGroup;
  menuItems: MenuItem[];

  id: number;
  newItem: boolean;
  loading: boolean;

  warehouses: Array<any>;
  vendors: Array<any>;
  units: Array<any>;
  items: Array<any>;
  orderDetails: Array<any>;
  orders: Array<any>;
  searchedItems: any[];
  footerData: any;
  cols: any[];

  selectedRows: any;
  detailMenuItems: MenuItem[];
  allSelected: boolean;

  constructor(
    private maintenanceService: MaintenanceService,
    private purchasingService: PurchasingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sumPipe: SumFilterPipe,
    private common: CommonService,
    private messaging: MessagingService,
    private app: AppComponent,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.vendors = [];
    this.warehouses = [];
    this.units = [];
    this.items = [];
    this.orderDetails = [];
    this.orders = [];
    this.allSelected = false;
  }

  ngOnInit() {
    this.app.title = "Purchase Return Entry";

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;

    this.initializeColumns();
    this.initializeMenu();
    this.initializeForm(null);
    this.getReferenceData();

  }
  initializeColumns(): any {
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'refNo', header: 'Reference No' },
      { field: 'systemNo', header: 'System No.' },
      { field: 'action', header: '' },
    ];
  }

  initializeForm(item: any): any {
    this.form = this.formBuilder.group({
      date: [item != null ? item.name : null, Validators.required],
      refNo: [item != null ? item.refNo : ''],
      systemNo: [item != null ? item.systemNo : ''],
      vendorId: [item != null ? item.vendorId : null, Validators.required],
      warehouseId: [item != null ? item.warehouseId : null, Validators.required],
      remarks: [item != null ? item.remarks : '']
    });
  }

  initializeMenu() {
    this.menuItems = [
      {
        label: 'Back', icon: 'pi pi-arrow-left', command: () => {
          this.location.back();
        }
      },
      {
        label: 'Save', icon: 'pi pi-save', command: () => {
          this.save();
        }
      },
    ];

    if (this.newItem) {
      this.menuItems.push({
        label: 'Reset', icon: 'pi pi-circle-off', command: () => {
          this.initializeForm(null);
          this.resetOrdersAndDetails();
          this.initializeOrderDetails(null);
        }
      })
    }

    this.detailMenuItems = [
      {
        label: 'New', icon: 'pi pi-file', command: () => {
          this.addTableRow();
        }
      },
      {
        label: 'Select All', icon: 'pi pi-list', command: () => {
          this.allSelected = !this.allSelected;
          this.detailMenuItems[1].label = this.allSelected ? 'De-select All' : 'Select All';
          this.selectedRows = this.allSelected ? this.getOrderDetails() : [];
        }
      },
      {
        label: 'Delete', icon: 'pi pi-times', command: () => {
          if (_.size(this.selectedRows) == 0) {
            this.messaging.warningMessage("Please select item to remove");
          }
          else {
            this.deleteDetails();
          }
        }
      },
    ];
  }

  private deleteDetails() {
    var nonApiCallsRequest = this.selectedRows.filter(x => x.purchaseReturnId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.orderDetails, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = this.selectedRows.filter(x => x.purchaseReturnId != null);
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

  isDeleteDetailsEnabled(): boolean {
    if (_.size(this.getOrderDetails()) == 0)
      return false;
    return _.size(this.getOrderDetails().filter(x => x.referenceDetailId == null)) > 0;
  }

  isDetailEditable(rowData) {
    return rowData.referenceDetailId == null;
  }

  isQuantityEditable(rowData) {
    return !(rowData.referenceDetailId != null && rowData.id != null);
  }

  private resetOrdersAndDetails() {
    this.orders = [];
    this.orderDetails = [];
  }

  private initializeHeader() {
    if (!this.newItem) {

      this.loading = true;
      var headerRequest = this.purchasingService.queryPurchasingReturnDetails(this.id);
      var detailRequest = this.purchasingService.getPurchasingReturn(this.id);

      forkJoin([detailRequest, headerRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.form.patchValue({
          date: new Date(this.common.toLocaleDate(headerResponse.date)),
          vendorId: headerResponse.vendorId,
          systemNo: headerResponse.systemNo,
          refNo: headerResponse.refNo,
          warehouseId: headerResponse.warehouseId,
          remarks: headerResponse.remarks
        });

        this.initializeOrders(headerResponse.vendorId);
        this.initializeSalesReturnDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else { this.initializeOrderDetails(null); }
  }

  getReferenceData(): any {
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

  get f() { return this.form.controls; }

  itemChanged(event, rowData) {
    let item = this.findItem(event.value);
    let unit = this.findUnit(item.unitId);

    rowData.itemId = item.value;
    rowData.description = item.label;
    rowData.itemCode = item.code;
    rowData.unitPrice = item.unitPrice;

    this.ToggleDetailMenu();

    if (unit) {
      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }
  }

  vendorChanged(event) {
    if (event.value) {
      this.resetOrdersAndDetails();
      this.initializeOrders(event.value);
    }
  }

  initializeOrders(vendorId: number): any {
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

  initializeOrderDetails(rowData): any {
    var response = [];

    if (rowData != null) {

      var request = rowData.referenceTypeId == 8
        ? this.purchasingService.queryReceivingReportDetailsPendingInvoice(rowData.id)
        : this.purchasingService.queryAvailablePurchasingInvoiceDetails(rowData.id);

      request.subscribe((resp) => {
        response = resp;

        _.forEach(response, (record => {
          var item = this.findItem(record.itemId);
          var unit = this.findUnit(record.unitId);

          if (rowData.referenceTypeId == 8)
            record.qty = record.qty - (record.qtyReturn + record.qtyBill);

          this.computeSubTotal(record);

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
        this.ToggleDetailMenu();
        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
    }

    else
      this.addTableRow();
  }

  private ToggleDetailMenu() {
    var isDisabled = !this.isDeleteDetailsEnabled();
    this.detailMenuItems[1].disabled = isDisabled;
    this.detailMenuItems[2].disabled = isDisabled;
  }

  initializeSalesReturnDetails(arr: Array<any>): any {
    _.forEach(arr, (record => {
      var item = this.findItem(record.itemId);
      var unit = this.findUnit(record.unitId);

      this.orderDetails.push({
        index: _.size(this.orderDetails), id: record.id, purchaseReturnId: record.purchaseReturnId,
        itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
        unitDescription: unit == null ? null : unit.label, referenceId: record.referenceId, referenceDetailId: record.referenceDetailId,
        refNo: record.referenceNo, unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks
      });
    }));
    this.ToggleDetailMenu();
  }

  findItem(itemId) {
    return this.items.find(x => x.value == itemId);
  }

  findUnit(unitId) {
    return this.units.find(x => x.value == unitId);
  }

  findVendor(vendorId) {
    return this.vendors.find(x => x.value == vendorId);
  }

  searchItems(event) {
    this.searchedItems = this.items.filter((item) => {
      return (item.label.toLowerCase().indexOf(event.query.toLowerCase()) > -1);
    })
  }

  computeSubTotal(rowData) {
    rowData.subTotal = (rowData.qty * rowData.unitPrice) - rowData.discount;
  }

  unitChanged(event, rowData) {
    if (event.value) {
      let unit = this.findUnit(event.value);

      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }
  }

  getOrderDetails(): any {
    return this.orderDetails.filter(x => x.itemCode != null);
  }

  loadDetail(rowData) {
    rowData.isLoaded = true;
    this.initializeOrderDetails(rowData);
  }

  getTotal(property: string) {
    return this.sumPipe.transform(this.getOrderDetails(), property);
  }

  getTotalItem() {
    return _.size(this.getOrderDetails());
  }

  save(): any {
    if (!this.form.valid) {
      this.messaging.warningMessage(this.messaging.REQUIRED);
      return;
    }

    if (_.size(this.getOrderDetails()) == 0) {
      this.messaging.warningMessage(this.messaging.ONE_LINE_ITEM);
      return;
    }

    if (!_.every(this.getOrderDetails(), (x) => { return x.qty > 0 && x.subTotal > 0 })) {
      this.messaging.warningMessage(this.messaging.QTY_AND_PRICE);
      return;
    }

    this.loading = true;

    var headerRequest = this.newItem
      ? this.purchasingService.addPurchasingReturn({
        date: this.f.date.value,
        refNo: this.f.refNo.value,
        remarks: this.f.remarks.value,
        vendorId: this.f.vendorId.value,
        warehouseId: this.f.warehouseId.value
      })
      : this.purchasingService.updatePurchasingReturn({
        id: this.id,
        date: this.f.date.value,
        refNo: this.f.refNo.value,
        remarks: this.f.remarks.value,
        vendorId: this.f.vendorId.value,
        warehouseId: this.f.warehouseId.value
      })
    headerRequest.subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.getOrderDetails(), (detail) => {
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
              warehouseId: this.f.warehouseId.value
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
              warehouseId: this.f.warehouseId.value
            })
          );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/purchase-returns']);
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

  addTableRow() {
    this.orderDetails.push({
      index: _.size(this.orderDetails), id: null, purchaseReturnId: null,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null, remarks: null,
      unitPrice: null, discount: 0, subTotal: null, refNo: '', closed: false, referenceId: null, referenceDetailId: null, referenceTypeId: null
    });

    this.ToggleDetailMenu();
    this.selectedRows = [];
    this.selectedRows.push(_.first(this.orderDetails));
  }

}
