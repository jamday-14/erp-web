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

@Component({
  selector: 'app-delivery-receipt',
  templateUrl: './delivery-receipt.component.html',
  styleUrls: ['./delivery-receipt.component.css']
})
export class DeliveryReceiptComponent implements OnInit {

  form: FormGroup;
  menuItems: MenuItem[];

  id: number;
  newItem: boolean;
  loading: boolean;

  terms: Array<any>;
  customers: Array<any>;
  units: Array<any>;
  items: Array<any>;
  warehouses: Array<any>;
  orderDetails: Array<any>;
  orders: Array<any>;
  searchedItems: any[];
  footerData: any;
  cols: any[];

  constructor(
    private maintenanceService: MaintenanceService,
    private salesService: SalesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sumPipe: SumFilterPipe,
    private messaging: MessagingService,
    private app: AppComponent,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.customers = [];
    this.terms = [];
    this.units = [];
    this.items = [];
    this.warehouses = [];
    this.orderDetails = [];
    this.orders = [];
  }

  ngOnInit() {
    this.app.title = "Delivery Receipt Entry";

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
      customerId: [item != null ? item.customerId : null, Validators.required],
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
          this.initializeOrderDetails(null);
        }
      })
    }
  }

  private initializeHeader() {
    if (!this.newItem) {

      this.loading = true;
      var salesOrderDetailsRequest = this.salesService.queryDeliveryReceiptDetails(this.id);
      var salesOrdersRequest = this.salesService.getDeliveryReceipt(this.id);

      forkJoin([salesOrdersRequest, salesOrderDetailsRequest]).subscribe((response) => {
        var soResponse = response[0];
        var sodResponse = response[1];

        this.form.patchValue({
          date: new Date(soResponse.date),
          customerId: soResponse.customerId,
          systemNo: soResponse.systemNo,
          refNo: soResponse.refNo,
          address: soResponse.address,
          telNo: soResponse.telNo,
          faxNo: soResponse.faxNo,
          contactPerson: soResponse.contactPerson,
          termId: soResponse.termId
        });

        this.initializeOrders(soResponse.customerId);
        this.initializeReceiptDetails(sodResponse);

        this.loading = false;

      }, (err) => { });
    } else { this.initializeOrderDetails(null); }
  }

  getReferenceData(): any {
    this.loading = true;
    var termsRequest = this.maintenanceService.queryTerms();
    var customersRequest = this.maintenanceService.queryCustomers();
    var unitsRequest = this.maintenanceService.queryUnits();
    var itemsRequest = this.maintenanceService.queryItems();
    var warehouseRequest = this.maintenanceService.queryWarehouses();

    forkJoin([termsRequest, customersRequest, unitsRequest, itemsRequest, warehouseRequest])
      .subscribe((response) => {
        let termsResponse = response[0];
        let customersReponse = response[1];
        let unitsResponse = response[2];
        let itemsResponse = response[3];
        let warehousesResponse = response[4];

        _.forEach(termsResponse, (element => {
          this.terms.push({ value: element.id, label: element.name })
        }));

        _.forEach(customersReponse, (el => {
          this.customers.push({ value: el.id, label: el.name, address: el.address, contactPerson: el.contactPerson, telNo: el.telNo, faxNo: el.faxNo, termId: el.termId })
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
  }

  customerChanged(event) {
    if (event.value) {
      let customer = this.findCustomer(event.value);

      this.f.address.setValue(customer.address);
      this.f.telNo.setValue(customer.telNo);
      this.f.faxNo.setValue(customer.faxNo);
      this.f.contactPerson.setValue(customer.contactPerson);
      this.f.termId.setValue(customer.termId);

      this.orderDetails = [];
      this.initializeOrders(event.value);
    }
  }

  initializeOrders(customerId: number): any {
    this.loading = true;
    var records = [];
    this.orders = [];
    this.salesService.querySalesOrdersByCustomer(customerId).subscribe((resp) => {
      records = resp;
      _.forEach(records, (record => {
        this.orders.push({
          id: record.id, date: record.date, systemNo: record.systemNo, refNo: record.refNo, closed: record.closed, isLoaded: false
        });
      }))

      // if (_.size(this.orders) == 0) {
      //   this.initializeOrderDetails(null);
      // }

      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  initializeOrderDetails(rowData: any): any {
    var records = [];
    if (rowData != null) {
      this.loading = true;
      this.salesService.querySalesOrderDetailsPendingDR(rowData.id).subscribe((resp) => {
        records = resp;
        this.loading = false;
        _.forEach(records, (record => {
          var item = this.findItem(record.itemId);
          var unit = this.findUnit(record.unitId);
          var whouse = this.findWarehouse(record.warehouseId);

          record.qty -= record.qtyDr;
          this.computeSubTotal(record);

          this.orderDetails.push({
            itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
            unitDescription: unit == null ? null : unit.label, unitPrice: record.unitPrice, discount: record.discount, refNo: rowData.systemNo,
            subTotal: record.subTotal, closed: record.closed, soid: record.salesOrderId, sodetailId: record.id,
            warehouseId: whouse == null ? null : whouse.value, warehouseDescription: whouse == null ? null : whouse.label
          });
        }))
      }, (err) => {
        this.loading = false;
      });
    }
    else
      for (let a = 0; a < 8; a++) {
        this.orderDetails.push({
          itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
          unitPrice: null, discount: null, subTotal: null, refNo: null, closed: false, soid: null, sodetailId: null,
          warehouseId: null, warehouseDescription: null
        });
      }
  }

  initializeReceiptDetails(arr: Array<any>): any {
    if (arr == null)
      for (let a = 0; a < 10; a++) {
        this.orderDetails.push({
          itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
          unitPrice: null, discount: null, subTotal: null, remarks: ''
        });
      }
    else {
      _.forEach(arr, (record => {
        var item = this.findItem(record.itemId);
        var unit = this.findUnit(record.unitId);
        var whouse = this.findWarehouse(record.warehouseId);

        this.orderDetails.push({
          itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
          unitDescription: unit == null ? null : unit.label, soid: record.salesOrderId, sodetailId: record.id, refNo: record.sorefNo,
          warehouseId: whouse == null ? null : whouse.value, warehouseDescription: whouse == null ? null : whouse.label,
          unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks
        });
      }));
    }
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

  findCustomer(customerId) {
    return this.customers.find(x => x.value == customerId);
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

  getTotalQty() {
    return this.sumPipe.transform(this.getOrderDetails(), 'qty');
  }

  getTotalDiscount() {
    return this.sumPipe.transform(this.getOrderDetails(), 'discount');
  }

  getTotalUnitPrice() {
    return this.sumPipe.transform(this.getOrderDetails(), 'unitPrice');
  }

  getTotalSubTotal() {
    return this.sumPipe.transform(this.getOrderDetails(), 'subTotal');
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

    this.salesService.addDeliveryReceipt({
      date: this.f.date.value,
      refNo: this.f.refNo.value,
      address: this.f.address.value,
      comments: this.f.comments.value,
      telNo: this.f.telNo.value,
      faxNo: this.f.faxNo.value,
      contactPerson: this.f.contactPerson.value,
      // systemNo: this.f.systemNo.value,
      customerId: this.f.customerId.value,
      termId: this.f.termId.value,
      mopid: this.f.mopid.value,
      amount: this.getTotalSubTotal(),
      totalAmount: 0
    }).subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.getOrderDetails(), (detail) => {

        detailsRequests.push(
          this.salesService.addDeliveryReceiptDetail({

            deliveryReceiptId: order.id,
            itemId: detail.itemId,
            qty: detail.qty,
            unitPrice: detail.unitPrice,
            discount: detail.discount,
            subTotal: detail.subTotal,
            unitId: detail.unitId,
            remarks: detail.remarks,
            soid: detail.soid,
            sodetailId: detail.sodetailId,
            sorefNo: detail.refNo,
            warehouseId: detail.warehouseId,
            closed: detail.closed
          })
        );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          this.router.navigate(['/delivery-receipts'])
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
