import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { SumFilterPipe } from 'src/app/sum-filter.pipe';

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
    private router: Router,
    private formBuilder: FormBuilder,
    private sumPipe: SumFilterPipe
  ) {
    this.customers = [];
    this.terms = [];
    this.units = [];
    this.items = [];
    this.orderDetails = [];
  }

  ngOnInit() {
    this.initializeMenu();
    this.initializeForm(null);
    this.getReferenceData();
    this.initializeOrderDetails();
  }
  initializeOrderDetails(): any {
    for (let a = 0; a < 10; a++) {
      this.orderDetails.push({ itemCode: null, description: '', qty: null, unitId: null, unitDescription: null, unitPrice: null, discount: null, subTotal: null, remarks: '' });
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

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Save', icon: 'pi pi-save', command: () => {
          // this.router.navigate(['/sales-order']);
        }
      }
    ];
  }

  private getReferenceData(): any {
    this.loading = true;
    this.maintenanceService.queryTerms().subscribe((resp) => {
      let arr: any;
      arr = resp;
      arr.forEach(element => {
        this.terms.push({ value: element.id, label: element.name })
      });
    }, (err) => { });
    this.maintenanceService.queryCustomers()
      .subscribe((resp) => {
        let arr: any;
        arr = resp;
        arr.forEach(element => {
          this.customers.push({ value: element.id, label: element.name })
        });
      }, (err) => { });
    this.maintenanceService.queryUnits()
      .subscribe((resp) => {
        let arr: any;
        arr = resp;
        arr.forEach(element => {
          this.units.push({ value: element.id, label: element.name })
        });
      }, (err) => { });

    this.maintenanceService.queryItems()
      .subscribe((resp) => {
        let arr: any;
        arr = resp;
        arr.forEach(element => {
          this.items.push({ value: element.id, label: element.description, code: element.itemCode, unitPrice: element.unitPrice, unitId: element.unitId })
        });
        this.loading = false;
      }, (err) => { });
  }

  get f() { return this.form.controls; }

  itemChanged(event, rowData) {
    let item = this.findItem(event.value);
    let unit = this.findUnit(item.unitId);

    rowData.description = item.label;
    rowData.itemCode = item.code;
    rowData.unitPrice = item.unitPrice;
    
    if (unit) {
      rowData.unitId = unit.value;
      rowData.unitDescription = unit.label;
    }
  }

  findItem(itemId) {
    return this.items.find(x => x.value == itemId);
  }

  findUnit(unitId) {
    return this.units.find(x => x.value == unitId);
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
}
