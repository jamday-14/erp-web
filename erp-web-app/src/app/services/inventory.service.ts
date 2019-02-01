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
  deleteItemEntryDetail(id: any, itemEntryId: any): any {
    
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

  queryItemReleases(): any {
    return this.api.get(`inventory/item-releases`, null, false);
  }

  getItemRelease(id: number): any {
    return this.api.get(`inventory/item-releases/${id}`, null, false);
  }

  queryItemReleaseDetails(id: number): any {
    return this.api.get(`inventory/item-releases/${id}/details`, null, false);
  }

  updateItemReleaseDetail(request :any) {
    return this.api.post(`inventory/item-releases/${request.id}/details/`, request);
  }
  addItemReleaseDetail(warehouseId: number, request: any) {
    return this.api.post(`inventory/item-releases/warehouse/${warehouseId}/details`, request);
  }
  updateItemRelease(request:any){
    return this.api.post(`inventory/item-releases/${request.id}`, request);
  }
  addItemRelease(request: any) {
    return this.api.post(`inventory/item-releases`, request);
  }
  deleteItemReleaseDetail(id: any, itemReleaseId: any): any {
    
  }

  queryGoodsTransfers(): any {
    return this.api.get(`inventory/goods-transfers`, null, false);
  }

  getGoodsTransfer(id: number): any {
    return this.api.get(`inventory/goods-transfers/${id}`, null, false);
  }

  queryGoodsTransferDetails(id: number): any {
    return this.api.get(`inventory/goods-transfers/${id}/details`, null, false);
  }

  updateGoodsTransferDetail(request :any) {
    return this.api.post(`inventory/goods-transfers/${request.id}/details/`, request);
  }

  addGoodsTransferDetail(request: any) {
    return this.api.post(`inventory/goods-transfers/${request.goodsTransferId}/details`, request);
  }

  updateGoodsTransfer(request:any){
    return this.api.post(`inventory/goods-transfers/${request.id}`, request);
  }

  addGoodsTransfer(request: any) {
    return this.api.post(`inventory/goods-transfers`, request);
  }

  deleteGoodsTransferDetail(id: any, goodsTransferId: any): any {
    
  }

  queryGoodsTransferReceipts(): any {
    return this.api.get(`inventory/goods-transfer-receives`, null, false);
  }

  getGoodsTransferReceipt(id: number): any {
    return this.api.get(`inventory/goods-transfer-receives/${id}`, null, false);
  }

  queryGoodsTransferReceiptDetails(id: number): any {
    return this.api.get(`inventory/goods-transfer-receives/${id}/details`, null, false);
  }

  updateGoodsTransferReceiptDetail(request :any) {
    return this.api.post(`inventory/goods-transfer-receives/${request.id}/details/`, request);
  }

  addGoodsTransferReceiptDetail(request: any) {
    return this.api.post(`inventory/goods-transfer-receives/${request.goodTransferReceivedId}/details`, request);
  }

  updateGoodsTransferReceipt(request:any){
    return this.api.post(`inventory/goods-transfer-receives/${request.id}`, request);
  }

  addGoodsTransferReceipt(request: any) {
    return this.api.post(`inventory/goods-transfer-receives`, request);
  }

  deleteGoodsTransferReceiptDetail(id: any, goodTransferReceivedId: any): any {
    
  }

}
