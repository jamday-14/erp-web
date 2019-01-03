import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';
import _ from "lodash";
import { forkJoin } from 'rxjs';
import { SalesService } from 'src/app/services/sales.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {

  form: FormGroup;
  menuItems: MenuItem[];

  newItem: boolean;
  loading: boolean;

  terms: Array<any>;
  customers: Array<any>;
  units: Array<any>;
  items: Array<any>;
  orderDetails: Array<any>;
  searchedItems: any[];
  footerData: any;

  constructor(
    private maintenanceService: MaintenanceService,
    private salesService: SalesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sumPipe: SumFilterPipe,
    private messaging: MessagingService,
    private app: AppComponent
  ) {
    this.customers = [];
    this.terms = [];
    this.units = [];
    this.items = [];
    this.orderDetails = [];
  }

  ngOnInit() {
    this.app.title = "Sales Order Entry";
    this.initializeMenu();
    this.initializeForm(null);
    this.getReferenceData();
    this.initializeOrderDetails();
  }

  initializeOrderDetails(): any {
    this.orderDetails = [];
    for (let a = 0; a < 10; a++) {
      this.orderDetails.push({
        itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
        unitPrice: null, discount: null, subTotal: null, remarks: ''
      });
    }
  }

  initializeForm(item: any): any {
    this.newItem = item == null ? true : false;

    this.form = this.formBuilder.group({
      date: [item != null ? item.name : null, Validators.required],
      refNo: [item != null ? item.refNo : ''],
      systemNo: [item != null ? item.systemNo : '', Validators.required],
      customerId: [item != null ? item.customerId : null, Validators.required],
      address: [item != null ? item.address : ''],
      telNo: [item != null ? item.telNo : ''],
      faxNo: [item != null ? item.faxNo : ''],
      contactPerson: [item != null ? item.contactPerson : ''],
      termId: [item != null ? item.termId : null]
    });
  }

  initializeMenu() {
    this.menuItems = [
      {
        label: 'Save', icon: 'pi pi-save', command: () => {
          this.save();
        }
      },
      {
        label: 'Reset', icon: 'pi pi-circle-off', command: () => {
          this.initializeForm(null);
          this.initializeOrderDetails();
        }
      }
    ];
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
    }
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

    this.salesService.addSalesOrder({
      date: this.f.date.value,
      refNo: this.f.refNo.value,
      address: this.f.address.value,
      telNo: this.f.telNo.value,
      faxNo: this.f.faxNo.value,
      contactPerson: this.f.contactPerson.value,
      systemNo: this.f.systemNo.value,
      customerId: this.f.customerId.value,
      termId: this.f.termId.value,
      amount: this.getTotalSubTotal()
    }).subscribe((resp) => {

      let order: any;
      let detailsRequests = [];
      order = resp;

      _.forEach(this.getOrderDetails(), (detail) => {

        detailsRequests.push(
          this.salesService.addSalesOrderDetail({

            salesOrderId: order.id,
            itemId: detail.itemId,
            qty: detail.qty,
            unitPrice: detail.unitPrice,
            discount: detail.discount,
            subTotal: detail.subTotal,
            unitId: detail.unitId,
            remarks: detail.remarks
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