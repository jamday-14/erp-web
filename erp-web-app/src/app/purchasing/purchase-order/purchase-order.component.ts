import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { SalesService } from 'src/app/services/sales.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { PurchasingService } from 'src/app/services/purchasing.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {

  id: number;
  form: FormGroup;
  menuItems: MenuItem[];
  
  newItem: boolean;
  loading: boolean;

  terms: Array<any>;
  vendors: Array<any>;
  units: Array<any>;
  items: Array<any>;
  orderDetails: Array<any>;
  searchedItems: any[];
  footerData: any;
  
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
    this.orderDetails = [];
    this.allSelected = false;
  }

  ngOnInit() {

    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;

    this.app.title = "Purchase Order Entry";

    this.initializeMenu();
    this.initializeForm(null);
    this.getReferenceData();

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
    var nonApiCallsRequest = this.selectedRows.filter(x => x.purchaseOrderId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.orderDetails, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = this.selectedRows.filter(x => x.purchaseOrderId != null);
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

  isDeleteDetailsEnabled(): boolean {
    if (_.size(this.getOrderDetails()) == 0)
      return false;
    return _.size(this.getOrderDetails().filter(x => x.qtyReceived == 0)) > 0;
  }

  isDetailEditable(rowData) {
    return rowData.qtyReceived == 0;
  }

  private initializeHeader() {
    if (!this.newItem) {
      this.loading = true;
      var detailRequest = this.purchasingService.queryPurchasingOrderDetails(this.id);
      var headerRequest = this.purchasingService.getPurchasingOrder(this.id);

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
          termId: headerResponse.termId
        });

        this.initializeOrderDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else { this.initializeOrderDetails(null); }
  }

  initializeForm(item: any): any {
    this.form = this.formBuilder.group({
      date: [item != null ? item.date : null, Validators.required],
      refNo: [item != null ? item.refNo : ''],
      systemNo: [item != null ? item.systemNo : ''],
      vendorId: [item != null ? item.vendorId : null, Validators.required],
      address: [item != null ? item.address : ''],
      telNo: [item != null ? item.telNo : ''],
      faxNo: [item != null ? item.faxNo : ''],
      contactPerson: [item != null ? item.contactPerson : ''],
      termId: [item != null ? item.termId : null]
    });
  }

  initializeOrderDetails(arr: Array<any>): any {
    this.orderDetails = [];

    if (arr == null)
      this.addTableRow();
    else {
      _.forEach(arr, (record => {
        var item = this.findItem(record.itemId);
        var unit = this.findUnit(record.unitId);

        this.orderDetails.push({
          index: _.size(this.orderDetails), id: record.id, purchaseOrderId: record.purchaseOrderId, qtyReceived: record.qtyReceived,
          itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
          unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks, closed: record.closed
        });

        this.ToggleDetailMenu();
      }));
    }
  }

  private ToggleDetailMenu() {
    this.detailMenuItems[2].disabled = !this.isDeleteDetailsEnabled();
  }

  getReferenceData(): any {
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
    }
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
      ? this.purchasingService.addPurchasingOrder({
        date: this.f.date.value,
        refNo: this.f.refNo.value,
        address: this.f.address.value,
        telNo: this.f.telNo.value,
        faxNo: this.f.faxNo.value,
        contactPerson: this.f.contactPerson.value,
        systemNo: this.f.systemNo.value,
        vendorId: this.f.vendorId.value,
        termId: this.f.termId.value,
        amount: this.getTotal('subTotal')
      })
      : this.purchasingService.updatePurchasingOrder({
        id: this.id,
        date: this.f.date.value,
        refNo: this.f.refNo.value,
        address: this.f.address.value,
        telNo: this.f.telNo.value,
        faxNo: this.f.faxNo.value,
        contactPerson: this.f.contactPerson.value,
        termId: this.f.termId.value,
        amount: this.getTotal('subTotal')
      })

    headerRequest.subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.getOrderDetails(), (detail) => {

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

  OnEnter(index, rowData) {
    if (this.orderDetails.length == (index + 1) && rowData.itemCode != null)
      this.addTableRow();
  }

  addTableRow() {
    this.orderDetails.unshift({
      index: _.size(this.orderDetails), id: null, purchaseOrderId: null,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
      unitPrice: null, discount: null, subTotal: null, remarks: '', closed: false, qtyReceived: 0
    });
    this.ToggleDetailMenu();
    this.selectedRows = [];
    this.selectedRows.push(_.first(this.orderDetails));
  }

}
