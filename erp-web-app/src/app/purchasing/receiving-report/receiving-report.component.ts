import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-receiving-report',
  templateUrl: './receiving-report.component.html',
  styleUrls: ['./receiving-report.component.css']
})
export class ReceivingReportComponent implements OnInit {

  form: FormGroup;
  menuItems: MenuItem[];

  id: number;
  newItem: boolean;
  loading: boolean;

  terms: Array<any>;
  vendors: Array<any>;
  units: Array<any>;
  items: Array<any>;
  warehouses: Array<any>;
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
    this.terms = [];
    this.units = [];
    this.items = [];
    this.warehouses = [];
    this.orderDetails = [];
    this.orders = [];
    this.allSelected = false;
  }

  ngOnInit() {
    this.app.title = "Receiving Report Entry";

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
      address: [item != null ? item.address : ''],
      telNo: [item != null ? item.telNo : ''],
      faxNo: [item != null ? item.faxNo : ''],
      contactPerson: [item != null ? item.contactPerson : ''],
      termId: [item != null ? item.termId : null],
      comments: [item != null ? item.comments : ''],
      mopid: [item != null ? item.mopid : null]
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
    var nonApiCallsRequest = this.selectedRows.filter(x => x.receivingReportId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.orderDetails, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = this.selectedRows.filter(x => x.receivingReportId != null);
    if (apiCallsRequest != null && apiCallsRequest != []) {
      var deleteRequests = [];
      _.forEach(apiCallsRequest, (row => {
        deleteRequests.push(this.purchasingService.deleteReceivingReportDetail(row.id, row.receivingReportId));
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
    return _.size(this.getOrderDetails().filter(x => x.qtyBill == 0 && x.qtyReturn == 0)) > 0;
  }

  isDetailEditable(rowData) {
    return rowData.qtyBill == 0 && rowData.qtyReturn == 0 && rowData.id == null;
  }

  isQuantityEditable(rowData) {
    return rowData.qtyBill == 0 && rowData.qtyReturn == 0;
  }

  private resetOrdersAndDetails() {
    this.orders = [];
    this.orderDetails = [];
  }

  private initializeHeader() {
    if (!this.newItem) {

      this.loading = true;
      var detailRequest = this.purchasingService.queryReceivingReportDetails(this.id);
      var headerRequest = this.purchasingService.getReceivingReport(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.form.patchValue({
          date: new Date(this.common.toLocaleDate(headerResponse.date)),
          vendorId: headerResponse.vendorId,
          systemNo: headerResponse.systemNo,
          refNo: headerResponse.refNo,
          address: headerResponse.address,
          telNo: headerResponse.telNo,
          faxNo: headerResponse.faxNo,
          contactPerson: headerResponse.contactPerson,
          termId: headerResponse.termId,
          comments: headerResponse.comments
        });

        this.initializeOrders(headerResponse.vendorId);
        this.initializeReceiptDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else { this.initializeOrderDetails(null); }
  }

  getReferenceData(): any {
    this.loading = true;
    var termsRequest = this.maintenanceService.queryTerms();
    var vendorsRequest = this.maintenanceService.queryVendors();
    var unitsRequest = this.maintenanceService.queryUnits();
    var itemsRequest = this.maintenanceService.queryItems();
    var warehouseRequest = this.maintenanceService.queryWarehouses();

    forkJoin([termsRequest, vendorsRequest, unitsRequest, itemsRequest, warehouseRequest])
      .subscribe((response) => {
        let termsResponse = response[0];
        let vendorsReponse = response[1];
        let unitsResponse = response[2];
        let itemsResponse = response[3];
        let warehousesResponse = response[4];

        _.forEach(termsResponse, (element => {
          this.terms.push({ value: element.id, label: element.name })
        }));

        _.forEach(vendorsReponse, (el => {
          this.vendors.push({ value: el.id, label: el.name, address: el.address, contactPerson: el.contactPerson, telNo: el.telNo, faxNo: el.faxNo, termId: el.termId })
        }));

        _.forEach(unitsResponse, (element => {
          this.units.push({ value: element.id, label: element.name })
        }));

        _.forEach(warehousesResponse, (element => {
          this.warehouses.push({ value: element.id, label: element.name })
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

    if (unit) {
      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }

    this.ToggleDetailMenu();
  }

  vendorChanged(event) {
    if (event.value) {
      let vendor = this.findVendor(event.value);

      this.f.address.setValue(vendor.address);
      this.f.telNo.setValue(vendor.telNo);
      this.f.faxNo.setValue(vendor.faxNo);
      this.f.contactPerson.setValue(vendor.contactPerson);
      this.f.termId.setValue(vendor.termId);

      this.resetOrdersAndDetails();
      this.initializeOrders(event.value);
    }
  }

  initializeOrders(vendorId: number): any {
    this.loading = true;
    var records = [];
    this.purchasingService.queryPurchasingOrdersByVendor(vendorId).subscribe((resp) => {
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

  initializeOrderDetails(rowData: any): any {
    var records = [];
    if (rowData != null) {
      this.loading = true;
      this.purchasingService.queryPurchasingOrderDetailsPendingRR(rowData.id).subscribe(
        (resp) => {
          records = resp;
          _.forEach(records, (record => {
            var item = this.findItem(record.itemId);
            var unit = this.findUnit(record.unitId);
            var whouse = this.findWarehouse(record.warehouseId);

            record.qty -= record.qtyReceived;
            this.computeSubTotal(record);

            this.orderDetails.push({
              index: _.size(this.orderDetails), id: null, receivingReportId: null, qtyBill: 0, qtyReturn: 0, qtyOriginal: record.qty,
              itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
              unitDescription: unit == null ? null : unit.label, unitPrice: record.unitPrice, discount: record.discount, refNo: rowData.systemNo,
              subTotal: record.subTotal, closed: record.closed, poId: record.purchaseOrderId, podetailId: record.id,
              warehouseId: whouse == null ? null : whouse.value, warehouseDescription: whouse == null ? null : whouse.label
            });
          }));

          this.ToggleDetailMenu();
          this.loading = false;
        },
        (err) => {
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

  initializeReceiptDetails(arr: Array<any>): any {
    _.forEach(arr, (record => {
      var item = this.findItem(record.itemId);
      var unit = this.findUnit(record.unitId);
      var whouse = this.findWarehouse(record.warehouseId);

      this.orderDetails.push({
        index: _.size(this.orderDetails), id: record.id, receivingReportId: record.receivingReportId, qtyBill: record.qtyBill,
        qtyReturn: record.qtyReturn, qtyOriginal: record.qty,
        itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
        unitDescription: unit == null ? null : unit.label, poId: record.poId, podetailId: record.podetailId, refNo: record.porefNo,
        warehouseId: whouse == null ? null : whouse.value, warehouseDescription: whouse == null ? null : whouse.label,
        unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, comments: record.comments
      });
    }));
    this.ToggleDetailMenu();
  }

  loadDetail(rowData) {
    rowData.isLoaded = true;
    this.initializeOrderDetails(rowData);
  }

  findItem(itemId) {
    return this.items.find(x => x.value == itemId);
  }

  findUnit(unitId) {
    return this.units.find(x => x.value == unitId);
  }

  findWarehouse(unitId) {
    return this.warehouses.find(x => x.value == unitId);
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

  warehouseChanged(event, rowData) {
    if (event.value) {
      let warehouse = this.findWarehouse(event.value);

      rowData.warehouseId = warehouse.value;
      rowData.warehouseDescription = warehouse.label;
    }
  }

  getOrderDetails(): any {
    return this.orderDetails.filter(x => x.itemCode != null);
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

    if (!_.every(this.getOrderDetails(), (x) => { return x.warehouseId != null })) {
      this.messaging.warningMessage(this.messaging.WAREHOUSE_ITEMS);
      return;
    }

    this.loading = true;

    var headerRequest = this.newItem ?
      this.purchasingService.addReceivingReport({
        date: this.f.date.value,
        refNo: this.f.refNo.value,
        address: this.f.address.value,
        comments: this.f.comments.value,
        telNo: this.f.telNo.value,
        faxNo: this.f.faxNo.value,
        contactPerson: this.f.contactPerson.value,
        vendorId: this.f.vendorId.value,
        termId: this.f.termId.value,
        mopid: this.f.mopid.value,
        amount: this.getTotal('subTotal'),
        totalAmount: 0
      })
      : this.purchasingService.updateReceivingReport({
        id: this.id,
        date: this.f.date.value,
        refNo: this.f.refNo.value,
        address: this.f.address.value,
        comments: this.f.comments.value,
        telNo: this.f.telNo.value,
        faxNo: this.f.faxNo.value,
        contactPerson: this.f.contactPerson.value,
        termId: this.f.termId.value,
        mopid: this.f.mopid.value,
        amount: this.getTotal('subTotal'),
        totalAmount: 0
      });

    headerRequest.subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.getOrderDetails(), (detail) => {

        if (detail.id == null)
          detailsRequests.push(
            this.purchasingService.addReceivingReportDetail({

              receivingReportId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks,
              poId: detail.poId,
              podetailId: detail.podetailId,
              porefNo: detail.refNo,
              warehouseId: detail.warehouseId,
              closed: detail.closed
            })
          );
        else
          detailsRequests.push(
            this.purchasingService.updateReceivingReportDetail({
              id: detail.id,
              receivingReportId: order.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitPrice: detail.unitPrice,
              discount: detail.discount,
              subTotal: detail.subTotal,
              unitId: detail.unitId,
              remarks: detail.remarks,
              poId: detail.poId,
              podetailId: detail.podetailId,
              porefNo: detail.refNo,
              warehouseId: detail.warehouseId,
              closed: detail.closed
            })
          );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          setTimeout(() => {
            this.router.navigate(['/receiving-reports'])
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
    this.orderDetails.unshift({
      index: _.size(this.orderDetails), id: null, receivingReportId: null, qtyBill: 0, qtyReturn: 0, qtyOriginal: null,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
      unitPrice: null, discount: 0, subTotal: null, refNo: null, closed: false, poId: null, podetailId: null,
      warehouseId: null, warehouseDescription: null
    });
    this.ToggleDetailMenu();
    this.selectedRows = [];
    this.selectedRows.push(_.first(this.orderDetails));
  }

}
