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

@Component({
  selector: 'app-item-release',
  templateUrl: './item-release.component.html',
  styleUrls: ['./item-release.component.css']
})
export class ItemReleaseComponent implements AfterViewInit {

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

  constructor(
    private maintenanceService: MaintenanceService,
    private inventoryService: InventoryService,
    private router: Router,
    private messaging: MessagingService,
    private app: AppComponent,
    private route: ActivatedRoute
  ) {
    this.units = [];
    this.items = [];
    this.reasons = [];
    this.warehouses = [];
    this.details = [];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => this.id = params.id);
    this.newItem = this.id == 0 ? true : false;
    this.transactionType = "IR";
    this.app.title = "Item Release - Entry";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getReferenceData();
    });

  }

  private initializeHeader() {
    if (!this.newItem) {
      this.loading = true;
      var detailRequest = this.inventoryService.queryItemReleaseDetails(this.id);
      var headerRequest = this.inventoryService.getItemRelease(this.id);

      forkJoin([headerRequest, detailRequest]).subscribe((response) => {
        var headerResponse = response[0];
        var detailResponse = response[1];

        this.inventoryHeaderComponent.updateForm(headerResponse);

        this.initializeDetails(detailResponse);

        this.loading = false;

      }, (err) => { });
    } else {
      this.initializeDetails(null);
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

  initializeDetails(arr: Array<any>): any {
    this.details = [];

    if (arr == null)
      this.addTableRow();
    else {
      _.forEach(arr, (record => {
        var item = this.inventoryDetailComponent.findItem(record.itemId);
        var unit = this.inventoryDetailComponent.findUnit(record.unitId);
        var reason = this.inventoryDetailComponent.findReason(record.reasonId);

        this.details.push({
          index: _.size(this.details), id: record.id, itemReleaseId: record.itemReleaseId, qtyOnHand: record.qtyOnHand,
          itemId: item.value, itemCode: item.code, description: item.label, qty: record.qty, unitId: unit.value, unitDescription: unit.label,
          remarks: record.remarks, reasonId: reason.value, reasonDescription: reason.label
        });

        this.inventoryDetailComponent.ToggleDetailMenu();
      }));
    }
  }

  private addTableRow() {
    this.details.unshift({

      index: _.size(this.details), id: null, itemReleaseId: null, qtyOnHand: 0,
      itemId: null, itemCode: null, description: '', qty: null, unitId: null, unitDescription: null,
      remarks: '', reasonId: null, reasonDescription: ''
    });
    this.inventoryDetailComponent.ToggleDetailMenu();
    this.inventoryDetailComponent.selectedRows = [];
    this.inventoryDetailComponent.selectedRows.push(_.first(this.details));
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

    var nonApiCallsRequest = selectedRows.filter(x => x.itemReleaseId == null);
    if (nonApiCallsRequest != null && nonApiCallsRequest != []) {
      _.forEach(nonApiCallsRequest, (row => {
        _.remove(this.details, function (x) { return x.index == row.index; });
      }));
    }
    var apiCallsRequest = selectedRows.filter(x => x.itemReleaseId != null);
    if (apiCallsRequest != null && apiCallsRequest != []) {
      var deleteRequests = [];
      _.forEach(apiCallsRequest, (row => {
        deleteRequests.push(this.inventoryService.deleteItemReleaseDetail(row.id, row.itemReleaseId));
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

  isDeleteRowsEnabled(details: Array<any>): boolean {
    if (_.size(details) == 0)
      return false;

    return _.size(details.filter(x => x.qtyOnHand == 0)) > 0;
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
      ? this.inventoryService.addItemRelease({
        date: controls.date.value,
        refNo: controls.refNo.value,
        description: controls.description.value,
        warehouseId: controls.warehouseId.value
      })
      : this.inventoryService.updateItemRelease({
        id: this.id,
        date: controls.date.value,
        refNo: controls.refNo.value,
        description: controls.description.value,
        warehouseId: controls.warehouseId.value
      })

    headerRequest.subscribe((resp) => {

      let release: any;
      let detailsRequests = [];
      release = resp;

      _.forEach(this.inventoryDetailComponent.getDetails(), (detail) => {

        if (detail.id == null)
          detailsRequests.push(
            this.inventoryService.addItemReleaseDetail(
              controls.warehouseId.value,
              {
                itemReleaseId: release.id,
                itemId: detail.itemId,
                qty: detail.qty,
                unitId: detail.unitId,
                reasonId: detail.reasonId,
                remarks: detail.remarks
              })
          );
        else {
          detailsRequests.push(
            this.inventoryService.updateItemReleaseDetail({
              id: detail.id,
              itemReleaseId: detail.id,
              itemId: detail.itemId,
              qty: detail.qty,
              unitId: detail.unitId,
              reasonId: detail.reasonId,
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
            this.router.navigate(['/inventory/item-releases']);
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
