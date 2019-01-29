import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
   
  constructor(public api: ApiService) { }

  updateItemEntryDetail(request :any) {
    return this.api.post(`inventory/item-entries/${request.id}/details/`, request);
  }
  addItemEntryDetail(warehouseId: number, request: any) {
    return this.api.post(`inventory/item-entries/warehouse/${warehouseId}/details`, request);
  }
  updateItemEntry(request:any){
    return this.api.post(`inventory/item-entries/${request.id}`, request);
  }
  addItemEntry(request: any) {
    return this.api.post(`inventory/item-entries`, request);
  }
  deleteItemEntryDetail(id: any, salesOrderId: any): any {
    
  }
  
  getItemEntry(id: number): any {
    return this.api.get(`inventory/item-entries/${id}`, null, false);
  }

  queryItemEntries(): any {
    return this.api.get(`inventory/item-entries`, null, false);
  }

  queryItemEntryDetails(id: number): any {
    return this.api.get(`inventory/item-entries/${id}/details`, null, false);
  }
}
