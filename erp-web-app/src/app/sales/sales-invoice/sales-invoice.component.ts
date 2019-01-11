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
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent implements OnInit {

  form: FormGroup;
  menuItems: MenuItem[];

  id: number;
  newItem: boolean;
  loading: boolean;

  terms: Array<any>;
  customers: Array<any>;
  units: Array<any>;
  items: Array<any>;
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
    this.orderDetails = [];
    this.orders = [];
  }

  ngOnInit() {
    this.app.title = "Sales Invoice Entry";

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
          this.resetOrdersAndDetails();
          this.initializeOrderDetails(null);
        }
      })
    }
  }

  private resetOrdersAndDetails() {
    this.orders = [];
    this.orderDetails = [];
  }

  private initializeHeader() {
    if (!this.newItem) {

      this.loading = true;
      var headerRequest = this.salesService.querySalesInvoiceDetails(this.id);
      var detailRequest = this.salesService.getSalesInvoice(this.id);

      forkJoin([detailRequest, headerRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.form.patchValue({
          date: new Date(headerResponse.date),
          customerId: headerResponse.customerId,
          systemNo: headerResponse.systemNo,
          refNo: headerResponse.refNo,
          address: headerResponse.address,
          telNo: headerResponse.telNo,
          faxNo: headerResponse.faxNo,
          contactPerson: headerResponse.contactPerson,
          termId: headerResponse.termId
        });

        this.initializeOrders(headerResponse.customerId);
        this.initializeSalesInvoiceDetails(detailResponse);

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

    forkJoin([termsRequest, customersRequest, unitsRequest, itemsRequest])
      .subscribe((response) => {
        let termsResponse = response[0];
        let customersReponse = response[1];
        let unitsResponse = response[2];
        let itemsResponse = response[3];

        _.forEach(termsResponse, (element => {
          this.terms.push({ value: element.id, label: element.name })
        }));

        _.forEach(customersReponse, (el => {
          this.customers.push({ value: el.id, label: el.name, address: el.address, contactPerson: el.contactPerson, telNo: el.telNo, faxNo: el.faxNo, termId: el.termId })
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

      this.resetOrdersAndDetails();
      this.initializeOrders(event.value);
    }
  }

  initializeOrders(customerId: number): any {
    this.loading = true;
    var records = [];
    this.salesService.queryPendingDeliveryReceiptsByCustomer(customerId).subscribe((resp) => {
      records = resp;
      _.forEach(records, (record => {
        this.orders.push({
          id: record.id, date: record.date, systemNo: record.systemNo, refNo: record.refNo, closed: record.closed, isLoaded: false
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
    var records = [];
    if (rowData != null)
      this.salesService.queryDeliveryReceiptDetailsPendingInvoice(rowData.id).subscribe((resp) => {
        records = resp;
        _.forEach(records, (record => {
          var item = this.findItem(record.itemId);
          var unit = this.findUnit(record.unitId);

          record.qty -= (record.qtyReturn + record.qtyInvoice)
          this.computeSubTotal(record);

          this.orderDetails.push({
            itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty,
            unitId: unit.value, unitDescription: unit.label, unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal,
            refNo: rowData.systemNo, closed: record.closed, drid: record.deliveryReceiptId, drdetailId: record.id
          });
        }))
        this.loading = false;
      }, (err) => {
        this.loading = false;
      });
    else
      for (let a = 0; a < 8; a++) {
        this.orderDetails.push({
          itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
          unitPrice: null, discount: null, subTotal: null, refNo: '', closed: false, drid: null, drdetailId: null
        });
      }
  }

  initializeSalesInvoiceDetails(arr: Array<any>): any {
    _.forEach(arr, (record => {
      var item = this.findItem(record.itemId);
      var unit = this.findUnit(record.unitId);

      this.orderDetails.push({
        itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit == null ? null : unit.value,
        unitDescription: unit == null ? null : unit.label, drid: record.deliveryReceiptId, drdetailId: record.id, refNo: record.drrefNo,
        unitPrice: record.unitPrice, discount: record.discount, subTotal: record.subTotal, remarks: record.remarks
      });
    }));
  }

  findItem(itemId) {
    return this.items.find(x => x.value == itemId);
  }

  findUnit(unitId) {
    return this.units.find(x => x.value == unitId);
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

  getOrderDetails(): any {
    return this.orderDetails.filter(x => x.itemCode != null);
  }

  loadDetail(rowData) {
    rowData.isLoaded = true;
    this.initializeOrderDetails(rowData);
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

    this.loading = true;

    this.salesService.addSalesInvoice({
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
          this.salesService.addSalesInvoiceDetail({

            salesInvoiceId: order.id,
            itemId: detail.itemId,
            qty: detail.qty,
            unitPrice: detail.unitPrice,
            discount: detail.discount,
            subTotal: detail.subTotal,
            unitId: detail.unitId,
            remarks: detail.remarks,
            drid: detail.drid,
            drdetailId: detail.drdetailId,
            drrefNo: detail.refNo,
            closed: detail.closed
          })
        );
      });
      forkJoin(detailsRequests)
        .subscribe((resp) => {
          this.loading = false;
          this.messaging.successMessage(this.messaging.ADD_SUCCESS);
          this.router.navigate(['/sales-orders'])
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
