import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemEntryComponent } from './item-entry/item-entry.component';
import { ItemEntriesComponent } from './item-entries/item-entries.component';
import { ItemReleasesComponent } from './item-releases/item-releases.component';
import { ItemReleaseComponent } from './item-release/item-release.component';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { ComponentsModule } from '../components/components.module';
import { GoodsTransfersComponent } from './goods-transfers/goods-transfers.component';
import { GoodsTransferComponent } from './goods-transfer/goods-transfer.component';
import { GoodsTransferReceiptsComponent } from './goods-transfer-receipts/goods-transfer-receipts.component';
import { GoodsTransferReceiptComponent } from './goods-transfer-receipt/goods-transfer-receipt.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: 'item-entries', pathMatch: 'full' },
      { path: 'item-entries', component: ItemEntriesComponent },
      { path: 'item-entry/:id', component: ItemEntryComponent },
      { path: 'item-releases', component: ItemReleasesComponent },
      { path: 'item-release/:id', component: ItemReleaseComponent },
      { path: 'goods-transfers', component: GoodsTransfersComponent },
      { path: 'goods-transfer/:id', component: GoodsTransferComponent },
      { path: 'goods-transfer-receipts', component: GoodsTransferReceiptsComponent },
      { path: 'goods-transfer-receipt/:id', component: GoodsTransferReceiptComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ItemEntryComponent,
    ItemEntriesComponent,
    ItemReleasesComponent,
    ItemReleaseComponent,
    InventoryComponent,
    GoodsTransfersComponent,
    GoodsTransferComponent,
    GoodsTransferReceiptsComponent,
    GoodsTransferReceiptComponent
  ]
})
export class InventoryModule { }
